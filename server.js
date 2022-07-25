//Dependencies
//Dependencies found here
const inquirer = require("inquirer");
const mysql = require("mysql");
//const db = require(".");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    // Port, Username, Password, and Database
    port: 3001,
    user: "root",
    password: "Raquel",
    //database: "employee_tracker"
  });

  connection.connect((err) => {
    if (err) throw err;

    runSearch();
  });

//User prompts/selection list
  function runSearch() {
    inquirer.prompt({
        type: "list",
        name: "selection options",
        choices: [
            "Add role",
            "Add department",
            "Add employee",
            "View role",
            "View department",
            "View employee",
            "Update employee role",
        ]
    })
    .then(function(result) {
        console.log(result);

        if(result.selection === "Add role") {
            addRole();
        }
        else if(result.selection === "Add department") {
            addDept();
        }
        else if(result.selection === "View role") {
            viewRole();
        }
        else if(result.selection === "View department") {
            viewDept();
        }
        else if(result.selection === "View employee") {
            viewEmployee();
        }
        else if(result.selection === "Update employee role") {
            updateRole();
        }
        else {
            quit();
        }
    });
  }

  const roleOptions = [];
  const empOptions = [];
  const deptOptions = [];

  //Function to Add Employee Role
  function addRole() {

    findRole()
    findEmployee()
    findDept()

    inquirer.prompt([
        {
            name: "role title",
            type: "user input",
            message: "Enter the title of the role to add"
        },
        {
            name: "salary",
            type: "user-input",
            message: "Enter the annual salary of this role"
        },
        {
            name: "department",
            type: "list",
            message: "Select the Department this role reports to",
            choices: 'deptSelections'
        }
    ])
    .then(function(result) {
        
    })
  }



  //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
//Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

//Resources:
//SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp