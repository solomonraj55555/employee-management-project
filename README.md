# Employee Management System with AI HR Assistant

## Overview

Employee Management System is a full-stack web application that allows organizations to manage employee records efficiently. The application provides employee CRUD operations, team management, and an AI-powered HR Assistant that can answer questions about employees using natural language.

## Features

### Employee Management
- Add new employees
- View employee details
- Update employee information
- Delete employee records
- Search employees by name, email, or position

### Dashboard
- Total employee count
- Active employee count
- Employees on leave
- Department overview

### AI HR Assistant
- Built using LangChain and Groq API
- Natural language querying
- Employee information retrieval
- Salary-related queries
- Department-related queries
- Leave status queries
- HR analytics support

### Database Management
- MySQL database integration
- Persistent employee records
- Efficient data retrieval

---

## Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- Axios

### Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic

### Database
- MySQL

### AI Integration
- LangChain
- Groq API
- Llama 3.3 70B Model

---

## Project Architecture

```
Frontend (React)
       |
       v
Backend (FastAPI)
       |
       v
MySQL Database
       |
       v
LangChain + Groq AI Assistant
```

---

## API Features

### Employee APIs

- Create Employee
- Get All Employees
- Get Employee By ID
- Update Employee
- Delete Employee

### AI Assistant API

- Ask questions in natural language
- Retrieve employee information
- Department analysis
- Salary insights

---

## Installation

### Clone Repository

```bash
git clone <your-github-repository-link>
cd employee-management-system
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=employee_db

GROQ_API_KEY=your_groq_api_key
```

Run Backend:

```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Sample AI Queries

- Who has the highest salary?
- Who has the lowest salary?
- Which employees belong to Engineering?
- How many employees are currently on leave?
- Show all employees in Marketing.
- What is the salary of John Doe?

---

## Future Improvements

- Authentication & Authorization
- Role-Based Access Control (RBAC)
- Employee Attendance Tracking
- Payroll Management
- Leave Approval Workflow
- AI-Powered Analytics Dashboard
- Secure Data Access Controls

---

## Screenshots

### Dashboard
(Add screenshot here)

### Employee Directory
(Add screenshot here)

### AI HR Assistant
(Add screenshot here)

---

## Author

Developed as a Full Stack AI-powered Employee Management System using React, FastAPI, MySQL, LangChain, and Groq AI.
