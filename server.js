//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
//const db = require(".");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    // Port, Username, Password, and Database
    port: 3001,
    user: "root",
    password: "Raquel",
    database: "employee_tracker_db"
  });

  connection.connect(function(err) {
    //if (err) throw err;
    console.log("connected as id" + connection.threadId + "\n");
    runDb();
  });

//User prompts/selection list
  function runDb() {
    inquirer
    .prompt([
        {
        type: "list",
        name: "action",
        message: "Please select an option to proceed",
        choices: [
            "Add employee",
            "Add role",
            "Add department",
            "View role",
            "View department",
            "View employee",
            "Update employee role",
            "Done",
        ]
    }
    ])
  
    .then(function(answer) {
        // console.log(answer);
            switch (answer.action) {

                case "View all employees":
                return viewEmp();
                break;

                case "Add employee":
                 return addEmployee();
                break;

                case "Update employee role":
                return updateEmpRole();
                break;

                case "View all roles":
                return viewRole();
                break;

                 case "Add role":
                return addRole();
                break;

                case "View all departments":
                return viewDept();
                break;

                case "Add department":
                return addDept();
                break;

                case "DONE":
                return quit();
                break;
            }
        })
  }

  //View employees
  function viewEmp() {
    connection.query("SELECT employee.first_name, employee.last_name, roles.title AS \"role\", manager.first_name AS \"manager\" FROM employee LEFT JOIN roles on employee.id = roles.id LEFT JOIN employee manager ON employee.manager_id = manager_id GROUP BY employee_id",
    function(err, answer) {
      if (err) throw err;
      console.table(answer);
      runDb();
  });
}

// View Departments
function viewDept() {
    connection.query ("SELECT * FROM department", function(err, answer){
        console.table(answer);
        runDb();
      })
      }

// View roles
function viewRole(){
    connection.query("SELECT roles.*, department.name FROM roles LEFT JOIN department ON department.id = roles.department_id", function (err,answer){
      if (err) throw err;
      console.table(answer);
      runDb();
    })
    }

// // VIEW Employees Per Department
// function viewDept() {
//   connection.query("SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.id;", 
//   function(err, res) {
//     if (err) throw err
//     console.log ("");
//     console.log("* LIST OF DEPARTMENTS*")
//     console.log ("");
//     console.table(res)
//     runDb()
//   })
// }

// // View Employee Roles
// function viewRole() {
//   connection.query("SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title FROM employee JOIN roles ON employee.role_id = role.id ORDER BY role.id", 
//   function(err, res) {
//   if (err) throw err
//   console.log ("");
//   console.log("* EMPLOYEE ROLE LIST *")
//   console.log ("");
//   console.table(res)
//   runDb()
//   })
// }

// Array for Employee Addition
let roleOptionArr = [];                                            
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleOptionArr.push(res[i].title);
    }
  })
  return roleOptionArr;
}

// Array for Managers
let managerOptionArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managerOptionArr.push(res[i].first_name);
    }
  })
  return managerOptionArr;
}

//Department Array
let deptOptionArr = [];
function selectDepartment() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      deptOptionArr.push(res[i].name);
    }
})
return deptOptionArr;
}


// ADD EMPLOYEE
function addEmployee() { 
    console.log("Adding a new employee.\n");
    inquirer
    .prompt([
        {
          name: "first-name",
          type: "input",
          message: "first_name"
        },
        {
          name: "last-name",
          type: "input",
          message: "last_name"
        },
        {
          name: "role",
          type: "list",
          message: "Enter title of new employee ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "list",
            message: "Select the Employee's Manager ",
            choices: selectManager()
        }

    ])
    .then(function(answer) {
      let role_id = selectRole().indexOf(answer.role) + 1
      let manager_id = selectManager().indexOf(answer.choice) + 1
     const query = connection.query(
        "INSERT INTO employee SET ?",
        answer,
        function (err, answer) {
            if (err) throw err;
            console.log("Added New Employee!\n");

            runDb();
        }
     );
    })
}

// Update Employee Role
function updateEmpRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", 
    (err, res) => {
            if (err) throw err;
 
            inquirer.prompt([
                {
                    name: "last_name",
                    type: "list",
                    choices: function () {
                        let last_name = [];
                        for (var i = 0; i < res.length; i++) {
                            last_name.push(res[i].last_name);
                        }
                        return last_name;
                    },
                    message: "Enter the Employee's Last Name",
                },
                {
                    name: "role",
                    type: "list",
                    message: "Enter new title for Employee to be inserted",
                    choices: selectRole()
                },
            ]).then(function (answer) {
                let role_id = selectRole().indexOf(answer.role) + 1;
                connection.query("UPDATE employee SET WHERE ?",
                    {
                        last_name: answer.last_name,
                        role_id: role_id
                    },
        
                    function (err) {
                        if (err)
                            throw err;
                        console.table(answer);
                        runDb();
                    });
            });
        });
  }


// Add Department
function addDept() { 

    inquirer.prompt([
        {
          name: "name",
          type: "user input",
          message: "Enter which department to add"
        },
        {
            name: "id",
            type: "user input",
            message: "Enter the ID Number for the new Department "
          }

    ]).then(function(answer) {
        connection.query("INSERT INTO department SET ? ",
            {
              name: answer.name,
              id: answer.id
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runDb();
            }
        )
    })
  }

  // Add Role
  function addRole() { 
    connection.query("SELECT roles.title AS Title, roles.salary AS Salary FROM roles LEFT JOIN department.name AS Department FROM department;",   
    function(err, res) {
  
      inquirer.prompt([
          {
            name: "title",
            type: "user input",
            message: "Enter the name of the new role"
          },
          {
            name: "salary",
            type: "user input",
            message: "Enter the Salary of the new role"
          } ,
          {
            name: "department",
            type: "list",
            message: "Select Department the new role reports to",
            choices: selectDepartment()
          }
      ]).then(function(answer) {
          let dept_id = selectDepartment().indexOf(answer.choice) + 1
          connection.query(
              "INSERT INTO roles SET ?",
              {
                title: answer.title,
                salary: answer.salary,
                department_id: dept_id
              },
              function(err) {
                  if (err) throw err
                  console.table(answer);
                  runDb();
              }
          )     
      });
    });
};






//   //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
// //Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

// //Resources:
// //SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
// //Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.