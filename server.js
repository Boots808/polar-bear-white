//Dependencies
const CTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Raquel",
  database: "employee_tracker_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("DB Connected");
  employee_tracker_db();
});

//SECOND CODE BELOW

let employee_tracker_db = function () {
  inquirer
    .prompt([
      {
        //user prompts
        type: "list",
        name: "prompt",
        message: "Please Select from the list to begin",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add Role",
          "Add new Employee",
          "Update Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      //View departments
      if (answers.prompt === "View All Departments") {
        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          console.log("Department List:");
          console.table(result);
          employee_tracker_db();
        });
      } else if (answers.prompt === "View All Roles") {
        db.query(`SELECT * FROM roles`, (err, result) => {
          if (err) throw err;
          console.log("Roles List:");
          console.table(result);
          employee_tracker_db();
        });
      } else if (answers.prompt === "View All Employees") {
        db.query(`SELECT * FROM employee`, (err, result) => {
          if (err) throw err;
          console.log("Employee List:");
          console.table(result);
          employee_tracker_db();
        });
      } else if (answers.prompt === "Add a Department") {
        inquirer
          .prompt([
            {
              //Add Department Function
              type: "input",
              name: "department",
              message: "Enter the New Department Name",
            },
          ])
          .then((answers) => {
            db.query(
              `REPLACE INTO department (dept_name) VALUES (?)`,
              [answers.department],
              (err, _result) => {
                if (err) throw err;
                console.log("New Department Added!");
                employee_tracker_db();
              }
            );
          });
      } else if (answers.prompt === "Add Role") {
        //function for adding role
        db.query(`SELECT * FROM department`, (err, _result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                //Role Info to Add
                type: "input",
                name: "role",
                message: "Enter the new Role",
              },
              {
                type: "input",
                name: "salary",
                message: "Enter Salary for Role",
              },
              {
                type: "list",
                name: "department",
                message: "Select Department for Role",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.roles; i++) {
                    array.push(result[i].dept_name);
                  }
                  return array;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                  var department = result[i];
                }
              }

              db.query(
                `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`,
                [answers.role, answers.salary, dept_id],
                (err, _result) => {
                  if (err) throw err;
                  console.log("Employee was Added!");
                  employee_tracker_db();
                }
              );
            });
        });
      } else if (answers.prompt === "Add new Employee") {
        db.query(`SELECT * FROM employee, roles`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Enter the Employee First Name",
              },
              {
                type: "input",
                name: "lastName",
                message: "Enter the Employee Last Name",
              },
              //Add Role function
              {
                type: "list",
                name: "role",
                message: "Select Role for Employee",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                },
              },
              //Employee manager function
              {
                type: "input",
                name: "manager",
                message: "Enter the Reporting Manager for Employee",
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }
              db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
                [
                  answers.firstName,
                  answers.lastName,
                  role.id,
                  answers.manager.id,
                ],
                (err, result) => {
                  if (err) throw err;
                  console.log(`${answers.employee} was Successfully Added!`);
                  employee_tracker_db();
                }
              );
            });
        });
      } else if (answers.prompt === "Update Employee Role") {
        db.query(`SELECT * FROM employee, roles`, (err, result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                //Select employee to Update
                type: "list",
                name: "employee",
                message: "Select Employee Role to Update",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].last_name);
                  }
                  var employeeArray = [...new Set(array)];
                  return employeeArray;
                },
              },
              {
                //Update to the New Role
                type: "list",
                name: "role",
                message: "Enter the New Role",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newRoleArray = [...new Set(array)];
                  return newRoleArray;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === answers.employee) {
                  var name = result[i];
                }
              }
              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.roles) {
                  var role = result[i];
                }
              }
              db.query(
                `UPDATE employee SET ? WHERE ?`,
                [{ role_id: role }, { last_name: name }],
                (err, result) => {
                  if (err) throw err;
                  console.log(`${answers.employee} was successfully added!`);
                  employee_tracker_db();
                }
              );
            });
        });
      } else if (answers.prompt === "Exit") {
        db.end();
        console.log("Exiting Options!");
      }
    });
};

//Resources:
//SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
//Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.
//SQL ERROR: https://stackoverflow.com/questions/21785975/mysql-error-1136-21s01-column-count-doesnt-match-value-count-at-row-1
//New Set Array: https://stackoverflow.com/questions/63928416/how-does-new-setarray-works-in-javascript#:~:text=Essentially%20a%20Set%20is%20a,remove%20duplicates%20from%20the%20array.
//choice paramater issue: https://github.com/nrwl/nx/issues/4593
