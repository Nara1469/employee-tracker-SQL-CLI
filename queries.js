const sqlEmployeeList = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, 
    role.title AS title, department.department_name AS department, 
    role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN employees m
    ON e.manager_id = m.id 
    JOIN role 
    ON e.role_id = role.id 
    JOIN department
    ON role.department_id = department.id
    ORDER BY e.id;`;

module.exports = sqlEmployeeList;