import os
import logging  # Correctly import logging
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from passlib.context import CryptContext

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta

from .models import Card, User
from .schemas import CardCreate, UserCreate, Card as CardSchema, UserResponse as UserResponseSchema, Token as TokenSchema  # Ensure this import worksimport logging
from .database import SessionLocal, engine, Base  # Import from database.py

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the database tables
Base.metadata.create_all(bind=engine)

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

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT settings
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        logger.info(f"Token decoded successfully, email: {email}")
    except JWTError as e:
        logger.error(f"JWTError: {e}")
        raise credentials_exception
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user

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

@app.post("/cards/", response_model=CardSchema)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    db_card = Card(title=card.title, image=card.image)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.get("/cards/", response_model=List[CardSchema])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cards = db.query(Card).offset(skip).limit(limit).all()
    return cards

@app.get("/cards/{card_id}", response_model=CardSchema)
def read_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@app.put("/cards/{card_id}", response_model=CardSchema)
def update_card(card_id: int, card: CardCreate, db: Session = Depends(get_db)):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_card.title = card.title
    db_card.image = card.image
    db.commit()
    db.refresh(db_card)
    return db_card


@app.delete("/cards/{card_id}", response_model=CardSchema)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()
    return db_card

@app.post("/users/", response_model=UserResponseSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=TokenSchema)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponseSchema)
async def read_users_me(current_user: UserResponseSchema = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)