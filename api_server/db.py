from datetime import datetime, timedelta, timezone
from sqlalchemy import Column, DateTime, Integer, String, create_engine, Text, Boolean, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from api_server.envConfig import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    location = Column(String(150))
    headline = Column(String(200))
    summary = Column(Text)
    current_role = Column(String(150))
    experience = Column(String(100))
    skills = Column(Text)
    education = Column(Text)
    github = Column(String(255))
    linkedin = Column(String(255))
    portfolio = Column(String(255))
    profile_picture = Column(String(255))
    user = relationship("User", back_populates="profile")

class User(Base):
    __tablename__ = "users"
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

    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    applications = relationship(
        "JobApplication",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    educations = relationship(
        "Education",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    experiences = relationship(
        "Experience",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    skills = relationship(
        "Skill",
        back_populates="user",
        cascade="all, delete-orphan"
    )

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
    jobs = relationship(
        "Job",
        back_populates="company",
        cascade="all, delete-orphan"
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
    company = relationship(
        "Company",
        back_populates="jobs"
    )
    applications = relationship(
        "JobApplication",
        back_populates="jobs"
    )

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
        default=lambda: datetime.now(timezone.utc)
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
    user = relationship(
        "User",
        back_populates="applications"
    )
    resumes = relationship(
        "Resume",
        back_populates="applications"
    )
    jobs = relationship(
        "Job",
        back_populates="applications"
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
    user = relationship(
        "User",
        back_populates="educations"
    )

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
    user = relationship(
        "User",
        back_populates="experiences"
    )

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    name = Column(String)
    user = relationship(
        "User",
        back_populates="skills"
    )

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_filename = Column(String)
    file_path = Column(String)
    parsed = Column(Boolean, default=False)
    uploaded_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    parsed_json = Column(Text)
    is_primary = Column(
        Boolean,
        default=False
    )
    user = relationship(
        "User",
        back_populates="resumes"
    )
    applications = relationship(
        "JobApplication",
        back_populates="resumes"
    )

Base.metadata.create_all(bind=engine)