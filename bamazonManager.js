var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
});

var lowQuantityLimit = 5;

connection.connect(function(err){
	if(err)
		throw err;
})

function selectAction() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			name: "selectedAction",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
		}
	]).then(function(response){
		if(response.selectedAction === "View Products for Sale")
			viewProducts();
		else if(response.selectedAction === "View Low Inventory")
			viewLowInventory();
		else if(response.selectedAction === "Add to Inventory")
			addToInventory();
		else if(response.selectedAction === "Add New Product")
			addNewProduct();
		else {
			console.log("Thank you for keeping Bamazon's inventory up to date. Your hard work does not go unnoticed.");
			connection.end();
		}
	});
}

function viewProducts() {
	var query = connection.query(
		"SELECT * FROM products",
		function(err, res) {
			if(err)
				console.log(err);

			console.log("Store Inventory");
			console.log("------------------------------");
			for(var i = 0; i < res.length; i++) {
				console.log("Item ID: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Item Price: $" + 
					res[i].price.toFixed(2) + " | Quantity: " + res[i].stock_quantity);
			}
			console.log("------------------------------");
			selectAction();
		}
	);
}

function viewLowInventory() {
	var query = connection.query(
		"SELECT * FROM products",
		function(err, res) {
			if(err)
				console.log(err);

			console.log("Low Inventory");
			console.log("------------------------------");
			for(var i = 0; i < res.length; i++) {
				if(parseInt(res[i].stock_quantity) < lowQuantityLimit) {
					console.log("Item ID: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Item Price: $" + 
						res[i].price.toFixed(2) + " | Quantity: " + res[i].stock_quantity);
				}
			}
			console.log("------------------------------");
			selectAction();
		}
	);
}

function addToInventory() {
	var query = connection.query(
		"SELECT * FROM products",
		function(err, res) {
			if(err)
				throw err;

			inquirer.prompt([
				{
					type: "list",
					message: "Which item would you like to add to?",
					name: "itemToIncrease",
					choices: function() {
						var arrayOfChoices = ["Abort"];
						for(var i = 0; i < res.length; i++) 
							arrayOfChoices.push(res[i].item_id + " (" + res[i].product_name + ")");
						return arrayOfChoices;
					}
				}
			]).then(function(response){
				if(response.itemToIncrease === "Abort")
					selectAction();
				else {
					var productId = response.itemToIncrease.split(" ")[0];
					promptForQuantityToAdd(productId);
				}
			});
		}
	);
}

function promptForQuantityToAdd(productId) {
	inquirer.prompt([
	{
		type: "input",
		name: "amountToIncrease",
		message: "How many units would you like to add?"
	}
	]).then(function(response){
		if(isNaN(parseInt(response.amountToIncrease)) || parseInt(response.amountToIncrease) < 0) {
			console.log("Please enter a valid number to represent an increase in units of your selected item");
			promptForQuantityToAdd();
		}
		else {
			var query = connection.query(
				"SELECT * FROM products WHERE ?",
				{
					item_id: productId 
				},
				function(err, res) {
					if(err)
						throw err;
					var newQuantity = parseInt(res[0].stock_quantity) + parseInt(response.amountToIncrease);
					updateForNewQuantity(productId, newQuantity);
				}
			);
		}
	});
}

function updateForNewQuantity(productId, newQuantity) {
	var query = connection.query(
		"UPDATE products SET ? WHERE ?",
		[
			{
				stock_quantity: newQuantity
			},
			{
				item_id: productId
			}
		],
		function(err, res) {
			if(err)
				throw err;
			selectAction();
		}
	);
}

function addNewProduct(){
	inquirer.prompt([
	{
		type: "input",
		message: "What item would you like to add to the store's inventory?",
		name: "itemToAdd"
	},
	{
		type: "input",
		message: "What department does this item belong to?",
		name: "department"
	},
	{
		type: "input",
		message: "What does one unit of this item cost?",
		name: "price"
	},
	{
		type: "input",
		message: "How many units of this item are you adding to the store's inventory?",
		name: "volume"
	}	
	]).then(function(response){
		if(response.itemToAdd === "" || response.department === "") {
			console.log("Please fill out all fields");
			addNewProduct();
		}
		else if(isNaN(parseFloat(response.price)) || parseFloat(response.price) < 0) {
			console.log("Item price must be a number greater than zero");
			addNewProduct();
		}
		else if(isNaN(parseInt(response.volume)) || parseInt(response.volume) < 0) {
			console.log("Units of added item must be a number greater than zero");
			addNewProduct();
		}
		else {
			if(parseInt(response.volume) > 0) {
				var query = connection.query(
					"INSERT INTO products SET ?",
					{
						product_name: response.itemToAdd,
						department_name: response.department,
						price: response.price,
						stock_quantity: response.volume
					},
					function(err, res) {
						if(err)
							throw err;
						selectAction();
					}
				);
			}
		}
	});
}

selectAction();