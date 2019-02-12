CREATE DATABASE bamazon;
DROP DATABASE IF EXISTS bamazon;

USE bamazon;
CREATE TABLE Products (

ItemID int AUTO_INCREMENT,
ProductName varchar(50) NOT NULL,
DepartmentName varchar(50) NOT NULL,
Price varchar(30) NOT NULL,
StockQuantity int NOT NULL,
PRIMARY KEY(ItemID)
);

select * from Products;