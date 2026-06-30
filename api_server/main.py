from datetime import datetime, timedelta, timezone
import os
import shutil
import uuid
import json
from authlib.integrations.starlette_client import OAuth
from fastapi import Depends, FastAPI, HTTPException, Request, File, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from api_server.envConfig import config, SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET_KEY, ALGORITHM
from api_server.db import SessionLocal, User, Resume, UserProfile as dbUserProfile
from api_server.schemas import UserRegister, UserLogin, UserProfile, UserProfileUpdate, UserProfileResponse
from api_server.cvParser import get_resume_data
from api_server.security import (
    hash_password,
    verify_password,
    create_access_token
)



ACCESS_TOKEN_EXPIRE_MINUTES = 60
security = HTTPBearer()
app = FastAPI()

app = FastAPI()

app.add_middleware(
    SessionMiddleware, 
    secret_key=SESSION_SECRET,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth(config)
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    },
)




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials=Depends(security), db: Session = Depends(get_db)):
    print("Authorization:", credentials)
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

    except JWTError as e:
        print("JWT Error:", e)
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)


@app.get("/")
async def home():
    return {
        "message": "You have Reached Wire-Hire API Server",
        "login_url": "/login"
    }

@app.get("/user/me")
def get_current_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = (
        db.query(UserProfile)
        .filter(
            UserProfile.user_id ==
            current_user.id
        )
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": profile.first_name,
        "last_name": profile.last_name
    }

@app.post("/auth/user/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User).filter(User.email == payload.email).first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # print("PASSWORD:", payload.password)
    # print("TYPE:", type(payload.password))
    # print("LENGTH:", len(payload.password))
    user = User(
        email=payload.email,
        password_hash=hash_password(
            payload.password
        ),
        is_google_account=False
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    profile = dbUserProfile(
        user_id=user.id,
        first_name=payload.first_name,
        last_name=payload.last_name,
    )

    db.add(profile)
    db.commit()
    return {
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": profile.first_name,
            "last_name": profile.last_name
        }
    }


@app.post("/auth/user/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = (
        db.query(User).filter(User.email == payload.email).first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
            "role": "user"
        }
    )

    profile = (
        db.query(dbUserProfile).filter(dbUserProfile.user_id == user.id).first()
    )
    if not profile:
        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "profile": False,
            "role": "user",
            "user": {
                "id": user.id,
                "email": user.email,
            },
        }
    else:
        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "profile":True,
            "role": "user",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "profile_picture": profile.profile_picture
            }
        }
    
@app.get("/user/profile", response_model=UserProfileResponse)
def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = (
        db.query(dbUserProfile)
        .filter(dbUserProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile

@app.put("/user/profile", response_model=UserProfileResponse)
def update_profile(profile: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile = (
        db.query(dbUserProfile).filter(dbUserProfile.user_id == current_user.id).first()
    )
    if not db_profile:
        db_profile = dbUserProfile(
            user_id=current_user.id
        )
        db.add(db_profile)

    db_profile.first_name = profile.first_name
    db_profile.last_name = profile.last_name
    db_profile.phone = profile.phone
    db_profile.location = profile.location
    db_profile.headline = profile.headline
    db_profile.summary = profile.summary
    db_profile.current_role = profile.current_role
    db_profile.experience = profile.experience
    db_profile.skills = profile.skills
    db_profile.education = profile.education
    db_profile.github = profile.github
    db_profile.linkedin = profile.linkedin
    db_profile.portfolio = profile.portfolio
    db.commit()
    db.refresh(db_profile)

    return db_profile

@app.post("/user/profile/picture")
def update_profile_pic(picture: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = (
        db.query(dbUserProfile)
        .filter(dbUserProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile.profile_picture and os.path.exists(profile.profile_picture):
        os.remove(profile.profile_picture)

    if not picture.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    os.makedirs("user_data/profile_pictures", exist_ok=True)

    extension = picture.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    filepath = os.path.join("user_data/profile_pictures", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(picture.file, buffer)

    profile.profile_picture = filepath
    db.commit()

    return {
        "message": "Profile picture uploaded",
    }

@app.post("/user/profile/resume")
def update_resume(resume: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be PDF."
        )
    os.makedirs(
        "user_data/resumes",
        exist_ok=True
    )
    filename = f"{uuid.uuid4()}.pdf"
    filepath = os.path.join(
        "user_data/resumes",
        filename
    )
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            resume.file,
            buffer
        )

    db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_primary": False})

    new_resume = Resume(
        user_id=current_user.id,
        original_filename=resume.filename,
        file_path=filepath,
        parsed=False,
        is_primary=True
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    data = get_resume_data(filepath)

    profile = db.query(dbUserProfile).filter(
        dbUserProfile.user_id == current_user.id
    ).first()

    if profile:
        profile.first_name = data.get("first_name", "")
        profile.last_name = data.get("last_name", "")
        profile.phone = data.get("phone", "")
        profile.location = data.get("location", "")
        profile.summary = data.get("summary", "")
        profile.current_role = data.get("current_role", "")
        profile.skills = ",".join(data.get("skills", []))
        profile.education = str(data.get("education", []))
        profile.experience = str(data.get("experience", []))
    else:
        profile = dbUserProfile(
            user_id=current_user.id,
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            location=data.get("location", ""),
            summary=data.get("summary", ""),
            current_role=data.get("current_role", ""),
            skills=",".join(data.get("skills", [])),
            education=str(data.get("education", [])),
            experience=str(data.get("experience", []))
        )
        db.add(profile)
    
    print("Profile before update:", profile)
    print("Gemini data:", data)

    db.commit()
    db.refresh(profile)

    print(profile.first_name)
    print(profile.phone)
    print(profile.skills)

    return {
        "message": "Resume uploaded",
        "resume_id": new_resume.id,
        "profile": data
    }

# @app.get("/auth/google/login")
# async def google_login():

#     return RedirectResponse(
#         google_auth_url
#     )

@app.get("/auth/google/callback")
async def callback(code: str):

    # exchange code
    # get user info
    # create jwt

    return RedirectResponse(
        f"http://localhost:5173/auth-success?token={jwt}"
    )

@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/auth")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        raise HTTPException(status_code=400, detail="Google authentication failed")

    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Unable to fetch Google user info")

    email = user_info.get("email")
    full_name = user_info.get("name")
    google_sub = user_info.get("sub")
    picture = user_info.get("picture")

    if not email or not google_sub:
        raise HTTPException(status_code=400, detail="Incomplete Google profile data")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email,
            full_name=full_name,
            google_sub=google_sub,
            profile_picture=picture,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.full_name = full_name
        user.profile_picture = picture
        db.add(user)
        db.commit()
        db.refresh(user)

    app_token = create_access_token(
        {
            "sub": user.email,
            "user_id": user.id,
            "auth_provider": "google"
        }
    )

    return {
        "access_token": app_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture
        }
    }