from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    first_name: str
    last_name: str
    phone: str
    location: str
    headline: str
    summary: str

class Company(BaseModel):
    company_name: str
    email: EmailStr
    password: str
    website: str | None = None

class Job(BaseModel):
    title: str
    description: str
    location: str
    salary: str
    employment_type: str
    experience_required: str

class JobApplication(BaseModel):
    job_id: int

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_year: int
    end_year: int

class Experience(BaseModel):
    company_name: str
    position: str
    description: str

class Skill(BaseModel):
    skill_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: EmailStr
    full_name: Optional[str] = None