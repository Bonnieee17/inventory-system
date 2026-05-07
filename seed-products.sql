-- Sample Products for Inventory System
-- Run this in Supabase SQL Editor after running schema.sql

-- First, get the admin user ID (replace with your actual admin ID from users table)
-- You can find it by running: SELECT id FROM users WHERE email = 'admin@inventory.com'

-- Insert sample products
-- NOTE: Replace 'YOUR_USER_ID_HERE' with an actual user ID from the users table

-- Electronics
INSERT INTO products (name, description, price, quantity, category, created_by) VALUES
('Samsung Galaxy S24 Ultra', 'Flagship smartphone with advanced camera system', 1299.99, 45, 'Electronics', 'YOUR_USER_ID_HERE'),
('iPhone 15 Pro Max', 'Premium Apple smartphone with A17 Pro chip', 1199.99, 32, 'Electronics', 'YOUR_USER_ID_HERE'),
('MacBook Pro 16"', 'High-performance laptop with M3 Max processor', 3499.99, 12, 'Electronics', 'YOUR_USER_ID_HERE'),
('iPad Air 2024', 'Versatile tablet with M2 processor', 799.99, 28, 'Electronics', 'YOUR_USER_ID_HERE'),
('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 399.99, 67, 'Electronics', 'YOUR_USER_ID_HERE');

-- Home & Garden
INSERT INTO products (name, description, price, quantity, category, created_by) VALUES
('Smart Home Hub', 'Central control for smart devices', 149.99, 18, 'Home & Garden', 'YOUR_USER_ID_HERE'),
('Robot Vacuum Cleaner', 'Autonomous vacuum with app control', 599.99, 8, 'Home & Garden', 'YOUR_USER_ID_HERE'),
('Smart Thermostat', 'Energy-efficient temperature control', 249.99, 25, 'Home & Garden', 'YOUR_USER_ID_HERE'),
('LED Smart Bulbs (4-pack)', 'Color-changing WiFi bulbs', 89.99, 156, 'Home & Garden', 'YOUR_USER_ID_HERE'),
('Outdoor Security Camera', 'Weather-resistant camera with night vision', 299.99, 14, 'Home & Garden', 'YOUR_USER_ID_HERE');

-- Office Supplies
INSERT INTO products (name, description, price, quantity, category, created_by) VALUES
('Ergonomic Office Chair', 'High-back chair with lumbar support', 449.99, 9, 'Office Supplies', 'YOUR_USER_ID_HERE'),
('Standing Desk Converter', 'Adjustable height desk converter', 299.99, 16, 'Office Supplies', 'YOUR_USER_ID_HERE'),
('Wireless Keyboard & Mouse', 'Combo set with USB receiver', 79.99, 94, 'Office Supplies', 'YOUR_USER_ID_HERE'),
('USB-C Hub Multi-port', '7-in-1 docking station', 129.99, 43, 'Office Supplies', 'YOUR_USER_ID_HERE'),
('Monitor Light Bar', 'Screen light for reduced eye strain', 179.99, 22, 'Office Supplies', 'YOUR_USER_ID_HERE');

-- Fashion
INSERT INTO products (name, description, price, quantity, category, created_by) VALUES
('Designer Messenger Bag', 'Premium leather messenger bag', 199.99, 11, 'Fashion', 'YOUR_USER_ID_HERE'),
('Stainless Steel Watch', 'Classic automatic watch', 299.99, 19, 'Fashion', 'YOUR_USER_ID_HERE'),
('Wireless Earbuds Case', 'Premium protective charging case', 49.99, 213, 'Fashion', 'YOUR_USER_ID_HERE'),
('Laptop Backpack Pro', 'Travel-friendly backpack with USB port', 149.99, 34, 'Fashion', 'YOUR_USER_ID_HERE'),
('Screen Protector (10-pack)', 'Tempered glass for smartphones', 29.99, 456, 'Fashion', 'YOUR_USER_ID_HERE');

-- Sports & Outdoors
INSERT INTO products (name, description, price, quantity, category, created_by) VALUES
('Portable Bluetooth Speaker', 'Waterproof outdoor speaker', 149.99, 56, 'Sports & Outdoors', 'YOUR_USER_ID_HERE'),
('Fitness Tracker Watch', 'Multi-sport tracking smartwatch', 199.99, 38, 'Sports & Outdoors', 'YOUR_USER_ID_HERE'),
('Yoga Mat Premium', 'Non-slip exercise mat', 69.99, 127, 'Sports & Outdoors', 'YOUR_USER_ID_HERE'),
('Camping Tent 4-person', 'Waterproof camping tent', 349.99, 7, 'Sports & Outdoors', 'YOUR_USER_ID_HERE'),
('Water Bottle Smart', 'Temperature-tracking water bottle', 89.99, 82, 'Sports & Outdoors', 'YOUR_USER_ID_HERE');
