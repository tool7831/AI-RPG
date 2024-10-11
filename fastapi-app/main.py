from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from pydantic import BaseModel
from gen_story import run, create_thread
from glob import glob

import datetime
import json
import os

import crud, models, schemas
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
user_thread = {}
test = False
origins = [
    "http://localhost:3000",  # React 애플리케이션이 실행되는 도메인
]

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 여기에 React 애플리케이션의 URL을 명시할 수 있습니다.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=crud.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crud.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})


@app.post("/sign-up", response_model=schemas.UserCreate)
def sign_up(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    crud.create_user(db=db, user=user)
    
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "Signup successful. Please log in."})


@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    # Fetch the user's associated JSON data from the UserData table
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    
    # Prepare the response
    current_user_with_data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "user_data": user_data.json_data if user_data else None  # Return JSON data if available
    }
    
    return JSONResponse(content=current_user_with_data)


@app.post("/worldview")
def read_root():
    filepath = "./data/worldview"
    data = {}
    for file in os.listdir(filepath):
        f = open(os.path.join(filepath,file), "r")
        data[file] = f.read()
    return JSONResponse(content=data)

@app.post("/first",  response_model=schemas.UserResponse)
def first(user_input: schemas.UserInput, current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    
    if not current_user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    worldView = user_input.story['text']
    playerInput = {
        'name':user_input.player['name'],
        'description':user_input.player['description'],
        'level': user_input.player['level'],
        'status': user_input.player['status']['status'],
        }
    
    message = [
        {
            "type": "text",
            "text": {"Worldview":worldView}
        },
        {
            "type": "text",
            "text": {"player":playerInput}
        }   
    ]
    
    if test:
        user_thread = create_thread()
        print('thread create')
        next = run(user_thread, message)
    else:
        with open('data/sample_story.json', 'r') as f:
            next = json.load(f)

    save = dict({"player":user_input.player}, **next)
    updated_user_data = crud.add_or_update_user_data(db, current_user.id, {
        "thread_id": user_thread.id if test else None,
        "save": save
    })
    
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=save)

@app.post("/story_gen")
def story(user_input: schemas.UserInput, current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    thread_id = user_data.json_data['thread_id']

    if 'next_type' in user_input.story:
        story = {'text': user_input.story['text'],
                'next_type': user_input.story['next_type']}
        if not test:
            with open('data/sample_combat.json', 'r') as f:
                next = json.load(f)
    else:
        story = {'text': user_input.story['text'],}
        if not test:
            with open('data/sample_story.json', 'r') as f:
                next = json.load(f)
    playerInput = {
        'name':user_input.player['name'],
        'description':user_input.player['description'],
        'level': user_input.player['level'],
        'status': user_input.player['status']['status'],
        }
    message = [
        {
            "type": "text",
            "text": story
        },
        {
            "type": "text",
            "text": {"player":playerInput}
        }   
    ]
    
    if test:
        next = run(thread_id, message)

    save = dict({"player":user_input.player}, **next)
    updated_user_data = crud.add_or_update_user_data(db, current_user.id, {
        "thread_id": user_thread.id if test else None,
        "save": save
    })

    return JSONResponse(content=save)

@app.get("/load_data")
def load(current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    return JSONResponse(content=user_data.json_data['save'])

@app.get("/skills")
def skills():
    data = []
    class_paths = sorted(glob('data/class/*'))
    for class_path in class_paths:
        attack_path = glob(os.path.join(class_path, 'skills/attacks/*json'))
        attacks = []
        for path in attack_path:
            with open(path, 'r') as f:
                attacks.append(json.load(f))
        defends = []
        defend_path = glob(os.path.join(class_path, 'skills/defends/*json'))
        for path in defend_path:
            with open(path, 'r') as f:
                defends.append(json.load(f))
        smite_path = glob(os.path.join(class_path, 'skills/smites/*json'))
        smites = []
        for path in smite_path:
            with open(path, 'r') as f:
                smites.append(json.load(f))
        with open(os.path.join(class_path, 'stats.json'), 'r') as f:
            stats = json.load(f) 
        data.append({
            'class_name': os.path.basename(class_path),
            'stats': stats,
            'attacks': attacks,
            'defends': defends,
            'smites': smites,
        })
    return JSONResponse(data)


