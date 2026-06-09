from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class EmploymentStatus(str, enum.Enum):
    active   = "active"
    inactive = "inactive"
    on_leave = "on_leave"

class Department(Base):
    __tablename__ = "departments"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    employees   = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    id            = Column(Integer, primary_key=True, index=True)
    first_name    = Column(String(50), nullable=False)
    last_name     = Column(String(50), nullable=False)
    email         = Column(String(100), unique=True, nullable=False, index=True)
    phone         = Column(String(20))
    position      = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    salary        = Column(Float, nullable=False, default=0.0)
    hire_date     = Column(Date, nullable=False)
    status        = Column(Enum(EmploymentStatus), default=EmploymentStatus.active, nullable=False)
    avatar_color  = Column(String(7), default="#6366f1")
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())
    department    = relationship("Department", back_populates="employees")