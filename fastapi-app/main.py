from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gen_story import run_thread
import json

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from player import Player

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

class FirstData(BaseModel):
    story: dict
    player: dict


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/story_gen")
def story(input: Input):
    print(input)
    story = input.story
    player = app.state.player
    if player is None:
        return JSONResponse(status_code=400, content={"message": "Player not set"})
    
    with open('../data/sample_story.json', 'r') as f:
        story = json.load(f)
    data = {
        "story": story['story'],
        "choices": story['choices'],
        "player": player.to_dict()
    }
    return JSONResponse(data)

@app.post("/first")
def first(input: FirstData):
    print(input)
    player = Player(input.player['name'],input.player['description'],input.player['status'])
    app.state.player = player
    with open('../data/sample_story.json', 'r') as f:
        story = json.load(f)
    data = {
        "story": story['story'],
        "choices": story['choices'],
        "player": player.to_dict()
    }
    return JSONResponse(data)


