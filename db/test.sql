SELECT role.id, role.title, department.department_name, role.salary
FROM role 
JOIN department 
ON role.department_id = department.id 
WHERE role.id = 2;