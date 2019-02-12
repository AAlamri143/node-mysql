var mysql = require("mysql");
var prompt = require("prompt");


var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Faten_143",
  database: "bamazon"
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

// Function stop to the app
var stopApp = function(){
    return next(err);
}
// Function to start the app
var beginApp = function(){
    connection.query("SELECT * FROM Products", function(err, result) {
        if (err) throw err;
        return (getBamazonProd(result));
      
      });
}

    // Function to display all of the products available for sale in a table
    var getBamazonProd = function (products){
        console.log("Hello, Welcome to Bamazon! Here are all of the products, their costs, and current stock.");
        for (var i = 0; i < products.length; i++) {
            var productsResults = ""+
            "ItemID: " + products[i].ItemID+"\n"+
            "Product Description: " + products[i].ProductName+"\n"+
            "Department: " + products[i].DepartmentName+"\n"+
            "Price: $"+ products[i].Price+"\n"+
            "Current Stock: " + products[i].StockQuantity;
            console.log(productsResults + "\n");
        }
        userSelectID();
    }

    // Function to get the user selection
    var userSelectID = function(){
        prompt.start();
        console.log("Enter the ID of the product you would like to buy");

        prompt.get(schema, function (err, result) {
            if (err){
                console.log(err)
            }
            //console.log(result);
            var userChoiceID = parseInt(result.ID);
            var userChoiceHowMany = parseInt(result.howMany);
            // console.log("id=" + userChoiceID + " how many=" + userChoiceHowMany);

            // Function to check the inventory of an item
            var checkInventory = function(){
                connection.query('SELECT * FROM Products WHERE ItemID =' + userChoiceID, function(err, result) {
                    if (err) throw err;
                    //console.log(result);

                    var userWantsToBuy = userChoiceHowMany;
                    var productInventory = result[0].StockQuantity;
                    var productsPrice = result[0].Price;
                    var isInStock = productInventory - userWantsToBuy;
                    var totalCost= productsPrice * userWantsToBuy;

                    if (userWantsToBuy > productInventory || productInventory === 0){
                        console.log("Apologies but there isn't enough in stock to complete your order."+"\n"+"\n");
                        userSelectID();
                    } else {
                        console.log("\n\nThere are "+result[0].StockQuantity+" of "+result[0].ProductName);
                        console.log("You are purchasing "+ userWantsToBuy +" "+result[0].ProductName+" at $"+ result[0].Price+" per each.");
                        console.log("Your total: $"+totalCost+ "\n\n");
                        connection.query('UPDATE Products SET StockQuantity = '+isInStock+' WHERE ItemID ='+userChoiceID, function(err, result){
                        if (err) throw err;
                            connection.query('SELECT ItemID, ProductName, DepartmentName, Price, StockQuantity FROM products WHERE ItemID ='+userChoiceID, function(err, result){
                                //console.log(result);
                            }); 
                        });
                        prompt.get(schema2, function (err, result) {
                            if (err){
                                console.log(err)
                            }
                            console.log(result);
                            var userAnswer = result.AnotherPurchase;
                            if (userAnswer === "n" || userAnswer === "no"){
                                stopApp();
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

