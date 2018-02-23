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

function selectAction() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			name: "selectedAction",
			choices: ["View Product Sales by Department", "Create New Department", "Exit"]
		}
	]).then(function(response){
		if(response.selectedAction === "View Product Sales by Department")
			dropSalesByDepartmentTable();
		else if(response.selectedAction === "Create New Department")
			confirmCreateNewDepartment();
		else {
			console.log("Until next time, boss.");
			connection.end();
		}
	});
}

function confirmCreateNewDepartment(){
	inquirer.prompt([
		{
			type: "confirm",
			message: "Are you sure you want to create a new department?",
			name: "confirmNewDepartment",
			default: true
		}
	]).then(function(response){
		if(response.confirmNewDepartment === false)
			selectAction();
		else
			promptUserForDepartment();
	});
}

function promptUserForDepartment() {
	inquirer.prompt([
		{
			type: "input",
			message: "What is the name of the new department? (Enter 'B' to go back to menu)",
			name: "newDepartment"
		}
	]).then(function(response){
		var query = connection.query(
			"SELECT * FROM departments",
			function(err, res) {
				if(err)
					throw err;
				if(response.newDepartment === "B")
					selectAction();
				else {
					var arrayOfDepartments = [];
					for(var i = 0; i < res.length; i++)
						arrayOfDepartments.push(res[i].department_name.toLowerCase());
					if(arrayOfDepartments.indexOf(response.newDepartment.toLowerCase()) > -1) {
						console.log("That department already exists.")
						confirmCreateNewDepartment();
					}
					else if(response.newDepartment === "" || response.newDepartment.toLowerCase() === "other") {
						console.log("Department must have a name that is not 'Other'");
						promptUserForDepartment();
					}
					else
						promptUserForDepartmentOverhead(response.newDepartment);
				}
			}
		);
	});
}

function promptUserForDepartmentOverhead(newDepartment) {
	inquirer.prompt([
		{
			type: "input",
			message: "What is this department's overhead? (Enter 'B' to go back to menu)",
			name: "departmentOverhead"
		}
	]).then(function(response){
		if(response.departmentOverhead === "B")
			selectAction();
		else if(!(/^\d+\.\d+$/.test(response.departmentOverhead))) {
			console.log("Please enter a valid department overhead cost (numbers before and after decimal)");
			promptUserForDepartmentOverhead(newDepartment);
		}
		else
			insertNewDepartment(newDepartment, response.departmentOverhead);
	});
}

function insertNewDepartment(newDepartment, departmentOverhead) {
	var query = connection.query(
		"INSERT INTO departments SET ?", 
		{
			department_name: newDepartment,
			over_head_costs: departmentOverhead
		},
		function(err, res) {
			if(err)
				throw err;
			selectAction();
		}
	);
}

function dropSalesByDepartmentTable() {
	var myQuery = "DROP TABLE IF EXISTS total_sales_by_dept;"
	var query = connection.query(
		myQuery,
		function(err, res) {
			if(err)
				throw err;
			getSalesByDepartment();
		}
	);
}

function getSalesByDepartment() {
	var myQuery = "CREATE TABLE total_sales_by_dept " + 
				"SELECT SUM(product_sales) as total_sales, department_name " + 
				"FROM products " +
				"GROUP BY department_name";
	var query = connection.query(
		myQuery,
		function(err, res) {
			if(err)
				throw err;
			createSalesTable();
		}
	);
}

function createSalesTable() {
	var myQuery = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, total_sales_by_dept.total_sales " +
					"FROM departments " +
					"LEFT JOIN total_sales_by_dept on departments.department_name = total_sales_by_dept.department_name " + 
					"ORDER BY departments.department_id ASC";
	var query = connection.query(
		myQuery,
		function(err, res) {
			if(err)
				throw err;
			var table = new Table({
				head: ["Dept. ID", "Dept. Name", "Sales", "Overhead", "Profit"]
			});
			for(var i = 0; i < res.length; i++) {
				if(res[i].total_sales === null)
					res[i].total_sales = 0.00;
				var profit = parseFloat(res[i].total_sales) - parseFloat(res[i].over_head_costs);
				if(profit < 0)
					profit = "($" + profit.toFixed(2).substr(1, profit.toFixed(2).length - 1) + ")";
				else
					profit = "$" + profit.toFixed(2);
				table.push([res[i].department_id, res[i].department_name, "$" + res[i].total_sales.toFixed(2), "$" + res[i].over_head_costs.toFixed(2), profit]);
			}
			console.log(table.toString());
			selectAction();
		}
	);
}

selectAction();