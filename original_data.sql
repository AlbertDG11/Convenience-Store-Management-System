-- Assign Databse
-- Example
USE conveniencestoredb;

-- Insert Statements
-- Membership & MemberAddress 
INSERT INTO `membership` (`membership_id`,`name`,`phone_number`,`email`) VALUES
  (1,'Alice','123-456-7890','alice@example.com'),
  (2,'Bob','234-567-8901','bob@example.com'),
  (3,'Carol','345-678-9012','carol@example.com'),
  (4,'Dave','456-789-0123','dave@example.com'),
  (5,'Eve','567-890-1234','eve@example.com');

INSERT INTO `member_address` (`id`,`Membership_id`,`city`,`province`,`street_address`,`postal_code`) VALUES
  (1,1,'Toronto','Ontario','123 Maple St','M1M1M1'),
  (2,2,'Vancouver','British Columbia','456 Oak St','V2V2V2'),
  (3,3,'Montreal','Quebec','789 Pine St','H3H3H3'),
  (4,4,'Calgary','Alberta','1010 Cedar Rd','T4T4T4'),
  (5,5,'Edmonton','Alberta','1111 Spruce Ave','T5T5T5'),
  (6,3,'Hamilton','Ontario','2222 Birch Blvd','L8L8L8');

-- Employee hierarchy, addresses & roles 
INSERT INTO `employee` (`employee_id`,`name`,`email`,`phone_number`,`salary`,`login_password`,`role`,`Supervisor_id`) VALUES
(1,'Frank','frank@corp.com','111-111-1111',80000.00,'2d2f5cad1189ae270dce596a623f9160b688225a7aa7c19d9f624924a8750d76',2,NULL),  (2,'Grace','grace@corp.com','222-222-2222',60000.00,'48218a8715a9a93419ce23a5f5cc516123485e16854227d3a51b175090bcca6d',0,1),
(3,'Heidi','heidi@corp.com','333-333-3333',55000.00,'c9ca2cdd3113ad881406db3fe4192873436cbc6c7c15e20226dbbd5329796d4e',0,1),
(4,'Ivan','ivan@corp.com','444-444-4444',50000.00,'9d7afda0bb765da2cf511f3d7e6c6fe978f9994669624d0be7df0f72ad308539',1,2),
(5,'Judy','judy@corp.com','555-555-5555',52000.00,'ba9e908a690690ea900ad7ed427967f265fb0fb3ebbe1286fc613ea5c9ee82a3',1,3),  (6,'Karl','karl@corp.com','666-666-6666',90000.00,'ac54d5ee6b7ca4ec70425afa32b9dcf0959f3d2192341dd9728922064dd5f0c8',2,NULL);

-- employee addresses
INSERT INTO `employee_address` (`id`,`Employee_id`,`province`,`city`,`street_address`,`post_code`) VALUES
  (1,1,'Ontario','Ottawa','12 Queen St','K1A0A1'),
  (2,2,'Ontario','Toronto','34 King St','M5H2N2'),
  (3,3,'Quebec','Montreal','56 St Laurent','H2Y1Z3'),
  (4,4,'Alberta','Calgary','78 5th Ave','T2P3G4'),
  (5,5,'British Columbia','Vancouver','90 West St','V6B2K5'),
  (6,6,'Ontario','Hamilton','22 Main St','L8P1A1');

-- roles: salesperson, manager, purchase_person
INSERT INTO `salesperson`   (`Employee_id`,`sales_target`)      VALUES (1,NULL),(2,150000.00),(3,120000.00),(4,NULL),(5,NULL);
INSERT INTO `manager`       (`Employee_id`,`management_level`) VALUES (1,'Senior'),(6,'Junior');
INSERT INTO `purchase_person` (`Employee_id`,`purchase_section`) VALUES (4,'Electronics'),(5,'Groceries');

-- Supplier & SupplierAddress 
INSERT INTO `supplier` (`supplier_id`,`supplier_name`,`supplier_status`,`contact_name`,`contact_email`,`phone_number`) VALUES
  (1,'SupplyCo','Active','Eve Adams','eve@supplyco.com','777-777-7777'),
  (2,'TechSupply','Active','Oscar Lee','oscar@techsupply.com','888-888-8888'),
  (3,'FoodDist','Pending','Mia Wong','mia@fooddist.com','999-999-9999');

INSERT INTO `supplier_address` (`id`,`Supplier_id`,`city`,`province`,`street_address`,`postal_code`) VALUES
  (1,1,'Vancouver','British Columbia','456 Birch St','V1V1V1'),
  (2,2,'Toronto','Ontario','123 Tech Blvd','M5J2N8'),
  (3,3,'Montreal','Quebec','789 Market St','H3B1A2');

