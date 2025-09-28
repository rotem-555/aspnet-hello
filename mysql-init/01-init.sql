-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ECommerceDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ECommerceDB;

-- Create users table
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    Email VARCHAR(100),
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    INDEX IX_Users_Username (Username),
    INDEX IX_Users_Email (Email)
);

-- Create products table
CREATE TABLE IF NOT EXISTS Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL,
    Category VARCHAR(50),
    ImageUrl VARCHAR(500),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    INDEX IX_Products_Name (Name),
    INDEX IX_Products_Category (Category)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    ShippingAddress VARCHAR(200),
    CustomerName VARCHAR(100),
    CustomerPhone VARCHAR(20),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT,
    INDEX IX_Orders_UserId (UserId)
);

-- Create order items table
CREATE TABLE IF NOT EXISTS OrderItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE RESTRICT,
    INDEX IX_OrderItems_OrderId (OrderId),
    INDEX IX_OrderItems_ProductId (ProductId)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO Users (Username, PasswordHash, Role, Email, FirstName, LastName) VALUES
('admin', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'admin@example.com', 'Admin', 'User');

-- Insert sample products
INSERT IGNORE INTO Products (Name, Description, Price, Stock, Category, ImageUrl, IsActive) VALUES
('Laptop', 'High-performance laptop for work and gaming', 999.99, 50, 'Electronics', '/images/laptop.jpg', TRUE),
('Smartphone', 'Latest smartphone with advanced features', 699.99, 100, 'Electronics', '/images/smartphone.jpg', TRUE),
('Coffee Maker', 'Automatic coffee maker for perfect brew', 149.99, 25, 'Appliances', '/images/coffee-maker.jpg', TRUE),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 75, 'Electronics', '/images/headphones.jpg', TRUE),
('Office Chair', 'Ergonomic office chair for comfort', 299.99, 30, 'Furniture', '/images/chair.jpg', TRUE),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 60, 'Furniture', '/images/lamp.jpg', TRUE);

