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