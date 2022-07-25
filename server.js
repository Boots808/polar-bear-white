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

//User promts/selection list
  function runSearch() {
    inquirer.prompt({
        type: "list",
        name: "selection options",
        choices [
            "Add role",
            "Add department",
            "Add employee",
            

        ]
    })
  }