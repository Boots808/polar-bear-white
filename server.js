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
              `INSERT INTO department (name) VALUES (?)`,
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
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
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
                `INSERT INTO role (title, salary, dept_id) VALUES (?,?,?)`,
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
        db.query(`SELECT * FROM employee, role`, (err, result) => {
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
                  console.log("Employee Added Successfully!");
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
                  console.log("Role was Successfully Updated!");
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

// FIRST CODE BELOW

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Raquel",
//   database: "employee_tracker_db",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("connected as id ");
//   startTracker();
// });

// function startTracker() {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "userAnsw",
//         message: "Select an Option From the List Below:",

//         choices: [
//           "Add department",
//           "Add role",
//           "Add employee",
//           "View departments",
//           "View roles",
//           "View employees",
//           "Update employee role",
//           "Quit",
//         ],
//       },
//     ])

//     .then((res) => {
//       console.log(res.userAnsw);

//       switch (res.userAnsw) {
//         case "Add department":
//           addDept();
//           break;

//         case "Add role":
//           addRole();
//           break;

//         case "Add employee":
//           addEmployee();
//           break;

//         case "View departments":
//           viewDepts();
//           break;

//         case "View roles":
//           viewRoles();
//           break;

//         case "View all employees":
//           viewAllEmployees();
//           break;

//         case "Update employee role":
//           updateEmpRole();
//           break;

//         case "Exit":
//           connection.end();
//           break;
//       }
//     })
//     .catch((err) => {
//       if (err) throw err;
//     });
// }

// //Add Department

// function addDept() {
//   inquirer
//     .prompt({
//       type: "input",
//       message: "Enter the new Department Name",
//       name: "newDept",
//     })
//     .then(function (answer) {
//       db.connect(
//         "INSERT INTO department (dept_name) VALUES (?)",
//         [answer.newDept],
//         function (err, res) {
//           if (err) throw err;
//           console.table(res);
//           startTracker();
//         }
//       );
//     });
// }

// //Add New Role

// function addRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "Enter the title of the new Role",
//         name: "newRole",
//       },
//       {
//         type: "input",
//         message: "Enter the Salary for this role:",
//         name: "salary",
//       },
//       {
//         type: "input",
//         message: "Enter the department ID number:",
//         name: "dept_id",
//       },
//     ])
//     .then(function (answer) {
//       db.connect(
//         "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
//         [answer.newRole, answer.salary, answer.dept_id],
//         function (err, res) {
//           if (err) throw err;
//           console.table(res);
//           startTracker();
//         }
//       );
//     });
// }

// //Add new employee

// function addEmployee() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "Enter the first name of the new employee",
//         name: "first_name",
//       },
//       {
//         type: "input",
//         message: "Enter the last name of the new employee",
//         name: "last_name",
//       },
//       {
//         type: "input",
//         message: "Enter the employees role ID number",
//         name: "role_id",
//       },
//       {
//         type: "input",
//         message: "Enter the Manager's ID number",
//         name: "manager_id",
//       },
//     ])
//     .then(function (answer) {
//       db.connect(
//         "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
//         [
//           answer.first_name,
//           answer.last_name,
//           answer.role_id,
//           answer.manager_id,
//         ],
//         function (err, res) {
//           if (err) throw err;
//           console.table(res);
//           startTracker();
//         }
//       );
//     });
// }
// //update employee role

// function updateEmpRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "Enter employee you would like to update",
//         name: "emp_update",
//       },

//       {
//         type: "input",
//         message: "Enter the name of employee new role",
//         name: "role_update",
//       },
//     ])
//     .then(function (answer) {
//       console.log(query);

//       db.connect(
//         "UPDATE employee SET role_id=? WHERE first_name= ?",
//         [answer.role_update, answer.emp_update],
//         function (err, res) {
//           if (err) throw err;
//           console.table(res);
//           startTracker();
//         }
//       );
//     });
// }

// function viewDepts() {
//   let query = "SELECT * FROM department";
//   db.connect(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     startTracker();
//   });
// }

// function viewRoles() {
//   let query = "SELECT * FROM role";
//   db.connect(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     startTracker();
//   });
// }

// function viewAllEmployees() {
//   let query = "SELECT * FROM employee";
//   db.connect(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     startTracker();
//   });
// }

// function quit() {
//   connection.end();
//   process.exit();
// }

// //   //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
// // //Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

// // //Resources:
// // //SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
// // //Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.
