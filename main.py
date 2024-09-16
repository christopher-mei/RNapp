import os
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from passlib.context import CryptContext

from models import Card, User, SessionLocal, engine
import schemas

# Create the database tables
Card.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to FastAPI</title>
    </head>
    <body>
        <h1>Welcome to FastAPI</h1>
        <p>This is the landing page of your FastAPI application.</p>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/cards/", response_model=schemas.Card)
def create_card(card: schemas.CardCreate, db: Session = Depends(get_db)):
    db_card = Card(title=card.title, image=card.image)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.get("/cards/", response_model=List[schemas.Card])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cards = db.query(Card).offset(skip).limit(limit).all()
    return cards

@app.get("/cards/{card_id}", response_model=schemas.Card)
def read_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@app.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_card.title = card.title
    db_card.image = card.image
    db.commit()
    db.refresh(db_card)
    return db_card

@app.delete("/cards/{card_id}", response_model=schemas.Card)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()
    return db_card

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)