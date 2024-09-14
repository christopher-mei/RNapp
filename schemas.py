# schemas.py
from pydantic import BaseModel

class CardBase(BaseModel):
    title: str
    image: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True