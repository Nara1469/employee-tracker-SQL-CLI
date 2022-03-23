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
  // Query: Creating choice array (roleArray) for inquirer question
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
  // Query: Creating choice array (managerArray) for inquirer question
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
      // Query: Adding a new employee record to the Employees table
      sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?);`;
      const params = [firstName, lastName, role_id, manager_id];
      db.query(sql, params, (err, rows) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`\nAdded (Employee: ${firstName} ${lastName}) to the Database\n`);
        callMainMenu();
      });
    });
  return;
}

// Add a new role
function addRole() {
  // Query: Creating choice array (departmentArray) for inquirer question
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
      // Finding department_id matching Department's name which is chosen the from choice array: departmentArray
      let department_id = 0;
      for (let i = 0; i < departmentTable.length; i++) {
        if (departmentTable[i].department_name === department) {
          department_id = departmentTable[i].id;
        }
      }
      // Query: Adding a new role to the Role table
      sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;
      const params = [title, salary, department_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`\nAdded (Role: ${title}) to the Database\n`);
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
      // Query: Adding a new department to the Department table
      sql = `INSERT INTO department (department_name) VALUES (?);`;
      const params = [department];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log(`\nAdded (Department: ${department}) to the Database\n`);
        callMainMenu();
      });
    });
  return;
}

// Update an Employee Role
function updateRole() {
  // Query: Creating choice array (employeeArray) for inquirer question
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
    // Query: Creating choice array (roleArray) for inquirer question
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
        // Finding employee_id matching Employee's full name which is chosen the from choice array: employeeArray
        let employee_id = 0;
        for (let i = 0; i < employeeTable.length; i++) {
          if (employeeTable[i].person === person) {
            employee_id = employeeTable[i].id;
          }
        }
        // Finding role_id matching Role's name which is chosen the from choice array: roleArray
        let role_id = 0;
        for (let i = 0; i < roleTable.length; i++) {
          if (roleTable[i].title === role) {
            role_id = roleTable[i].id;
          }
        }
        // Query: Updating the Employee's role_id in the Employee table
        sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        const params = [role_id, employee_id];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log("Error message!");
            return;
          }
          console.log(`\nUpdated ${person}'s Role\n`);
          callMainMenu();
        });
      });
    return;
  });
}

// Update an Employee Manager
function updateManager() {
  // Query: Creating choice array (employeeArray) for inquirer question
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
    // Query: Creating choice array (managerArray) for inquirer question
    sqlManager = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE manager_id IS NULL ORDER BY id`;
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
        // Finding employe_id matching Employee's full name which is chosen the from choice array: employeeArray
        let employee_id = 0;
        for (let i = 0; i < employeeTable.length; i++) {
          if (employeeTable[i].person === person) {
            employee_id = employeeTable[i].id;
          }
        }
        // Finding manager_id matching Manager's full name which is chosen the from choice array: managerArray
        let manager_id = null;
        for (let i = 0; i < managerTable.length; i++) {
          if (managerTable[i].manager === manager) {
            manager_id = managerTable[i].id;
          }
        }
        // Query: Updating the Employee's manager_id in the Employee table
        sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
        const params = [manager_id, employee_id];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log("Error message!");
            return;
          }
          console.log(`\nUpdated ${person}'s Manager is changed\n`);
          callMainMenu();
        });
      });
    return;
  });
}

// Delete a record from choice of Employee, Role and Department table
function deleteRecord(deleteChoice) {
  let sqlRecord = "";       // Query: Getting a record with id parameter
  let tableName = "";
  switch (deleteChoice) {
    case "Delete Employee": {
      tableName = "employees";
      sqlRecord = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.department_name AS department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id WHERE e.id = ?;`;
      break;
    }
    case "Delete Role": {
      tableName = "role";
      sqlRecord = `SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id WHERE role.id = ?;`;
      break;
    }
    case "Delete Department": {
      tableName = "department";
      sqlRecord = `SELECT id, department_name FROM department WHERE id = ?;`;
      break;
    }
    default:
      break;
  }
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: `Which ${tableName}'s record do you want to delete? Enter the ${tableName} ID:`,
    }])
    .then(function ({ id }) {
      const params = [id];
      db.query(sqlRecord, params, (err, rows) => {
        if (err) {
          console.log("Error message!");
          return;
        }
        console.log("\n");
        console.table(rows);
        // Confirm before deleting the record !!!
        inquirer.prompt([
          {
            type: "confirm",
            name: "question",
            message: "Do you still want to delete this record?",
          }])
          .then(function ({ question }) {
            if (question) {
              // Deleting a record from the table
              sql = `DELETE FROM ${tableName} WHERE id = ?`;
              db.query(sql, params, (err, result) => {
                if (err) {
                  console.log("Error message!");
                } else if (!result.affectedRows) {
                  console.log("Employee not found!");
                } else {
                  console.log(`\nA ${tableName}'s record with id=${id} is deleted from database!\n`);
                }
                callMainMenu();
              });
            } else {
              console.log("\nBack to the main menu\n");
              callMainMenu();
            }
          });
      });
    });
  return;
}

