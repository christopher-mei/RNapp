# schemas.py
from pydantic import BaseModel, EmailStr

class CardBase(BaseModel):
    title: str
    image: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True