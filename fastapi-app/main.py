from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gen_story import run, create_thread
import json
import os
from glob import glob

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

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

class Input(BaseModel):
    story: dict
    player: dict


@app.post("/")
def read_root():
    filepath = "data/worldview"
    data = {}
    for file in os.listdir(filepath):
        f = open(os.path.join(filepath,file), "r")
        data[file] = f.read()
    print(data)
    
    if test:
        user_thread['user1'] = create_thread()
        with open(f'data/user1/thread_id', 'w') as f:
            f.write(user_thread['user1'].id)
        print('thread create')
    return JSONResponse(data)

@app.post("/first")
def first(input: Input):
    print(input)
    print(user_thread)
    
    worldView = input.story['text']
    playerInput = {
        'name':input.player['name'],
        'description':input.player['description'],
        'level': input.player['level'],
        'status': input.player['status']['status'],
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
        next = run(user_thread['user1'], message)
    else:
        with open('data/sample_story.json', 'r') as f:
            next = json.load(f)

    data = dict({"player":input.player}, **next)
    with open('data/save.json','w') as f:
        json.dump(data,f)
    return JSONResponse({"success":True})

@app.post("/story_gen")
def story(input: Input):
    print(input)
    if 'next_type' in input.story:
        story = {'text': input.story['text'],
                'next_type': input.story['next_type']}
        if not test:
            with open('data/sample_combat.json', 'r') as f:
                next = json.load(f)
    else:
        story = {'text': input.story['text'],}
        if not test:
            with open('data/sample_story.json', 'r') as f:
                next = json.load(f)
    playerInput = {
        'name':input.player['name'],
        'description':input.player['description'],
        'level': input.player['level'],
        'status': input.player['status']['status'],
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
        next = run(user_thread['user1'], message)

    data = dict({"success":True, "player":input.player}, **next)
    with open('data/save.json','w') as f:
        json.dump(data,f)
    return JSONResponse(data)

@app.get("/load_data")
def load():
    with open('data/save.json', 'r') as f:
        data = json.load(f)
    return JSONResponse(data)

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
    print(data)
    return JSONResponse(data)


