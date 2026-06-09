from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime
from models import EmploymentStatus

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentOut(DepartmentBase):
    id: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    first_name:    str   = Field(..., min_length=1, max_length=50)
    last_name:     str   = Field(..., min_length=1, max_length=50)
    email:         EmailStr
    phone:         Optional[str] = None
    position:      str   = Field(..., min_length=1, max_length=100)
    department_id: Optional[int] = None
    salary:        float = Field(..., ge=0)
    hire_date:     date
    status:        EmploymentStatus = EmploymentStatus.active
    avatar_color:  Optional[str] = "#6366f1"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name:    Optional[str]              = Field(None, min_length=1, max_length=50)
    last_name:     Optional[str]              = Field(None, min_length=1, max_length=50)
    email:         Optional[EmailStr]         = None
    phone:         Optional[str]              = None
    position:      Optional[str]              = Field(None, min_length=1, max_length=100)
    department_id: Optional[int]              = None
    salary:        Optional[float]            = Field(None, ge=0)
    hire_date:     Optional[date]             = None
    status:        Optional[EmploymentStatus] = None
    avatar_color:  Optional[str]              = None

class EmployeeOut(EmployeeBase):
    id:         int
    department: Optional[DepartmentOut] = None
    created_at: Optional[datetime]      = None
    updated_at: Optional[datetime]      = None
    class Config:
        from_attributes = True

class ChatInput(BaseModel):
    message: str

class ChatOutput(BaseModel):
    reply: str