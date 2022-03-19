const inquirer = require("inquirer");
const cTable = require('console.table');
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "Ulaanbaatar2!",
    database: 'employees_db',
  },
  // console.log(`Connected to the employees_db database.`)
);

// Add an employee
function addEmployee() {
  let sql = "SELECT title FROM role ORDER BY role.id";
  let roleArray = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      let element = rows[i].title;
      roleArray.push(element);
    }
  });
  sql = "SELECT COUNT(manager_id) FROM employees WHERE manager_id != NULL ORDER BY manager.id";
  let managerArray = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Error message!");
      return;
    }
    console.log(rows);
    // for (let i = 0; i < rows.length; i++) {
    //   let element = rows[i].title;
    //   managerArray.push(element);
    // }
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
      name: "manager",
      message: "Who is the employee's manager?",
      choices: managerArray
    }])
    .then(function ({ firstName, lastName, role, manager }) {
      sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?);`;
      const params = [firstName, lastName, role, manager];
      db.query(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
       console.log(`Added ${firstName} ${lastName} to the Database`);
      });
    });
  return;
}

// View Table
function viewTable(view_choice) {
  let sql = "";
  switch (view_choice) {
    case "View All Employees": 
      sql = "SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name AS last_name, role.title AS title, role.salary AS salary, role.department_id AS department, employees.manager_id AS manager FROM employees JOIN role ON employees.role_id = role.id ORDER BY employees.id";
      break;
    case "View All Roles": 
      sql = `SELECT role.id AS id, role.title AS title, department.department_name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`;
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
  return;
}

// Create Main Menu 
const callMainMenu = function () {
  let choice = "";
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: 'What would you like to do?',
      choices: ["View All Employees",
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
        case "Quit": {
          console.log("Goodbye!");
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