from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# from gen_story import run_thread
import json
import os
from glob import glob

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

app = FastAPI()

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
    filepath = "../data/worldview"
    data = {}
    for file in os.listdir(filepath):
        f = open(os.path.join(filepath,file), "r")
        data[file] = f.read()
    print(data)
    return JSONResponse(data)

@app.post("/first")
def first(input: Input):
    print(input)

    with open('../data/sample_story.json', 'r') as f:
        next = json.load(f)

    data = dict({"player":input.player}, **next)
    with open('../data/save.json','w') as f:
        json.dump(data,f)
    return JSONResponse({"success":True})

@app.post("/story_gen")
def story(input: Input):
    print(input)
    story = input.story
    player = input.player
    player['status']['added_status']['strength'] += 1
    with open('../data/sample_combat.json', 'r') as f:
        next = json.load(f)

    data = dict({"player":input.player}, **next)
    with open('../data/save.json','w') as f:
        json.dump(data,f)
    return JSONResponse({"success":True})

@app.get("/load_data")
def load():
    with open('../data/save.json', 'r') as f:
        data = json.load(f)
    return JSONResponse(data)

@app.get("/skills")
def skills():
    data = []
    class_paths = glob('../data/class/class1')
    for class_path in class_paths:
        attack_path = glob(os.path.join(class_path, 'skill/attack/*json'))
        attack = []
        for path in attack_path:
            with open(path, 'r') as f:
                attack.append(json.load(f))
        defend = []
        defend_path = glob(os.path.join(class_path, 'skill/defend/*json'))
        for path in defend_path:
            with open(path, 'r') as f:
                defend.append(json.load(f))
        data.append({
            'class_name': 'class1',
            'attack': attack,
            'defend': defend,
        })
    print(data)
    return JSONResponse(data)


