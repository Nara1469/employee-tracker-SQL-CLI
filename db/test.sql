SELECT 
  department.department_name AS department, 
  e.manager_id AS m_id,
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