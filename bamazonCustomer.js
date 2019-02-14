require('dotenv').config();
var mysql = require("mysql");
var prompt = require("prompt");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: process.env.PASSWORD_DB,
  database: process.env.BAMAZON_DB
});


// Connecting to the bamazon Database
connection.connect(function(err){
    if(err){
    console.log('Error connecting to Db');
    return;
    }
    console.log('Connection established');

    var schema = {
        properties: {
            ID: {
            message: "Enter the ID of the product you would like to buy",
            required: true
            },
            howMany: {
            message: "Enter the quantity you would like to buy",
            required: true
            }
        }
    };

    var schema2 = {
        properties: {
            AnotherPurchase: {
            message: "Would you like to buy another item?",
            required: true
            },
        }
    };

// Function to start the app
var beginApp = function(){
    connection.query("SELECT * FROM Products", function(err, result) {
        if (err) throw err;
        return (getBamazonProd(result));
      });
}

//this function is where to start.
var getBamazonProd = function(products){
	//connects to the mysql database called products and returns the information from that database
	connection.query('SELECT * FROM products', function(){
        console.log('');
        console.log("Hello, Welcome to Bamazon!");
		console.log('Products for Sale')
		console.log('');	

		//this creates a table outline in the node app to organize the data
		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//this loops through the mysql connection and for each item that is returned, the information is then pushed to the table
		for(var i=0; i<products.length; i++){
			table.push(
				[products[i].ItemID, products[i].ProductName, products[i].DepartmentName, products[i].Price, products[i].StockQuantity]
			);
		}

		//this console.logs the table and then ends the mysql query connection
		console.log(table.toString());
        userSelectID();
	})
};


    // Function to get the user selection
    var userSelectID = function(){
        prompt.start();
        console.log("Enter the ID of the product you would like to buy");

        prompt.get(schema, function (err, result) {
            if (err){
                console.log(err)
            }

            var userChoiceID = parseInt(result.ID);
            var userChoiceHowMany = parseInt(result.howMany);

            // Function to check the inventory of an item
            var checkInventory = function(){
                connection.query('SELECT * FROM Products WHERE ItemID =' + userChoiceID, function(err, result) {
                    if (err) throw err;

                    var userWantsToBuy = userChoiceHowMany;
                    var productInventory = result[0].StockQuantity;
                    var productsPrice = result[0].Price;
                    var isInStock = productInventory - userWantsToBuy;
                    var totalCost= productsPrice * userWantsToBuy;

                    if (userWantsToBuy > productInventory || productInventory === 0){
                        console.log("Apologies but there isn't enough in stock to complete your order."+"\n"+"\n");
                        userSelectID();
                    } else {
                        console.log("\n\nThe new quantity in stock is "+isInStock+" of "+result[0].ProductName);
                        console.log("You are purchasing "+ userWantsToBuy +" "+result[0].ProductName+" at $"+ result[0].Price+" per each.");
                        console.log("Your total: $"+totalCost+ "\n\n");
                        connection.query('UPDATE Products SET StockQuantity = '+isInStock+' WHERE ItemID ='+userChoiceID, function(err){
                        if (err) throw err;
                            connection.query('SELECT ItemID, ProductName, DepartmentName, Price, StockQuantity FROM products WHERE ItemID ='+userChoiceID, function(){
                            }); 
                        });
                        prompt.get(schema2, function (err, result) {
                            if (err){
                                console.log(err)
                            }
                            console.log(result);
                            var userAnswer = result.AnotherPurchase;
                            if (userAnswer === "n" || userAnswer === "no" || userAnswer === "No"){
                                connection.end();

                            }else{
                                beginApp();
                            }   
                        });
                    }
                  });
            };
            checkInventory();
        });
    }

// start the app
beginApp();
});

