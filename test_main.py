import logging
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .main import app, create_access_token, get_user_by_email
from .database import Base, get_db
from .models import User
from .schemas import CardCreate, UserCreate, Card as CardSchema, UserResponse, Token

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Ensure the table is created before any tests run
    logger.info("Creating database tables in setup fixture...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created in setup fixture.")

@pytest.fixture(scope="module")
def test_user():
    db = TestingSessionLocal()
    user = User(email="test@example.com", hashed_password="fakehashedpassword")
    db.add(user)
    db.commit()
    db.refresh(user)
    yield user
    db.delete(user)
    db.commit()
    db.close()

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to FastAPI" in response.text

def test_create_access_token(test_user):
    access_token = create_access_token(data={"sub": test_user.email})
    assert access_token is not None

def test_get_current_user(test_user):
    access_token = create_access_token(data={"sub": test_user.email})
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email