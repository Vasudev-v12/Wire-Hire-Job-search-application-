from datetime import datetime, timedelta, timezone
from sqlalchemy import Column, DateTime, Integer, String, create_engine, Text, Boolean, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from api_server.envConfig import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    full_name = Column(String)
    id = Column(Integer, primary_key=True, index=True)
    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )
    password_hash = Column(
        String,
        nullable=True
    )
    google_sub = Column(
        String,
        unique=True,
        nullable=True
    )
    profile_picture = Column(String)
    is_google_account = Column(
        Boolean,
        default=False
    )
    is_active = Column(
        Boolean,
        default=True
    )
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    last_login = Column(DateTime)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    location = Column(String)
    linkedin = Column(String)
    github = Column(String)
    portfolio = Column(String)
    headline = Column(String)
    summary = Column(Text)

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    website = Column(String)
    description = Column(Text)
    location = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = Column(
        Boolean,
        default=True
    )

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_super_admin = Column(
        Boolean,
        default=False
    )

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True)
    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    employment_type = Column(String)
    experience_required = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    skills_required = Column(Text)
    application_deadline = Column(Date)
    vacancies = Column(Integer)
    remote_allowed = Column(Boolean)

class JobApplication(Base):
    __tablename__ = "job_applications"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    job_id = Column(
        Integer,
        ForeignKey("jobs.id")
    )
    status = Column(
        String,
        default="Applied"
    )
    applied_at = Column(
        DateTime,
        default=datetime.now(timezone.utc)
    )
    resume_id = Column(
        Integer,
        ForeignKey("resumes.id")
    )
    cover_letter = Column(Text)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

class Education(Base):
    __tablename__ = "educations"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    institution = Column(String)
    degree = Column(String)
    field_of_study = Column(String)
    start_year = Column(Integer)
    end_year = Column(Integer)
    cgpa = Column(String)
    description = Column(Text)

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    company_name = Column(String)
    position = Column(String)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(
        Boolean,
        default=False
    )

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    name = Column(String)

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_filename = Column(String)
    file_path = Column(String)
    parsed = Column(Boolean, default=False)
    uploaded_at = Column(
        DateTime,
        default=datetime.now(timezone.utc)
    )
    parsed_json = Column(Text)
    is_primary = Column(
        Boolean,
        default=False
    )

Base.metadata.create_all(bind=engine)