-- Product catalogue & Inventory 
INSERT INTO `product` (`product_id`,`name`,`type`,`discount`,`price`,`price_after_discount`) VALUES
  (2001,'Bread','Food',0.10,3.00,2.70),
  (2002,'Milk','Food',0.05,4.00,3.80),
  (2003,'Cheese','Food',0.15,5.00,4.25),
  (2004,'Yogurt','Food',0.00,2.50,2.50),
  (2005,'Soap','NonFood',0.00,2.00,2.00),
  (2006,'Shampoo','NonFood',0.10,6.00,5.40),
  (2007,'Detergent','NonFood',0.20,8.00,6.40),
  (2008,'Tissue','NonFood',0.00,1.50,1.50);

INSERT INTO `food_product`     (`Product_id`,`expiration_date`,`storage_condition`,`food_type`) VALUES
  (2001,'2025-05-01','Room Temperature','Bakery'),
  (2002,'2025-04-30','Refrigerated','Dairy'),
  (2003,'2025-06-10','Refrigerated','Dairy'),
  (2004,'2025-05-15','Refrigerated','Dairy');

INSERT INTO `non_food_product` (`Product_id`,`brand`,`warranty_period`) VALUES
  (2005,'CleanCo','N/A'),
  (2006,'HairCare','2 years'),
  (2007,'HomeCare','1 year'),
  (2008,'SoftTissue','N/A');

INSERT INTO `inventory` (`id`,`Product_id`,`inventory_id`,`status`,`location`,`quantity`) VALUES
  (1,2001,1,'In Stock','Warehouse A','100'),
  (2,2002,1,'In Stock','Warehouse A','200'),
  (3,2003,1,'Low Stock','Warehouse B','50'),
  (4,2004,1,'In Stock','Warehouse B','150'),
  (5,2005,1,'In Stock','Warehouse C','300'),
  (6,2006,1,'In Stock','Warehouse C','120'),
  (7,2007,1,'Out of Stock','Warehouse A','0'),
  (8,2008,1,'In Stock','Warehouse B','500');

-- InventoryPurchase & PurchaseItem
-- purchases
INSERT INTO `inventory_purchase` (`purchase_id`,`purchase_time`,`total_cost`,`Supplier_id`,`Employee_id`) VALUES
  (1,'2025-04-20 09:00:00',  600.00,1,4),
  (2,'2025-04-20 14:30:00', 1200.00,2,5),
  (3,'2025-04-21 11:15:00',  800.00,3,5),
  (4,'2025-03-05 10:15:00', 450.00,1,4),
  (5,'2025-03-20 14:45:00', 980.00,2,5),
  (6,'2025-04-10 09:30:00',1250.00,3,4),
  (7,'2025-04-15 16:00:00', 670.00,1,5),
  (8,'2025-04-22 08:20:00', 540.00,2,4);

INSERT INTO `purchase_item` (`id`,`Purchase_id`,`item_id`,`Product_id`,`quantity_purchased`) VALUES
  (1,1,1,2001,50),(2,1,2,2002,100),
  (3,2,1,2005,200),(4,2,2,2006,150),
  (5,3,1,2003,80),(6,3,2,2004,120),
  (7,4,1,2005,150),(8,4,2,2008,200),
  (9,5,1,2002,300),(10,5,2,2003,180),
  (11,6,1,2001,60),(12,6,2,2007,80),
  (13,7,1,2006,120),(14,7,2,2004,140),
  (15,8,1,2001,30),(16,8,2,2005,100);

