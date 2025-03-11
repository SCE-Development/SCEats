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
from models.snack import Snack, SnackCreateSchema, SnackUpdateSchema

def get_db_connection(db_file_path:str="data/db.sqlite3"):
    """Creates and returns a SQLite database connection"""
    connection = sqlite3.connect(db_file_path)
    connection.row_factory = sqlite3.Row  # Allows accessing columns by name
    return connection


def init_db(db_file_path: str = "data/db.sqlite3"):
    """Initialize the database with schema"""
    os.makedirs(os.path.dirname(db_file_path), exist_ok=True)
    with open('data/schema.sql') as f:
        schema = f.read()
    with get_db_connection() as conn:
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
            INSERT INTO snacks (sku, name, quantity, price, description, category, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        """, (
            snack.sku, snack.name, 
            snack.quantity if snack.quantity is not None else 1, 
            snack.price, snack.description, 
            snack.category, snack.photo_url
        ))
        record = cursor.fetchone()
        return Snack(**record)


def update_snack(sku: str, updates: SnackUpdateSchema) -> Snack:
    """Updates an existing snack in the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE snacks 
            SET name = ?, quantity = ?, price = ?, 
                description = ?, category = ?, photo_url = ?           
            WHERE sku = ?
            RETURNING *
        """, (updates.name, updates.quantity, updates.price, updates.description, updates.category, updates.photo_url, sku))
        record = cursor.fetchone()
        return Snack(**record)


# Initialize the database and create tables
init_db()