SELECT manager_id FROM employees ORDER BY manager_id;

-- INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);

-- SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title,  department.department_name AS department, role.salary AS salary, e.manager_id AS manager 
-- FROM employees e
-- -- INNER JOIN employees m
-- -- ON m.manager_id = e.id
-- JOIN role 
-- ON e.role_id = role.id 
-- JOIN department
-- ON role.department_id = department.id
-- ORDER BY e.id;

-- SELECT role.id AS id, role.title AS title, department.department_name AS department, role.salary AS salary
-- FROM role 
-- JOIN department 
-- ON role.department_id = department.id 
-- ORDER BY role.id;

-- SELECT *
-- FROM department 
-- ORDER BY department.id;

-----------------------------------------------------------------
-- SELECT 
--     CONCAT(m.lastName, ', ', m.firstName) AS Manager,
--     CONCAT(e.lastName, ', ', e.firstName) AS 'Direct report'
-- FROM
--     employees e
-- INNER JOIN employees m ON 
--     m.employeeNumber = e.reportsTo

-- IF(e.manager_id='null', 'NULL', CONCAT(e.first_name, ' ', e.last_name)) AS manager