-- Orders & OrderItem 
-- Orders
INSERT INTO `orders` (`order_id`,`create_time`,`delivery_address`,`payment_method`,`order_status`,`customer_notes`,`total_price`,`Member_id`,`Employee_id`) VALUES
  (1, '2025-04-21 12:00:00','789 Elm St',      'Credit Card','Delivered',  'Leave at door',       15.20,1,2),
  (2, '2025-04-21 15:30:00','1010 Pine Rd',    'Cash',       'Pending',    NULL,  22.50,2,2),
  (3, '2025-04-22 09:45:00','222 Maple Ave',   'Debit Card','Shipped',     'Ring bell twice',     30.00,3,3),
  (4, '2025-04-22 13:20:00','333 Oak Blvd',    'Credit Card','Processing',  'Deliver after 5pm',   18.75,4,3),
  (5, '2025-04-22 16:10:00','444 Birch Ln',    'Cash',       'Cancelled',  NULL,   12.00,5,2),
  (6, '2025-04-22 18:00:00','555 Cedar St',    'Debit Card','Pending',     'Call on arrival',     9.60, 1,4),
  (7, '2025-04-22 18:30:00','666 Oak St',      'Credit Card','Shipped',     NULL,  7.40, 2,5),
  (8, '2025-04-22 19:00:00','777 Pine St',     'Cash',       'Delivered',  'Fragile',  16.60,2,4),
  (9, '2025-04-22 19:30:00','888 Spruce Ln',   'Debit Card','Processing',  NULL,  9.25, 3,5),
  (10,'2025-04-22 20:00:00','999 Cedar Ave',   'Credit Card','Pending',     'Deliver before 8pm',  14.40,4,2),
  (11,'2025-04-22 20:30:00','101 Maple Rd',    'Cash',       'Shipped',     NULL,  12.90,5,3),
  (12,'2025-04-22 21:00:00','202 Oak St',      'Credit Card','Delivered',  'Signature required',  15.40,1,4),
  (13,'2025-04-22 21:30:00','303 Birch Blvd',  'Debit Card','Processing', 'Please ring twice',   14.90,2,5),
  (14,'2025-04-22 22:00:00','404 Pine Blvd',   'Cash',       'Pending',     NULL,  17.50,3,2),
  (15,'2025-04-22 22:30:00','505 Maple Ave',   'Credit Card','Cancelled',  'Customer cancelled',   6.70,4,1),
  (16,'2025-04-22 23:00:00','606 Elm St',      'Debit Card','Shipped',     NULL,   11.85,5,4),
  (17,'2025-04-22 23:15:00','707 Oak Rd',      'Cash',       'Delivered',  'Leave at front desk', 15.40,1,5),
  (18,'2025-04-22 23:30:00','808 Birch Rd',    'Credit Card','Processing',  NULL,                  26.70,2,4),
  (19,'2025-04-22 23:45:00','909 Spruce St',   'Debit Card','Pending',     NULL, 16.80,3,5),
  (20,'2025-04-22 23:55:00','1001 Cedar Ln',   'Cash',       'Delivered',  'Thank you',           28.85,4,1),
  (21,'2025-03-01 11:00:00','121 Apple St',     'Credit Card','Delivered','Ring once',        10.50,1,2),
  (22,'2025-03-10 13:30:00','232 Berry Ave',    'Cash',       'Shipped',  NULL,            12.75,2,3),
  (23,'2025-03-15 09:20:00','343 Cherry Blvd',  'Debit Card','Processing','Leave at back',    20.40,3,4),
  (24,'2025-03-20 17:45:00','454 Date Rd',      'Credit Card','Pending',   NULL,             8.90, 4,2),
  (25,'2025-03-25 08:15:00','565 Elder Ln',     'Cash',       'Cancelled','Customer no show',16.30,5,1),
  (26,'2025-04-01 12:10:00','676 Fig St',       'Credit Card','Delivered','Gate open',       22.10,1,2),
  (27,'2025-04-05 14:55:00','787 Grape Ave',    'Debit Card','Shipped',  NULL,            19.00,2,3),
  (28,'2025-04-10 16:40:00','898 Honey Rd',     'Cash',       'Processing','Call ahead',      12.25,3,4),
  (29,'2025-04-15 10:05:00','909 Indigo Blvd',  'Credit Card','Pending',   NULL,            18.50,4,5),
  (30,'2025-04-20 19:30:00','101 Jackfruit Dr','Debit Card','Delivered','Beware dog',       25.60,5,4)

INSERT INTO `order_item` (`id`,`Order_id`,`item_id`,`Product_id`,`quantity_ordered`) VALUES
  (1,1,1,2001,2),  (2,1,2,2005,3),
  (3,2,1,2002,5),  (4,2,2,2008,2),
  (5,3,1,2003,4),  (6,3,2,2006,1),
  (7,4,1,2004,3),  (8,4,2,2007,1),
  (9,5,1,2005,2),  (10,5,2,2008,4),
  (11,6,1,2001,3), (12,6,2,2008,1),
  (13,7,1,2006,1), (14,7,2,2005,1),
  (15,8,1,2007,2), (16,8,2,2002,1),
  (17,9,1,2003,1), (18,9,2,2004,2),
  (19,10,1,2002,3),(20,10,2,2008,2),
  (21,11,1,2001,2),(22,11,2,2004,3),
  (23,12,1,2005,5),(24,12,2,2006,1),
  (25,13,1,2003,2),(26,13,2,2007,1),
  (27,14,1,2008,10),(28,14,2,2004,1),
  (29,15,1,2001,1),(30,15,2,2005,2),
  (31,16,1,2002,2),(32,16,2,2003,1),
  (33,17,1,2004,4),(34,17,2,2006,1),
  (35,18,1,2007,3),(36,18,2,2008,5),
  (37,19,1,2001,4),(38,19,2,2005,3),
  (39,20,1,2003,5),(40,20,2,2002,2),
  (41,21,1,2001,2),(42,21,2,2002,1),
  (43,22,1,2003,3),(44,22,2,2005,2),
  (45,23,1,2006,1),(46,23,2,2007,2),
  (47,24,1,2008,4),(48,24,2,2004,1),
  (49,25,1,2002,2),(50,25,2,2001,3),
  (51,26,1,2005,5),(52,26,2,2006,1),
  (53,27,1,2007,2),(54,27,2,2008,1),
  (55,28,1,2003,1),(56,28,2,2004,2),
  (57,29,1,2001,4),(58,29,2,2005,1),
  (59,30,1,2006,3),(60,30,2,2007,2);