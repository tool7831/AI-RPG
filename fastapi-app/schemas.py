# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    user_data: Optional[Dict] = None  # This will hold the JSON data

    class Config:
        orm_mode = True

    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr | None = None
    

class UserInput(BaseModel):
    story: dict
    stage: int
    player: dict

