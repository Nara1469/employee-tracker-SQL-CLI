const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "schoolroot",
    database: 'employees_db',
  },
  // console.log(`Connected to the employees_db database.`)
);

// Add a new employee
function addEmployee() {
  // Creating choice array for roleArray inquirer question
  let sqlRole = "SELECT id, title FROM role ORDER BY role.id";
  let roleArray = [];
  let roleTable = [];
  db.query(sqlRole, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].title;
      roleArray.push(element);
      roleTable.push(rows[i]);
    }
  });
  // Creating choice array for managerArray inquirer question
  sqlManager = `SELECT DISTINCT id, 
                CONCAT(first_name, ' ', last_name) AS manager
                FROM employees 
                WHERE manager_id IS NULL
                ORDER BY id`;
  let managerArray = ["None"];
  let managerTable = [{ id: null, manager: null }];
  db.query(sqlManager, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].manager;
      managerArray.push(element);
      managerTable.push(rows[i]);
    }
  });
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roleArray
    },
    {
      type: "list",
      name: "manager_name",
      message: "Who is the employee's manager?",
      choices: managerArray
    }])
    .then(function ({ firstName, lastName, role, manager_name }) {
      // Finding role_id matching Role's title which is chosen from the choice array: roleArray
      let role_id = 0;
      for (let i = 0; i < roleTable.length; i++) {
        if (roleTable[i].title === role) {
          role_id = roleTable[i].id;
        }
      }
      // Finding manager_id matching Manager's full name which is chosen the from choice array: managerArray
      let manager_id = null;
      for (let i = 1; i < managerTable.length; i++) {
        if (managerTable[i].manager === manager_name) {
          manager_id = managerTable[i].id;
        }
      }
      sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?);`;
      const params = [firstName, lastName, role_id, manager_id];
      db.query(sql, params, (err, rows) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`Added ${firstName} ${lastName} to the Database`);
        callMainMenu();
      });
    });
  return;
}

// Add a new role
function addRole() {
  let sqlDepartment = "SELECT id, department_name FROM department ORDER BY department.id";
  let departmentArray = [];
  let departmentTable = [];
  db.query(sqlDepartment, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].department_name;
      departmentArray.push(element);
      departmentTable.push(rows[i]);
    }
  });
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: departmentArray
    }])
    .then(function ({ title, salary, department }) {
      let department_id = 0;
      for (let i = 0; i < departmentTable.length; i++) {
        if (departmentTable[i].department_name === department) {
          department_id = departmentTable[i].id;
        }
      }
      sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;
      const params = [title, salary, department_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`Added ${title} to the Database`);
        callMainMenu();
      });
    });
  return;
}

// Add a new department
function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    }])
    .then(function ({ department }) {
      sql = `INSERT INTO department (department_name) VALUES (?);`;
      const params = [department];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`Added ${department} to the Database`);
        callMainMenu();
      });
    });
  return;
}

// Update an employee Role
function updateRole() {
  // Creating choice array for employeeArray inquirer question
  sqlEmployee = `SELECT id, CONCAT(first_name, ' ', last_name) AS person FROM employees ORDER BY id`;
  let employeeArray = [];
  let employeeTable = [];
  db.query(sqlEmployee, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].person;
      employeeArray.push(element);
      employeeTable.push(rows[i]);
    }
    let sqlRole = "SELECT id, title FROM role ORDER BY role.id";
    let roleArray = [];
    let roleTable = [];
    db.query(sqlRole, (err, rows) => {
      if (err) {
        console.log("Error message!");
        return;
      }
      for (let i = 0; i < rows.length; i++) {
        let element = rows[i].title;
        roleArray.push(element);
        roleTable.push(rows[i]);
      }
    });
    inquirer.prompt([
      {
        type: "list",
        name: "person",
        message: "Which employee's role do you want to update?",
        choices: employeeArray
      },
      {
        type: "list",
        name: "role",
        message: "Which role do want to assign the selected employee?",
        choices: roleArray
      }])
      .then(function ({ person, role }) {
        let employee_id = 0;
        for (let i = 0; i < employeeTable.length; i++) {
          if (employeeTable[i].person === person) {
            employee_id = employeeTable[i].id;
          }
        }
        let role_id = 0;
        for (let i = 0; i < roleTable.length; i++) {
          if (roleTable[i].title === role) {
            role_id = roleTable[i].id;
          }
        }
        sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        const params = [role_id, employee_id];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log("Error message!");
            return;
          }
          console.log(`Updated ${person}'s Role`);
          callMainMenu();
        });
      });
    return;
  });
}