// function deleteEmployeeRecord() {
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "id",
//       message: "Which employee's record do you want to delete? Enter the employee ID:",
//     }])
//     .then(function ({ id }) {
//       // Query: Getting an employee record with id parameter
//       sqlEmployee = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.department_name AS department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id 
//                     WHERE e.id = ?;`;
//       const params = [id];
//       db.query(sqlEmployee, params, (err, rows) => {
//         if (err) {
//           console.log("Error message!");
//           return;
//         }
//         console.log("\n");
//         console.table(rows);
//         // Confirmg before deleting the employee record
//         inquirer.prompt([
//           {
//             type: "confirm",
//             name: "question",
//             message: "Do you still want to delete this record?",
//           }])
//           .then(function ({ question }) {
//             if (question) {
//               // Deleting an employee record from the Employee table
//               sql = `DELETE FROM employees WHERE id = ?`;
//               db.query(sql, params, (err, result) => {
//                 if (err) {
//                   console.log("Error message!");
//                 } else if (!result.affectedRows) {
//                   console.log("Employee not found!");
//                 } else {
//                   console.log(`\nAn employee's record with id=${id} is deleted from database!\n`);
//                 }
//                 callMainMenu();
//               });
//             } else {
//               console.log("\nBack to the main menu\n");
//               callMainMenu();
//             }
//           });
//       });
//     });
//   return;
// }

// // Delete a record from choice of Employee, Role and Department table
// function deleteRecord(deletechoice) {
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "id",
//       message: "Which role do you want to delete? Enter the role ID:",
//     }])
//     .then(function ({ id }) {
//       // Query: Getting a role record with id parameter
//       sqlRole = `SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id 
//                     WHERE role.id = ?;`;
//       const params = [id];
//       db.query(sqlRole, params, (err, rows) => {
//         if (err) {
//           console.log("Error message!");
//           return;
//         }
//         console.log("\n");
//         console.table(rows);
//         // Confirmg before deleting the role record
//         inquirer.prompt([
//           {
//             type: "confirm",
//             name: "question",
//             message: "Do you still want to delete this record?",
//           }])
//           .then(function ({ question }) {
//             if (question) {
//               // Deleting a role record from the Role table
//               sql = `DELETE FROM role WHERE id = ?`;
//               db.query(sql, params, (err, result) => {
//                 if (err) {
//                   console.log("Error message!");
//                 } else {
//                   if (!result.affectedRows) {
//                     console.log("Role not found!");
//                   } else {
//                   console.log(`\nA role record with id=${id} is deleted from database!\n`);
//                   }
//                 }
//                 callMainMenu();
//               });
//             } else {
//               console.log("\nBack to the main menu\n");
//               callMainMenu();
//             }
//           });
//       });
//     });
//   return;
// }

// // Delete a department
// function deleteDepartment() {
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "id",
//       message: "Which department do you want to delete? Enter the department ID:",
//     }])
//     .then(function ({ id }) {
//       // Query: Getting a department record with id parameter
//       sqlDepartment = `SELECT id, department_name FROM department 
//                   WHERE id = ?;`;
//       const params = [id];
//       db.query(sqlDepartment, params, (err, rows) => {
//         if (err) {
//           console.log("Error message!");
//           return;
//         }
//         console.log("\n");
//         console.table(rows);
//         // Confirmg before deleting the department record
//         inquirer.prompt([
//           {
//             type: "confirm",
//             name: "question",
//             message: "Do you still want to delete this record?",
//           }])
//           .then(function ({ question }) {
//             if (question) {
//               // Deleting an department name from the Department table
//               sql = `DELETE FROM department WHERE id = ?`;
//               db.query(sql, params, (err, result) => {
//                 if (err) {
//                   console.log("Error message!");
//                 } else if (!result.affectedRows) {
//                   console.log("Department not found!");
//                 } else {
//                   console.log(`\nA department name is deleted from database!\n`);
//                 }
//                 callMainMenu();
//               });
//             } else {
//               console.log("\nBack to the main menu\n");
//               callMainMenu();
//             }
//           });
//       });
//     });
//   return;
// }

// View any table with choice of Employees, Role, Department, Employees By Manager, Employees By Deapartment and Department By Budget
function viewTable(viewChoice) {
  let sql = "";
  switch (viewChoice) {
    case "View All Employees":
      sql = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.department_name AS department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id  JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY e.id;`;
      break;
    case "View All Roles":
      sql = `SELECT role.id AS id, role.title AS title, department.department_name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id;`;
      break;
    case "View All Departments":
      sql = `SELECT * FROM department ORDER BY department.id;`;
      break;
    case "View Employees By Manager":
      sql = `SELECT department.id AS d_id, department.department_name AS department, m.id AS m_id, CONCAT(m.first_name, ' ', m.last_name) AS manager, e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS employee, role.title, role.salary FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id WHERE e.manager_id IS NOT NULL ORDER BY e.manager_id;`;
      break;
    case "View Employees By Department":
      sql = `SELECT department.id AS d_id, department.department_name AS department, e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS employee, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.id;`;
      break;
    case "View Department By Budget":
      sql = `SELECT department.id AS id, department.department_name AS department, SUM(role.salary) AS budget FROM employees JOIN role ON employees.role_id = role.id JOIN department ON role.department_id = department.id GROUP BY department.id ORDER BY department.id;`;
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
        "Delete Role",
        "Delete Department",
        "View Employees By Manager",
        "View Employees By Department",
        "View Department By Budget",
        "Quit",
      ]
    }
  ])
    .then(function ({ menu }) {
      if (menu.includes("View")) {
        viewTable(menu);
      } else if (menu.includes("Delete")) {
        deleteRecord(menu);
      } else {
        switch (menu) {
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
          // case "Delete Employee": {
          //   deleteEmployeeRecord();
          //   break;
          // }
          // case "Delete Role": {
          //   deleteRole();
          //   break;
          // }
          // case "Delete Department": {
          //   deleteDepartment();
          //   break;
          // }
          case "Quit": {
            console.log("Goodbye!");
            process.exit(0);
            break;
          }
          default:
            break;
        }
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