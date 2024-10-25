# AI-RPG

## 온라인 접속
```
https://tool7831.github.io/AI-RPG/
```
접속 관련은 tool7831@g.skku.edu 로 문의

## 오프라인 접속
```
git clone https://github.com/tool7831/AI-RPG.git
```
nodejs, python, openai api key가 필요합니다.

### 리액트 실행
node v20.17.0\
npm 10.8.2
```
cd react-app
npm install
npm start
```
리액트 환경변수

```
REACT_APP_FAST_API_URL=http://localhost:8000 #fastapi 주소
```

### FastAPI 실행
```
cd fastapi-app
pip install -r requirements
uvicorn main:app --reload
```
시스템 환경변수
```
OPENAI_API_KEY = api_key # 본인의 API key
```