// Update an employee Manager
function updateManager() {
  // Creating choice array for employeeArray inquirer question
  sqlEmployee = `SELECT id, CONCAT(first_name, ' ', last_name) AS person FROM employees ORDER BY id`;
  let employeeArray = [];
  let employeeTable = [];
  db.query(sqlEmployee, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].person;
      employeeArray.push(element);
      employeeTable.push(rows[i]);
    }
    // Creating choice array for managerArray inquirer question
    sqlManager = `SELECT id, 
        CONCAT(first_name, ' ', last_name) AS manager
        FROM employees 
        WHERE manager_id IS NULL
        ORDER BY id`;
    let managerArray = ["None"];
    let managerTable = [{ id: null, manager: null }];
    db.query(sqlManager, (err, rows) => {
      if (err) {
        console.log("Error message!");
        return;
      }
      for (let i = 0; i < rows.length; i++) {
        let element = rows[i].manager;
        managerArray.push(element);
        managerTable.push(rows[i]);
      }
    });
    inquirer.prompt([
      {
        type: "list",
        name: "person",
        message: "Which employee's manager do you want to change?",
        choices: employeeArray
      },
      {
        type: "list",
        name: "manager",
        message: "Who is going to be the selected employee's manager?",
        choices: managerArray
      }])
      .then(function ({ person, manager }) {
        let employee_id = 0;
        for (let i = 0; i < employeeTable.length; i++) {
          if (employeeTable[i].person === person) {
            employee_id = employeeTable[i].id;
          }
        }
        let manager_id = null;
        for (let i = 0; i < managerTable.length; i++) {
          if (managerTable[i].manager === manager) {
            manager_id = managerTable[i].id;
          }
        }
        sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
        const params = [manager_id, employee_id];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log("Error message!");
            return;
          }
          console.log(`Updated ${person}'s Manager is changed`);
          callMainMenu();
        });
      });
    return;
  });
}

// Delete an employee record
function deleteEmployeeRecord() {
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "Which employee's record do you want to delete? Enter the employee ID:",
    }])
    .then(function ({ id }) {
      sqlEmployee = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, 
                role.title AS title, department.department_name AS department, 
                role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                LEFT JOIN employees m
                ON e.manager_id = m.id 
                JOIN role 
                ON e.role_id = role.id 
                JOIN department
                ON role.department_id = department.id
                WHERE e.id = ?;`;
      const params = [id];
      db.query(sqlEmployee, params, (err, rows) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log("\n");
        console.table(rows);
        inquirer.prompt([
          {
            type: "confirm",
            name: "question",
            message: "Do you still want to delete this record?",
          }])
          .then(function ({ question }) {
            if (question) {
              sql = `DELETE FROM employees WHERE id = ?`;
              db.query(sql, params, (err, result) => {
                if (err) {
                  console.log("Error message!");
                  return;
                }
                console.log(`An employee's record with id=${id} is deleted from database!`);
                callMainMenu();
              });
            } else {
              console.log("Back to the main menu");
              callMainMenu();
            }
          });
      });
    });
  return;
}

// View any table with choice of Employees, Role and Department table
function viewTable(view_choice) {
  let sql = "";
  switch (view_choice) {
    case "View All Employees":
      sql = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, 
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
      break;
    case "View All Roles":
      sql = `SELECT role.id AS id, role.title AS title, 
            department.department_name AS department, role.salary AS salary 
            FROM role JOIN department 
            ON role.department_id = department.id 
            ORDER BY role.id`;
      break;
    case "View All Departments":
      sql = `SELECT * FROM department ORDER BY department.id`;
      break;
    default:
      break;
  }
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    console.table(rows);
    callMainMenu();
  });
}

// Create Main Menu 
const callMainMenu = function () {
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: 'What would you like to do?',
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee Role",
        "Update Employee Manager",
        "Delete Employee",
        "Quit",
      ]
    }
  ])
    .then(function ({ menu }) {
      choice = menu;
      switch (menu) {
        case "View All Employees": {
          viewTable(menu);
          break;
        }
        case "View All Roles": {
          viewTable(menu);
          break;
        }
        case "View All Departments": {
          viewTable(menu);
          break;
        }
        case "Add Employee": {
          addEmployee();
          break;
        }
        case "Add Role": {
          addRole();
          break;
        }
        case "Add Department": {
          addDepartment();
          break;
        }
        case "Update Employee Role": {
          updateRole();
          break;
        }
        case "Update Employee Manager": {
          updateManager();
          break;
        }
        case "Delete Employee": {
          deleteEmployeeRecord();
          break;
        }
        case "Quit": {
          console.log("Goodbye!");
          process.exit(0);
          break;
        }
        default:
          break;
      }
    });
  return;
}

// a function to initialize app 
function init() {
  console.log("\n***** Employee Management System *****\n");
  callMainMenu();
  return;
}

// Function call to initialize app
init();