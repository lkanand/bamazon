var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
});

connection.connect(function(err){
	if(err)
		throw err;
});

function promptCustomer() {
	var query = connection.query(
		"SELECT * from products",
		function(err, res) {
			if(err)
				throw err;

			console.log("Store Inventory");
			console.log("------------------------------");
			for(var i = 0; i < res.length; i++) {
				console.log("Item ID: " + res[i].item_id + " | " + "Item Name: " + res[i].product_name + 
					" | " + "Item Price: $" + res[i].price.toFixed(2));
			}
			console.log("------------------------------");

			inquirer.prompt([
				{
					type: "list",
					message: "What product would you like to buy?",
					name: "productToBuy",
					choices: function() {
						var arrayOfChoices = ["Exit Store"];
						for(var i = 0; i < res.length; i++) 
							arrayOfChoices.push(res[i].item_id + " (" + res[i].product_name + ")");
						return arrayOfChoices;
					}
				}
			]).then(function(response){
				if(response.productToBuy === "Exit Store") {
					console.log("Thank you for shopping with Bamazon! We hope to see you again soon!");
					connection.end();
				}
				else {
				var productId = response.productToBuy.split(" ")[0];
				promptForQuantity(productId);
				}
			});
		}
	);
}

function promptForQuantity(productId) {
	inquirer.prompt([
		{
			type: "input",
			name: "numberOfUnits",
			message: "How many units would you like to purchase?"
		}
	]).then(function(response){
		if(isNaN(parseInt(response.numberOfUnits)) || parseInt(response.numberOfUnits) < 0) {
			console.log("Please enter a valid number when asked for amount you would like to purchase.");
			promptForQuantity();
		}
		else
			validateOrder(productId, response.numberOfUnits);
	});
}

function validateOrder(productId, number) {
	var query = connection.query(
		"SELECT * FROM products WHERE ?",
		{
			item_id: productId
		},
		function(err, res) {
			if(err)
				throw err;

			if(parseInt(res[0].stock_quantity) < parseInt(number)) {
				console.log("Sorry, we have insufficient stock to fulfill this order");
				console.log("------------------------------");
				promptCustomer();
			}
			else {
				var purchaseCost = parseFloat(res[0].price) * parseInt(number);
				console.log("Your purchase cost you: $" + purchaseCost.toFixed(2));
				console.log("------------------------------");
				var updatedStock = parseInt(res[0].stock_quantity) - parseInt(number);
				updateTableForCustomerOrder(productId, updatedStock);
			}
		});
}

function updateTableForCustomerOrder(productId, updatedStock) {
	var query;
	if(updatedStock > 0) {
		query = connection.query(
			"UPDATE products SET ? WHERE ?",
			[
				{
					stock_quantity: updatedStock
				},
				{
					item_id: productId
				}
			],
			function(err, res) {
				if(err)
					throw err;
				promptCustomer();
			});
	}
	else {
		query = connection.query(
			"DELETE FROM products WHERE ?",
			{
				item_id: productId
			},
			function(err, res) {
				if(err)
					throw err;
				promptCustomer();
			});
	}
}

promptCustomer();
