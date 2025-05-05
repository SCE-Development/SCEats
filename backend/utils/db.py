"""
Database Utility Module

This module handles all database operations for the snack inventory system.
It provides functions for:
- Database connection and initialization
- CRUD operations for snacks (Create, Read, Update, Delete)
- Inventory management (increment/decrement quantities)

The application uses SQLite for data storage, with the Snack model for data validation.
"""
import os
import sqlite3
from models.snack import Snack, SnackCreateSchema, SnackUpdateSchema,BulkSnackCreate
from typing import List

def get_db_connection(db_file_path:str="data/db.sqlite3"):
    """Creates and returns a SQLite database connection"""
    connection = sqlite3.connect(db_file_path)
    connection.row_factory = sqlite3.Row  # Allows accessing columns by name
    return connection


def init_db(db_file_path: str = "data/db.sqlite3"):
    """Initialize the database with schema"""
    os.makedirs(os.path.dirname(db_file_path), exist_ok=True)
    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Check if the 'snacks' table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='snacks';")
        table_exists = cursor.fetchone()

        if table_exists:
            # Check for missing columns and add them if necessary
            cursor.execute("PRAGMA table_info(snacks);")
            columns = [column[1] for column in cursor.fetchall()]

            if 'price' not in columns:
                cursor.execute("ALTER TABLE snacks ADD COLUMN price DECIMAL(4,2) NOT NULL DEFAULT 0.00;")
            if 'description' not in columns:
                cursor.execute("ALTER TABLE snacks ADD COLUMN description TEXT;")
            if 'category' not in columns:
                cursor.execute("ALTER TABLE snacks ADD COLUMN category TEXT;")
            if 'photo_url' not in columns:
                cursor.execute("ALTER TABLE snacks ADD COLUMN photo_url TEXT;")
        else:
            # If the table doesn't exist, create it using the schema file
            with open('data/schema.sql') as f:
                schema = f.read()
            conn.executescript(schema)


def get_inventory() -> list[Snack]:
    """Returns all snacks in the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM snacks")
        records = cursor.fetchall()
        return [Snack(**record) for record in records]


def get_snack(sku: str) -> Snack:
    """Returns a single snack by SKU"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM snacks WHERE sku = ?", (sku,))
        record = cursor.fetchone()
        return Snack(**record)


def delete_snack(sku: str) -> Snack:
    """Removes a snack from the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM snacks 
            WHERE sku = ? 
            RETURNING *
        """, (sku,))
        record = cursor.fetchone()
        return Snack(**record)
        

def create_snack(snack: SnackCreateSchema) -> Snack:
    """Creates a new snack in the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO snacks 
                (sku, name, quantity, price, description, category, photo_url)
            VALUES 
                (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        """, (
            snack.sku, 
            snack.name, 
            snack.quantity, 
            snack.price, 
            snack.description, 
            snack.category, 
            snack.photo_url
        ))
        record = cursor.fetchone()
        return Snack(**record)


def update_snack(sku: str, updates: SnackUpdateSchema) -> Snack:
    """Updates an existing snack in the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # First, get the current snack data
        cursor.execute("SELECT * FROM snacks WHERE sku = ?", (sku,))
        current_snack = cursor.fetchone()
        
        if not current_snack:
            raise ValueError(f"Snack with SKU {sku} not found")
        
        # Use provided values or fall back to current values
        name = updates.name if updates.name is not None else current_snack['name']
        quantity = updates.quantity if updates.quantity is not None else current_snack['quantity']
        price = updates.price if updates.price is not None else current_snack['price']
        description = updates.description if updates.description is not None else current_snack['description']
        category = updates.category if updates.category is not None else current_snack['category']
        photo_url = updates.photo_url if updates.photo_url is not None else current_snack['photo_url']
        
        cursor.execute("""
            UPDATE snacks 
            SET 
                name = ?, 
                quantity = ?, 
                price = ?, 
                description = ?, 
                category = ?, 
                photo_url = ?       
            WHERE sku = ?
            RETURNING *
        """, (
            name, 
            quantity, 
            price, 
            description, 
            category, 
            photo_url, 
            sku
        ))
        record = cursor.fetchone()
        return Snack(**record)


# Bulk Processing function
def create_bulk_items(bulk_snacks:BulkSnackCreate) -> List[Snack]:
    """Create a Bulk of snacks in the database"""
    with get_db_connection() as conn:
        cursor=conn.cursor()

        snack_data=[(snack.sku,snack.quantity, snack.price,snack.description,snack.category, snack.photo_url) for snack in bulk_snacks] 
        query="""            
                        INSERT INTO snacks (sku,quantity,name,price,description,category,photo_url)
                        VALUES (?, ?, '',?,?,?,?);
                        """
        
        cursor.executemany(query,snack_data)
    
        # Build the placeholders for the IN clause
        sku_placeholders = ', '.join('?' for _ in snack_data)

        select_query = f"SELECT sku, quantity, name,price,description,category,photo_url FROM snacks WHERE sku IN ({sku_placeholders})"

        cursor.execute(select_query, tuple([snack[0] for snack in snack_data]))

        records = cursor.fetchall()  # fetchall() to get all rows inserted
        return [Snack(sku=sku,quantity=quantity,name=name, price=price,description=description,category=category,photo_url=photo_url) for 
                (sku,quantity,name,price,description,category,photo_url) in records]


# Initialize the database and create tables
init_db()