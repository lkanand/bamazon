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
			confirmNewProduct();
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
			var table = new Table({
				head: ["Item ID", "Item Name", "Item Price", "Quantity"]
			});
			for(var i = 0; i < res.length; i++)
				table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
			console.log(table.toString());
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
			var table = new Table({
				head: ["Item ID", "Item Name", "Item Price", "Quantity"]
			});
			for(var i = 0; i < res.length; i++) {
				if(parseInt(res[i].stock_quantity) < lowQuantityLimit) {
					table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);	
				}
			}
			console.log(table.toString());
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
						var arrayOfChoices = [];
						for(var i = 0; i < res.length; i++) 
							arrayOfChoices.push(res[i].item_id + " (" + res[i].product_name + ")");
						arrayOfChoices.push("Abort");
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
		message: "How many units would you like to add? (Enter 'B' to return to menu)"
	}
	]).then(function(response){
		if(response.amountToIncrease === "B")
			selectAction();
		else if(!(/^\d+$/.test(response.amountToIncrease))) {
			console.log("Please enter a valid positive integer to represent an increase in units of your selected item");
			promptForQuantityToAdd(productId);
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

function confirmNewProduct(){
	inquirer.prompt([
	{
		type: "confirm",
		message: "Are you sure you want to add a new product?",
		name: "confirmAdd",
		default: true
	}
	]).then(function(response){
		if(response.confirmAdd === false)
			selectAction();
		else
			promptForProductName();
	});
}

function promptForProductName() {
	inquirer.prompt([
		{
			type: "input", 
			message: "What item would you like to add to the store's inventory? (Enter 'B' to go back to main menu)",
			name: "itemToAdd"
		}
	]).then(function(response){
		if(response.itemToAdd === "B")
			selectAction();
		else if(response.itemToAdd === "")
			promptForProductName();
		else {
			var query = connection.query(
				"SELECT * FROM products",
				function(err, res) {
					if(err)
						throw err;
					var arrayOfProducts = [];
					for(var i = 0; i < res.length; i++)
						arrayOfProducts.push(res[i].product_name.toLowerCase());
					if(arrayOfProducts.indexOf(response.itemToAdd.toLowerCase()) > -1) {
						console.log("The item you entered is already in the inventory");
						promptForProductName();
					}
					else
						getDepartment(response.itemToAdd);
				}
			);
		}
	});
}

function getDepartment(itemToAdd){
	var arrayOfDepartments = [];
	var query = connection.query(
		"SELECT * FROM departments",
		function(err, res) {
			if(err)
				throw err;
			for(var i = 0; i < res.length; i++)
				arrayOfDepartments.push(res[i].department_name);
			arrayOfDepartments.push("Other");
			arrayOfDepartments.push("B");
			inquirer.prompt([
				{
					type: "list",
					message: "What department does this item belong to? (Select 'B' to go back to main menu)",
					name: "department",
					choices: function() {
						return arrayOfDepartments;
					}
				}
			]).then(function(response){
				if(response.department === "B")
					selectAction();
				else if(response.department === "Other") {
					console.log("Please see your supervisor");
					selectAction();
				}
				else
					getPrice(itemToAdd, response.department);
			});
		}
	);
}

function getPrice(itemToAdd, department){
	inquirer.prompt([
		{
			type: "input",
			message: "What does one unit of this item cost? (Enter 'B' to go back to main menu)",
			name: "price"
		}
	]).then(function(response){
		if(response.price === "B")
			selectAction();
		else if(!(/^\d+\.\d+$/.test(response.price))) {
			console.log("Item price must be properly formatted (numbers before and after decimal) and non-negative");
			getPrice(itemToAdd, department);
		}
		else
			addNewProduct(itemToAdd, department, response.price);
	});
}
	
function addNewProduct(itemToAdd, department, price) {
	inquirer.prompt([
	{
		type: "input",
		message: "How many units of this item are you adding to the store's inventory? (Enter 'B' to go back to main menu)",
		name: "volume"
	}	
	]).then(function(response){
		if(response.volume === "B")
			selectAction();
		else if(!(/^\d+$/.test(response.volume))) {
			console.log("Units of added item must be an integer greater than zero");
			addNewProduct(itemToAdd, department, price);
		}
		else {
			if(parseInt(response.volume) > 0) {
				var query = connection.query(
					"INSERT INTO products SET ?",
					{
						product_name: itemToAdd,
						department_name: department,
						price: price,
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