DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(80) NOT NULL,
    department_name VARCHAR(80) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT(10) DEFAULT 0,
    product_sales DECIMAL(10, 2) DEFAULT 0.00,
    PRIMARY KEY (item_id)
    );
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MacBook Pro", "Technology", 1299.99, 50), ("Blue Jeans", "Clothing", 30.00, 40),
("Beats by Dre Headphones", "Technology", 500.00, 20), ("Air Jordans", "Footwear", 200.00, 100),
("Nike Football", "Sports & Outdoors", 25.00, 15), ("Rolex Watch", "Jewelry", 3500.00, 10),
("Fishing Pole", "Sports & Outdoors", 100.00, 20), ("Toilet Paper", "Toiletries", 2.00, 400),
("Dove Shampoo", "Toiletries", 10.00, 50), ("Banana", "Food", 0.99, 400);

CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(80) NOT NULL,
    over_head_costs DECIMAL(10, 2) DEFAULT 0.00,
    PRIMARY KEY (department_id)
    );
    
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Technology", 100.00), ("Clothing", 200.00), ("Footwear", 150.00), ("Sports & Outdoors", 150.00),
("Jewelry", 500.00), ("Toiletries", 50.00), ("Food", 20.00);