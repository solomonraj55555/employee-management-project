-- Run this script in MySQL to set up the database
-- mysql -u root -p < setup.sql

CREATE DATABASE IF NOT EXISTS employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employee_db;

-- Create a dedicated user (optional but recommended)
-- CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON employee_db.* TO 'emp_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Tables are auto-created by SQLAlchemy when the app starts.
-- Run this script just to create the database.

-- Seed data (optional — run AFTER starting the FastAPI app at least once)
INSERT INTO departments (name, description) VALUES
  ('Engineering',   'Software development and infrastructure'),
  ('Product',       'Product management and strategy'),
  ('Design',        'UX/UI and brand design'),
  ('Marketing',     'Growth and brand marketing'),
  ('HR',            'People operations and recruitment'),
  ('Finance',       'Accounting, payroll, and FP&A');

INSERT INTO employees (first_name, last_name, email, phone, position, department_id, salary, hire_date, status, avatar_color) VALUES
  ('Arjun',   'Sharma',    'arjun.sharma@company.com',    '+91-9876543210', 'Senior Engineer',      1, 1800000, '2021-03-15', 'active',   '#6366f1'),
  ('Priya',   'Nair',      'priya.nair@company.com',      '+91-9876543211', 'Product Manager',      2, 2000000, '2020-07-01', 'active',   '#ec4899'),
  ('Rohan',   'Mehta',     'rohan.mehta@company.com',     '+91-9876543212', 'UX Designer',          3, 1200000, '2022-01-10', 'active',   '#10b981'),
  ('Sneha',   'Iyer',      'sneha.iyer@company.com',      '+91-9876543213', 'Marketing Lead',       4, 1400000, '2021-11-20', 'active',   '#f59e0b'),
  ('Vikram',  'Patel',     'vikram.patel@company.com',    '+91-9876543214', 'DevOps Engineer',      1, 1600000, '2019-06-01', 'active',   '#3b82f6'),
  ('Kavya',   'Reddy',     'kavya.reddy@company.com',     '+91-9876543215', 'HR Manager',           5, 1300000, '2020-02-14', 'on_leave', '#8b5cf6'),
  ('Aditya',  'Kumar',     'aditya.kumar@company.com',    '+91-9876543216', 'Finance Analyst',      6, 1100000, '2022-08-05', 'active',   '#06b6d4'),
  ('Meera',   'Singh',     'meera.singh@company.com',     '+91-9876543217', 'Full Stack Developer', 1, 1500000, '2023-01-25', 'active',   '#f43f5e');
