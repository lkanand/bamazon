var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

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
		var table = new Table({
			head: ["Item ID", "Item Name", "Item Price"]
		});	
			for(var i = 0; i < res.length; i++)
				table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2)]);
			console.log(table.toString());

			inquirer.prompt([
				{
					type: "list",
					message: "What product would you like to buy?",
					name: "productToBuy",
					choices: function() {
						var arrayOfChoices = [];
						for(var i = 0; i < res.length; i++) 
							arrayOfChoices.push(res[i].item_id + " (" + res[i].product_name + ")");
						arrayOfChoices.push("Exit Store");
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
			message: "How many units would you like to purchase? (Enter 'B' to return to inventory)"
		}
	]).then(function(response){
		if(response.numberOfUnits === "B")
			promptCustomer();
		else if(!(/^\d+$/.test(response.numberOfUnits))) {
			console.log("Please enter a valid positive integer when asked for amount you would like to purchase.");
			promptForQuantity(productId);
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
				setTimeout(function(){
					promptCustomer()}, 4000);
			}
			else {
				var purchaseCost = parseFloat(res[0].price) * parseInt(number);
				console.log("Your purchase cost you: $" + purchaseCost.toFixed(2));
				var updatedStock = parseInt(res[0].stock_quantity) - parseInt(number);
				var updatedSales = parseFloat(res[0].product_sales) + purchaseCost;
				updateStockForCustomerOrder(productId, updatedStock);
				setTimeout(function(){
					updateSalesForCustomerOrder(productId, updatedSales)}, 4000);
			}
		});
}

function updateStockForCustomerOrder(productId, updatedStock) {
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
			});
	}
}

function updateSalesForCustomerOrder(productId, updatedSales) {
	var query;
	if(updatedSales > 0) {
		query = connection.query(
			"UPDATE products SET ? WHERE ?",
			[
				{
					product_sales: updatedSales
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
	else
		promptCustomer();
}

promptCustomer();
