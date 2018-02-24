# bamazon

bamazon is a command line application that offers full functionality for tracking a store's inventory and aggregates information about products and profits into easy to read tables for managers and supervisors. bamazon consists of three JavaScript programs that offer interfaces for customers, managers and supervisors to interact with a MySQL database that stores the latest information regarding the store's supplies and sales.

## Using Bamazon

To use bamazon, download this repository to your computer and navigate to its folder using Terminal or Bash. Enter `npm install` in order to install the basic node modules as well as the `inquirer`, `mysql` and `cli-table` packages in your folder. After installing the npm packages required by bamazon, confirm that you have established a MySQL server on your computer. If not, install MAMP and MySQL to do so. Once you have established a MySQL server, open `bamazon.sql` in MySQL Workbench. Review the SQL script and modify the `products` and `departments` to match your store's inventory, overhead costs and classification system. Run `bamazon.sql` in MySQL Workbench to create the bamazon database on your MySQL server. After creating the bamazon database, open `bamazonCustomer.js`, `bamazonManager.js` and `bamazonSupervisor.js` and modify the `host`, `port`, `user` and `password` parameters used to initialize the `connection` variable. The information inputted in these parameters should refer to the MySQL server on your computer. After completing these steps, enter `node bamazonCustomer.js`, `bamazonManager.js` or `bamazonSupervisor.js` to begin using bamazon.

### Which Program Should I Use?

    * Use `bamazonCustomer.js` if:
        ** You would like to view the products for sale
        ** You would like to make a purchase
    
    * Use `bamazonManager.js` if:
        ** You would like to view the store's entire inventory
        ** You would like to see which products are running low
        ** You would like to add to a product's inventory
        ** You would like to add a new product to the store's inventory
    
    * Use 'bamazonSupervisor.js' if:
        ** You would like to add a new department to the store's product classification system
        ** You would like to view the store's revenue and profits by department

### bamazonCustomer.js

When `bamazonCustomer.js` runs, it displays the store's inventory and prompts the customer to place his / her order.

<p align = 'center'>
  <img src = '/bamazon_screenshots/bamazonCustomer/screenshot_one.png' width = '400'>
</p>

Once prompted, the customer can navigate to the item he / she wishes to purchase by using the `↑` and `↓` keys.

<p align = 'center'>
  <img src = '/bamazon_screenshots/bamazonCustomer/gif_one.gif' width = '500'>
</p>

If the customer decides not to place an order after viewing the inventory, he / she can select `Exit Store` when prompted to select an item to purchase.

After selecting an item, the customer will be asked for the number of units he / she wishes to purchase. If the customer's input exceeds the store's stock, the program will notify the customer and ask him / her to place another order shortly afterwards. As before, the customer can choose to exit the program when this occurs.

<p align = 'center'>
  <img src = '/bamazon_screenshots/bamazonCustomer/gif_two.gif' width = '400'>
</p>

However, if the store can fulfill the customer's order, the program will notify the customer of the order price and then re-direct him / her to the opening display. At this point, the customer can either exit the program or place another order.

<p align = 'center'>
  <img src = '/bamazon_screenshots/bamazonCustomer/gif_three.gif' width = '400'>
</p>

### bamazonManager.js

When `bamazonManager.js` runs, it displays a menu screen that prompts the store's manager to select one of five options:

    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product
    * Exit

The manager can navigate to one of these options using the `↑` and `↓` keys.

#### View Products for Sale

If the manager selects this option from the menu, then the program will display a table of the store's entire inventory. For each product in stock, the table will include the product's id, its name, its price and the number of units in stock. After displaying this table, the program will prompt the manager to choose another option.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/gif_one.gif' width = '400'>
</p>

#### View Low Inventory

If the manager wishes to view which products appear in the store's inventory fewer than five times, he / she can select `View Low Inventory`. The program will return a table listing the id, name, price and quantity for every product the store is running low on. Once again, the program will prompt the manager to choose another option after displaying this table.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/gif_two.gif' width = '400'>
</p>

#### Add to Inventory

If the store receives a shipment of an existing item, the manager can select this option to update the inventory. The program will then ask the manager for the product name and the amount to add. If at any point in this process the manager realizes that he / she has made a mistake, he / she can navigate back to the menu by selecting `Abort` or entering `B`.  After successfully adding inventory, the program will direct the manager back to the menu screen.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/gif_three.gif' width = '400'>
</p>

#### Add New Product

If the store receives a product that is not already included in the inventory table, the manager should select this option. The program will confirm that the manager does in fact want to add a new product to the inventory and then ask a series of questions about the product (name, department, price, quantity). As with `Add to Inventory`, the manager will be able to navigate back to the menu if he / she realizes that a mistake has been made.

In the example below, the manager adds four cats costing $200.00 to the store's inventory.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/gif_four.gif' width = '400'>
</p>

The program updates the inventory and low inventory tables accordingly:

##### Inventory Table

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/screenshot_one.png' width = '400'>
</p>

##### Low Inventory Table

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/screenshot_two.png' width = '400'>
</p>

Please note that if the proper classification for the new product is not included in the list of choices given by the department prompt, managers will be expected to select `Other`. Upon doing so, the program will ask the manager to see the supervisor and navigate back to the menu. The supervisor will need to run `bamazonSupervisor.js` (more information below) and add the new department to the inventory database before the manager can proceed.

In the example below, the manager wants to add two Ferraris to the inventory. Unfortunately, the inventory database does not include a department for automobiles:

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonManager/gif_five.gif' width = '400'>
</p>

#### Exit

The manager can select this option to exit out of the program.

### bamazonSupervisor.js
When `bamazonSupervisor.js` runs, it displays a menu screen that prompts the store's supervisor to select one of three options:

    * View Product Sales by Department
    * Create New Department
    * Exit

The supervisor can navigate to one of these options using the `↑` and `↓` keys.

#### View Product Sales by Department

If the supervisor wishes to view up-to-date information about the revenue and profit generated by each of the store's departments, he / she can select `View Product Sales by Department`. The program will display a table containing department ids, names, sales, overhead costs and profits.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonSupervisor/screenshot_one.png' width = '400'>
</p>

#### Create New Department

If the supervisor wants to create a new department, he / she can select `View Product Sales by Department`. After confirming that the supervisor does indeed want to create a new department, the program will prompt the supervisor for the name of the department and its overhead costs. If at any point the supervisor realizes that a mistake has been made, he / she can enter "B" to navigate back to the menu.

In the example below, the supervisor adds an "Automobiles" department. Since no automobile purchases have been made, the product sales table will show that the department has generated $0 of sales.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonSupervisor/gif_one.gif' width = '400'>
</p>

When sales of products classified as Automobiles are made, the Product Sales by Department table will automatically update. In this example, a customer has purchased one Ferrari for $250,000.

<p align = 'center'>
    <img src = '/bamazon_screenshots/bamazonSupervisor/screenshot_two.png' width = '400'>
</p>

#### Exit

The supervisor can select this option to exit out of the program.
