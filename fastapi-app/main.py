from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gen_story import run_thread
import json

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
    status: dict

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/story_gen")
def story(input: Input):
    print(input)
    story = input.story
    status = input.status
    with open('../data/sample_story.json', 'r') as f:
        data = json.load(f)
    return JSONResponse(data)