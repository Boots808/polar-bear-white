//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
//const db = require(".");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "Raquel",
  database: "employee_tracker_db"
});

connection.connect(function(err) {
  //if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startDB();

});


function startDB() {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee role",
        "Quit"
      ],
      message: "Select an Option From the List Below:",
      name: "answer"
    })
    .then(function(result) {
      console.log(result.answer);

      switch (result.answer) {
        case "Add department":
          addDept();
          break;

        case "Add role":
          addRole();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "View departments":
          viewDepts();
          break;

        case "View roles":
          viewRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Update employee role":
          updateEmpRole();
          break;

        default:
          quit();
      }
    });
}


//Add Department

function addDept() {
    inquirer
    .prompt({
        type: "input",
        message: "Enter the new Department Name",
        name: "newDept"

    }).then(function(answer){

        connection.query("INSERT INTO department (name) VALUES (?)", [answer.newDept] , function(err, res) {
            if (err) throw err;
            console.table(res)
            startDB()
    })
    })
}

//Add New Role

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the title of the new Role",
        name: "newRole"
      },
      {
        type: "input",
        message: "Enter the Salary for this role:",
        name: "salary"
      },
      {
        type: "input",
        message: "Enter the department ID number:",
        name: "dept_id"
      }
    ])
    .then(function(answer) {

      connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [answer.newRole, answer.salary, answer.dept_id], function(err, res) {
        if (err) throw err;
        console.table(res);
        startDB();
      });
    });
}

//Add new employee 

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the first name of the new employee",
        name: "first_name"
      },
      {
        type: "input",
        message: "Enter the last name of the new employee",
        name: "last_name"
      },
      {
        type: "input",
        message: "Enter the employees role ID number",
        name: "role_id"
      },
      {
        type: "input",
        message: "Enter the Manager's ID number",
        name: "manager_id"
      }
    ])
    .then(function(answer) {

      
      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], function(err, res) {
        if (err) throw err;
        console.table(res);
        startDB();
      });
    });
}

//arrays

function updateEmpRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee you would like to update",
        name: "emp_update"
      },

      {
        type: "input",
        message: "Enter the name of employee new role",
        name: "role_update"
      }
    ])
    .then(function(answer) {
    //   let query = `INSERT INTO department (name) VALUES ("${answer.newDept}")`
    //   let query = `'UPDATE employee SET role_id=${answer.role_update} WHERE first_name= ${answer.emp_update}`;
      console.log(query);

      connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[answer.role_update, answer.emp_update],function(err, res) {
        if (err) throw err;
        console.table(res);
        startDB();
      });
    });
}

function viewDepts() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startDB();
  });
}

function viewRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startDB();
  });
}

function viewAllEmployees() {
  let query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startDB();
  });
}

function quit() {
  connection.end();
  process.exit();
}



//   //Bonus: Update employee managers, view employees by manager, view employees by department, delete , roles, and employees.
// //Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

// //Resources:
// //SQL Functions: https://www.w3schools.com/sql/sql_ref_sqlserver.asp - https://www.w3schools.com/sql/sql_operators.asp
// //Lookup Functions: https://www.labkey.org/Documentation/wiki-page.view?name=lookups#:~:text=Lookups%20are%20an%20intuitive%20table,the%20source%20table%20or%20query.