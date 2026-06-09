from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
import models, schemas

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip=0, limit=100, search=None, department_id=None):
    query = db.query(models.Employee)
    if search:
        term = f"%{search}%"
        query = query.filter(or_(
            models.Employee.first_name.ilike(term),
            models.Employee.last_name.ilike(term),
            models.Employee.email.ilike(term),
            models.Employee.position.ilike(term),
        ))
    if department_id is not None:
        query = query.filter(models.Employee.department_id == department_id)
    return query.offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_emp = models.Employee(**employee.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def update_employee(db: Session, employee_id: int, employee: schemas.EmployeeUpdate):
    db_emp = get_employee(db, employee_id)
    if not db_emp:
        return None
    for field, value in employee.model_dump(exclude_unset=True).items():
        setattr(db_emp, field, value)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def delete_employee(db: Session, employee_id: int):
    db_emp = get_employee(db, employee_id)
    if not db_emp:
        return False
    db.delete(db_emp)
    db.commit()
    return True

def get_departments(db: Session):
    return db.query(models.Department).all()

def create_department(db: Session, dept: schemas.DepartmentCreate):
    db_dept = models.Department(**dept.model_dump())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def delete_department(db: Session, dept_id: int):
    db_dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not db_dept:
        return False
    db.delete(db_dept)
    db.commit()
    return True

def get_stats(db: Session):
    total    = db.query(func.count(models.Employee.id)).scalar()
    active   = db.query(func.count(models.Employee.id)).filter(models.Employee.status == models.EmploymentStatus.active).scalar()
    on_leave = db.query(func.count(models.Employee.id)).filter(models.Employee.status == models.EmploymentStatus.on_leave).scalar()
    avg_sal  = db.query(func.avg(models.Employee.salary)).scalar() or 0
    dept_cnt = db.query(func.count(models.Department.id)).scalar()
    return {
        "total_employees":   total,
        "active_employees":  active,
        "on_leave":          on_leave,
        "inactive_employees": total - active - on_leave,
        "average_salary":    round(float(avg_sal), 2),
        "total_departments": dept_cnt,
    }