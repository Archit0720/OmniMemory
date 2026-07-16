from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.auth.hash import hash_password
from app.schemas.user import UserCreate
from app.auth.hash import verify_password
from app.auth.jwt import create_access_token


class AuthService:

    @staticmethod
    def register(db: Session, user_data: UserCreate):

        existing_email = UserRepository.get_by_email(
            db,
            user_data.email
        )

        if existing_email:
            raise ValueError("Email already exists")

        existing_username = UserRepository.get_by_username(
            db,
            user_data.username
        )

        if existing_username:
            raise ValueError("Username already exists")

        user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hash_password(
                user_data.password
            )
        )

        return UserRepository.create(
            db,
            user
        )
    
    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            raise ValueError("Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials")

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }