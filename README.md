# employee-tracker-SQL-CLI

Bootcamp Week 12: Homework

# 12 SQL: Employee Management System

## Table of Contents 

- [About Task](#about-task)
- [User Story](#user-story)
- [License](#license)
- [Installation Guide](#installation-guide)
- [Database Structure](#database-structure)
- [My Solution](#my-solution)
- [Walkthrough Video](#walkthrough-video)

## About Task

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. This assignment is to build a command-line application from scratch to manage a company's employee database, using Node.js, [Inquirer package](https://www.npmjs.com/package/inquirer) to interact with the user via the command line, [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to a MySQL database and perform queries and the [console.table package](https://www.npmjs.com/package/console.table) to print MySQL rows to the console.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## License

🏆 This application is licensed under The MIT License.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation Guide

This application uses Inquirer, MySQL2 and console.table packages. It is required to install all necessary dependencies.

First clone the repository then run the following command at the root directory to install the dependencies:

```
npm i
```
    
The application will be invoked by using the following command:
    
```
node index.js
```

For the testing purpose it is helpful to run these commands to create and seed a  database:
    
```
mysql -u root -p // with password
source db/schema.sql
source db/seeds.sql
quit
```

## Database Structure

The database name: `employees_db`. All database related files are in the `db` directory: `schema.sql`, `seeds.sql`, `query.sql`, and `test.sql` files to pre-populate the database and used during the development.

The database structure is shown in the following image:

![Database includes tables labeled “employees,” role,” and “department.”](./Assets/12-sql-homework-demo-01.png)

As the image illustrates, the `employees_db` database contains the following three tables:

* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employees`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)

## My Solution

This command-line application starts with a choice of a list which is called `Main Menu` with the following options: 

- "View All Employees"
- "View All Roles"
- "View All Departments"
- "Add Employee"
- "Add Role"
- "Add Department"
- "Update Employee Role"
- "Update Employee Manager"
- "Delete Employee"
- "Delete Role"
- "Delete Department"
- "View Employees By Role"
- "View Employees By Manager"
- "View Departments By Budget"
- "Quit"

A user able to do the "view", "add", "update" and "delete" operations in all 3 tables:
- department
- role
- employees

Also any of these functions are done, the user goes back to `Main Menu`.

All view table operations are done in one function the choice of the user selection. And prints results on screen with a help of `console.table` package. /viewTable()/

To add a record in a table, inputs are different depending on a table. So 3 separate functions are used. Some inputs are needed an array of choices  dynamically created from the database. It was the challenging part of this task. After the user made choice from the array, the app needs to find the chosen input's PRIMARY KEY id from the table and send it to the query. Then the app needs to do the real operation. /addDepartment(), addRole() and addEmployee()/

To update the Employee table, 2 separate functions are used. Similarly, the choice of role and manager's list array is dynamically created from the database.  After the user made choice from the array, the app needs to find the chosen input's PRIMARY KEY id from the table and send it to the query. /updateRole() and updateManager()/ 

All delete operations are done in one function the choice of the table selection. And prints results on screen with a help of `console.table` package. The user needs to enter an "id" number of a record that needs to be deleted. First, find the deleting record from the table and print that record on the screen. Then I added a confirm question before delete. So always asks "Do you still want to delete this record?". If the parent table record is deleted, the child table records are deleted on CASCADE effect (ON DELETE CASCADE - schema.sql). If a  manager's record is deleted from the Employees table, all the employee's manager_id is changed to NULL (ON DELETE SET NULL - schema.sql). /deleteRecord()/

This application functionality will look like in the following way:

```
init()      // runs the application
|
callMainMenu()  // Main menu
|
├── viewTables(choice)         // all view table queries used in this function
│   ├── "View All Employees"               
│   ├── "View All Roles"               
│   ├── "View All Departments"               
│   ├── "View Employees By Manager"               
│   ├── "View Employees By Department"               
│   └── "View Department By Budget"
├── addEmployee() --- "Add Employee"          
├── addRole() ------- "Add Role"                  
├── addDepartment() - "Add Deapartment"          
├── deleteRecord(choice)       // all delete one record from any table called in this function
│   ├── "Delete Department"              
│   ├── "Delete Role"            
│   └── "Delete Employee"      
├── updateRole() ---- "Update Employee Role"          
├── updateManager() - "Update Employee Manager"                  
└──"Quit"    // exit from the application
```

> **Note**: All the additional bonus functionalities were done. 

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.

## Walkthrough Video

A walkthrough video that demonstrates the functionality of the employee tracker. [Walkthrough Video - on Youtube](https://youtu.be/yWx5P_RQEBs)

If you have any questions about the repo, open an issue or contact me directly at naraamtm@gmail.com. Here is a link to this application repo on [Github](https://github.com/Nara1469/employee-tracker-SQL-CLI).