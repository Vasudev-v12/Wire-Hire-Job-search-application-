from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from api_server.envConfig import JWT_SECRET_KEY, ALGORITHM

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(data: dict):

    payload = data.copy()

    payload["exp"] = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=ALGORITHM
    )