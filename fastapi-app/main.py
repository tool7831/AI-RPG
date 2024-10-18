from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import OAuth2PasswordRequestForm

from gen_story import run, create_thread, retrieve_thread
from glob import glob

import random
import datetime
import json
import os

import crud, models, schemas
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
test = True

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
    filepath = "./data/worldview/kr"
    data = {}
    for file in os.listdir(filepath):
        f = open(os.path.join(filepath,file), "r")
        data[file] = f.read()
    return JSONResponse(content=data)

@app.post("/first",  response_model=schemas.UserResponse)
async def first(user_input: schemas.UserInput, current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    
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
        },
        {
            "type" :"text",
            "text": "한국어로 생성."
        }   
    ]
    

    user_thread = create_thread()
    print('thread create')

    def stream_data():
        content = ''
        yield "{"
        yield f'"stage": {user_input.stage + 1},'
        yield f'"player":{json.dumps(user_input.player)},'
        yield '"content":'
        for chunk in run(user_thread, message):
            content += chunk
            print(chunk, flush=True, end='')
            yield chunk
        yield "}"
        save = dict({"stage": user_input.stage + 1,"player":user_input.player, "content": json.loads(content)})    
        updated_user_data = crud.add_or_update_user_data(db, current_user.id, {
            "thread_id": user_thread.id if test else None,
            "save": save
        })
        
    return StreamingResponse(stream_data(),status_code=status.HTTP_201_CREATED, media_type='str')

@app.post("/story_gen")
async def story(user_input: schemas.UserInput, current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    thread_id = user_data.json_data['thread_id']

    if 'next_type' in user_input.story:
        story = {
            'stage': user_input.stage,
            'text': user_input.story['text'],
            'next_type': user_input.story['next_type']
        }
        if user_input.story['next_type'] == 'combat':
            enemy_lv = random.randint(user_input.player['level'] + story['stage'], user_input.player['level'] + story['stage'] + 10)
            if enemy_lv < 1:
                enemy_lv = 1
            enemy_type = random.choices(['common', 'elite', 'boss'], [0.9, 0.09, 0.01])[0]
            story['text'] = f'Make level {enemy_lv} {enemy_type} enemy.' + story['text']
            print(story['text'])

    else:
        story = {'text': user_input.story['text'],}
        
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
    

    user_thread = retrieve_thread(thread_id) 
    def stream_data():
        content = ''
        yield "{"
        yield f'"stage": {user_input.stage + 1},'
        yield f'"player":{json.dumps(user_input.player)},'
        yield '"content":'
        for chunk in run(user_thread, message):
            content += chunk
            print(chunk, flush=True, end='')
            yield chunk
        yield "}"
        save = dict({"stage": user_input.stage + 1,"player":user_input.player, "content": json.loads(content)})    
        updated_user_data = crud.add_or_update_user_data(db, current_user.id, {
            "thread_id": user_thread.id if test else None,
            "save": save
        })

    return StreamingResponse(stream_data(),status_code=status.HTTP_201_CREATED, media_type='str')

@app.get("/load_data")
def load(current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    return JSONResponse(content=user_data.json_data['save'])

@app.get("/defeat")
def defeat(current_user: schemas.UserResponse = Depends(crud.get_current_user), db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.user_id == current_user.id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User data not found")
    db.delete(user_data)
    db.commit()
    return JSONResponse(content={"detail": "User data deleted successfully"})

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


