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

  //role array "roleOptions"
  const roleOptionsArr = [];
  function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleOptionsArr.push(res[i].title);
        }
    })
    return roleOptionsArr;
  }

  const deptOptionsArr = [];
  function selectDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err
        for (var i = 0, i < res.length; i++) {
            deptOptionsArr.push(res[i].name);
        }
    })
    return deptOptionsArr;
  }

  //manager options array
  const manOptionsArr = [];
  function selectEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err
        for (var i = 0, i < res.length; i++) {
            manOptionsArr.push(res[i].name);
        }  
    })
  }

  //add employee function
  function addEmployee() {
    selectEmployee()
    inquirer.prompt([
        {
            name: "first",
            type: "user input",
            message: "Enter the first name of the new employee"
        },
        {
            name: "last",
            type: "user input",
            message: "ENter the last name of the new employee"
        },
        {
            name: "role",
            type: "list",
            message: "Select the employee's role",
            choices: roleOptionsArr
        },
        {
        name: "manager",
        type: "list",
        message: "Select the employee's reporting manager",
        choices: manOptionsArr
        }
    ])

    .then(function(result) {
        let getRoleId = result.role.split("-")
        let getManagerId = result.manager.split("-")
        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ('${result.firstname}', ${result.lastname}', ${getRoleId[0]}','${getReportingToId[0]}')`;)
        connection.query(query, function(err, res) {
            console.log(`${result.firstname} ${result.lastname} WAS SUCCESSFULLY ADDED!`)
        });
        runSearch();
    };
  
  //add role function
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
        console.log(`${result.role}`)
        let getDeptId = answer.dept.split(".")
        let query = `INSERT INTO role (role title, salary, department_id)
        VALUES ('${result.role}', '${result.salary}', '${getDeptId[0]}')`;
        connection.query(query, function (err, res) {
            console.log(`New role was Successfully Added ${result.role}`)
        });
        runSearch();
        
    });
  };





  //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
//Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

//Resources:
//SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
//Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.