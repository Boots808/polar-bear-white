//Dependencies
//Dependencies found here
const inquirer = require("inquirer");
const mysql = require("mysql");
//const db = require(".");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    // Port, Username, Password, and Database
    port: 3001,
    user: "root",
    password: "Raquel",
    database: "employee_tracker_db"
  });

  connection.connect((err) => {
    if (err) throw err;

    runDb();
  });

//User prompts/selection list
  function runDb() {
    inquirer.prompt([{
        type: "list",
        name: "options",
        message: "Please select an option to proceed",
        choices: [
            "Add employee",
            "Add role",
            "Add department",
            "View role",
            "View department",
            "View employee",
            "Update employee role",
            "DONE",
        ]
    }
])
    .then(function(answer) {
        // console.log(answer);
            switch (answer.options) {

                case "Add employee":
                 return addEmployee();
              case "Add role":
                return addRole();
            case "Add department":
                return addDept();
            case "View role":
                return viewRole();
            case "View department":
                return viewDept();
            case "View employee":
                return viewEmp();
            case "Update employee role":
                return updateEmpRole();
            case "DONE":
                return quit();
            }
        })
  };

  
  //manager options array
  const manOptionsArr = [];
  function selectEmployee() {
    connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            manOptionsArr.push(res[i].first_name);
        }  
    })
    return manOptionsArr;
  }

  
  //role array "roleOptions"
  const roleOptionsArr = [];

  function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleOptionsArr.push(res[i].title);
        }
    })
    return roleOptionsArr;
  }

  //department array "deptOptionsArr"

  const deptOptionsArr = [];
  function selectDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
            deptOptionsArr.push(res[i].name);
        }
    })
    return deptOptionsArr;
  }

  //add employee function
  function addEmployee() {
    inquirer.prompt([
        {
            name: "first",
            type: "user input",
            message: "Enter the first name of the new employee"
        },
        {
            name: "last",
            type: "user input",
            message: "Enter the last name of the new employee"
        },
        {
            name: "role",
            type: "list",
            message: "Select the employee's role",
            choices: roleOptionsArr()
        },
        {
        name: "manager",
        type: "list",
        message: "Select the employee's reporting manager",
        choices: manOptionsArr()
        }
    ])
    .then(function(answer) {
        let role_id = selectRole().indexOf(answer.role) + 1
        let manager_id = selectEmployee().indexOf(answer.choices) + 1
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: manager_id,
            role_id: role_id
        },
        function(err) {
            if (err) throw err
            console.table(answer)
            runDb()
        })
    })
  }

  
  //add role function
  function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role LEFT JOIN department.name AS Department FROM department;", 
    function(err, res) {
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
            choices: selectDepartment()
        }
    ])
    .then(function(answer) {
     let department_id = selectDepartment().indexOf(answer.choices) + 1
     connection.query("INSERT INTO role SET",
     {
        title: answer.title,
        salary: answer.salary,
        department_id: department_id
     },
     function (err) { if (err) throw err
    console.table(answer);
    runDb();
})

     });
        
    });
  };

  //add department function
  function addDept() {

    inquirer.prompt([
        {
            name: "dept",
            type: "user input",
            message: "Input the department you want to add"
        },
        {
            name: "department num",
            type: "user input",
            message: "Enter the Departments ID Number"
        }
    ])
        .then(function(ander) {
            connection.query("INSERT INTO department SET ?",
            {
                name: answer.name,
                id: answer.id
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runDb();
            })
        })
  }

//View employees
  function viewEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
        function (err, result, fields) {
            if (err) throw err;
            console.table(result);

            runDb();
        }
        );
  };


//   //view departments
  function viewDept() {
    connection.query("SELECT * FROM department", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runDb();
    });
  };

//   //view roles
  function viewRole() {
    connection.query("SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
    function(err,result, fields) {
        if (err) throw err;
        console.table(result);
        runDb();
    }
    );
  };

  //Update role function
 
//   function updateRole() {
//     connection.query('SELECT * FROM employee', function (err, result) {
//         if (err) throw (err);
//         inquirer.prompt([
//             const employeeUpdArray[];
//             {
//                 name: "employeeName",
//                 type: "list",
//                 message: "Select employee to change role",
//                 choices: function () {
               









  //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
//Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

//Resources:
//SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
//Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.