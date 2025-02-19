-- SCEats Inventory Database Schema
-- Contains the core tables for managing snack inventory

CREATE TABLE IF NOT EXISTS snacks (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1
); 