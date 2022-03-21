const inquirer = require("inquirer");
const cTable = require('console.table');
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

// Add an employee
function addEmployee() {
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
  sqlManager = `SELECT DISTINCT e.manager_id AS id, 
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                LEFT JOIN employees m
                ON e.manager_id = m.id
                ORDER BY e.manager_id`;
  let managerArray = [];
  let managerTable = [];
  db.query(sqlManager, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].manager;
      console.log(element);
      if (element == null) {
        managerArray.push("None");
        managerTable.push({id: 0, manager: null});
      } else {
        managerArray.push(element);
        managerTable.push(rows[i]);
      }
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
      let role_id = 0;
      for (let i = 0; i < roleTable.length; i++) {
        if (roleTable[i].title === role) {
          role_id = roleTable[i].id;
        }
      }
      // console.log(`role_id: ${role_id}`);
      let manager_id = 0;
      for (let i = 0; i < managerTable.length; i++) {
        if (managerTable[i].manager === manager_name) {
          manager_id = managerTable[i].id;
        }
      }
      // console.log(`manager_id: ${manager_id}`);
      sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?);`;
      const params = [firstName, lastName, role_id, manager_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Error message!");
          return;
        }
       console.log(`Added ${firstName} ${lastName} to the Database`);
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
      });
    });
  return;
}

// View Table
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
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ]
    }
  ])
    .then(function ({ menu }) {
      choice = menu;
      console.log("\n");
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