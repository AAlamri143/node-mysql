var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Faten_143",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

// Connecting to the Bamazon Database
connection.connect(function(err){
    if(err){
    console.log('Error connecting to Db');
    return;
    }
    console.log('Connection established');

// function runSearch() {
//     inquirer
//         .prompt({
//             name: "action",
//             Type: "list",
//             Message: "Insert the following information:",
//             Choices: [
//                 "What"
//             ]
//         })
 }