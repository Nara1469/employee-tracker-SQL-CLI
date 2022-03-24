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

Before run the application run by using the following command:
    
```
mysql -u root -p // with password
source db/schema.sql
source db/seeds.sql
quit
```
    
The application will be invoked by using the following command:
    
```
node index.js
```

## Database Structure

The database name: `employees_db`. In the `employees_db`, there are 3 tables: `employees`, `role` and `department`. All database related files are in the `db` directory: `schema.sql`, `seeds.sql`, `query.sql` and `test.sql` files to pre-populate the database and used during the development.

The database structure is shown in the following image:

![Database includes tables labeled “employees,” role,” and “department.”](./Assets/12-sql-homework-demo-01.png)

As the image illustrates, schema.sql contains the following three tables:

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

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

This application functionality will look like in the following way:

```
init()      // runs the application
|
callMainMenu()
|
├── viewTables()  
│   ├── "View All Employees"               
│   ├── "View All Roles"               
│   ├── "View All Departments"               
│   ├── "View Employees By Manager"               
│   ├── "View Employees By Department"               
│   └── "View Department By Budget"
├── addEmployee() --- "Add Employee"          
├── addRole() ------- "Add Role"                  
├── addDepartment() - "Add Deapartment"          
├── deleteRecord()
│   ├── "Delete Department"              
│   ├── "Delete Role"            
│   └── "Delete Employee"      
├── updateRole() ---- "Update Employee Role"          
├── updateManager() - "Update Employee Manager"                  
└──"Quit"    // exit from the application
```

> **Note**: All the additional bonus functionalities was done. 

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.

## Walkthrough Video

A walkthrough video that demonstrates the functionality of the employee tracker. [Walkthrough Video - on Youtube](https://youtu.be/yWx5P_RQEBs)

If you have any questions about the repo, open an issue or contact me directly at naraamtm@gmail.com. Here is a link to this application repo on [Github](https://github.com/Nara1469/employee-tracker-SQL-CLI).