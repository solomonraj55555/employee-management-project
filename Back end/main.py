from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Management API", version="2.0.0")

# Allow all localhost ports so React dev server on any port works
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Employee Management API v2 running"}

# ── Employees ──────────────────────────────────────────────────

@app.get("/employees", response_model=List[schemas.EmployeeOut])
def list_employees(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return crud.get_employees(db, skip=skip, limit=limit, search=search, department_id=department_id)

@app.get("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = crud.get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@app.post("/employees", response_model=schemas.EmployeeOut, status_code=201)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    if crud.get_employee_by_email(db, employee.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_employee(db, employee)

@app.put("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    updated = crud.update_employee(db, employee_id, employee)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated

@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    if not crud.delete_employee(db, employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")

# ── Departments ────────────────────────────────────────────────

@app.get("/departments", response_model=List[schemas.DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return crud.get_departments(db)

@app.post("/departments", response_model=schemas.DepartmentOut, status_code=201)
def create_department(dept: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db, dept)

@app.delete("/departments/{dept_id}", status_code=204)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    if not crud.delete_department(db, dept_id):
        raise HTTPException(status_code=404, detail="Department not found")

# ── Stats ──────────────────────────────────────────────────────

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

# ── Chatbot ────────────────────────────────────────────────────

@app.post("/chat", response_model=schemas.ChatOutput)
def chat(payload: schemas.ChatInput):
    try:
        from chatbot import ask_employee_question
        reply = ask_employee_question(payload.message)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Sorry, chatbot error: {str(e)}"}