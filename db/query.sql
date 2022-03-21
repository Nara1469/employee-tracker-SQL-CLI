-- Manager's Table
SELECT DISTINCT e.manager_id AS id, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id
ORDER BY e.manager_id;

-- INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);

-- View All Employees
-- SELECT 
--   e.id AS id, 
--   e.first_name AS first_name, 
--   e.last_name AS last_name, 
--   role.title AS title,  
--   department.department_name AS department, 
--   role.salary AS salary,
--   CONCAT(m.first_name, ' ', m.last_name) AS manager
-- FROM employees e
-- LEFT JOIN employees m
-- ON e.manager_id = m.id 
-- JOIN role 
-- ON e.role_id = role.id 
-- JOIN department
-- ON role.department_id = department.id
-- ORDER BY e.id;

-- View All Roles
-- SELECT role.id AS id, role.title AS title, department.department_name AS department, role.salary AS salary
-- FROM role 
-- JOIN department 
-- ON role.department_id = department.id 
-- ORDER BY role.id;

-- View All Departments
-- SELECT *
-- FROM department 
-- ORDER BY department.id;