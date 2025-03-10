-- SCEats Inventory Database Schema
-- Contains the core tables for managing snack inventory

-- Note: Need help with creating the bulk table
-- Note:Mostly need help with making a list field for the bulk table to store items

CREATE TABLE IF NOT EXISTS snacks (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1
); 


