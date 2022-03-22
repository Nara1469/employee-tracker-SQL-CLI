-- Add a new Employee
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);

-- View Employees By Manager
SELECT 
  department.id AS d_id,
  department.department_name AS department, 
  m.id AS m_id,
  CONCAT(m.first_name, ' ', m.last_name) AS manager,
  e.id AS e_id,
  CONCAT(e.first_name, ' ', e.last_name) AS employee,
  role.title,  
  role.salary
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id 
JOIN role 
ON e.role_id = role.id 
JOIN department
ON role.department_id = department.id
WHERE e.manager_id IS NOT NULL
ORDER BY e.manager_id;

-- View Employees By Department
SELECT 
  department.id AS d_id, 
  department.department_name AS department, 
  e.id AS e_id,
  CONCAT(e.first_name, ' ', e.last_name) AS employee,
  role.title,  
  role.salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id 
JOIN role 
ON e.role_id = role.id 
JOIN department
ON role.department_id = department.id
ORDER BY department.id;

-- View the total utilized budget of a department
SELECT
  department.id AS id, 
  department.department_name AS department, 
  SUM(role.salary) AS budget
FROM employees 
JOIN role 
ON employees.role_id = role.id 
JOIN department
ON role.department_id = department.id
GROUP BY department.id
ORDER BY department.id;

-- Create Manager List (1)
SELECT DISTINCT id, CONCAT(first_name, ' ', last_name) AS manager
FROM employees 
WHERE manager_id IS NULL
ORDER BY id;

-- Create Manager List (2)
SELECT DISTINCT e.manager_id AS id, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id
ORDER BY e.manager_id;

-- Create Employee List
SELECT id, CONCAT(first_name, ' ', last_name) AS person FROM employees ORDER BY id;

-- View All Employees
SELECT 
  e.id AS id, 
  e.first_name AS first_name, 
  e.last_name AS last_name, 
  role.title AS title,  
  department.department_name AS department, 
  role.salary AS salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id 
JOIN role 
ON e.role_id = role.id 
JOIN department
ON role.department_id = department.id
ORDER BY e.id;

-- View All Roles
SELECT role.id AS id, role.title AS title, department.department_name AS department, role.salary AS salary
FROM role 
JOIN department 
ON role.department_id = department.id 
ORDER BY role.id;

-- View All Departments
SELECT *
FROM department 
ORDER BY department.id;