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
from exceptions import DatabaseError, ConnectionError, RecordNotFoundError, DuplicateRecordError, DatabaseInitError

def get_db_connection(db_file_path:str="data/db.sqlite3"):
    """Creates and returns a SQLite database connection"""
    try:
        connection = sqlite3.connect(db_file_path)
        connection.row_factory = sqlite3.Row  # Allows accessing columns by name
        return connection
    except sqlite3.Error as e:
        raise DatabaseError(f"Error creating database connection: {str(e)}")


def init_db(db_file_path: str = "data/db.sqlite3"):
    """Initialize the database with schema"""
    try:
        os.makedirs(os.path.dirname(db_file_path), exist_ok=True)
        with open('data/schema.sql') as f:
            schema = f.read()
        with get_db_connection() as conn:
            conn.executescript(schema)
    except sqlite3.Error as e:
        raise DatabaseInitError(f"Error when initializing database: {str(e)}")
    

def get_inventory() -> list[Snack]:
    """Returns all snacks in the database"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM snacks")
            records = cursor.fetchall()
            if not records: 
                raise RecordNotFoundError("No snacks in database")
            return [Snack(**record) for record in records]
    except ConnectionError as e:
        raise ConnectionError(f"Error when connecting to database: {str(e)}")
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching all snacks: {str(e)}")


def get_snack(sku: str) -> Snack:
    """Returns a single snack by SKU"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM snacks WHERE sku = ?", (sku,))
            record = cursor.fetchone()
            if record is None:
                raise RecordNotFoundError(f"No snack found with SKU: {sku}")
            return Snack(**record)
    except ConnectionError as e:
        raise ConnectionError(f"Error when connecting to database: {str(e)}")
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching snack {sku}: {str(e)}")
    

def delete_snack(sku: str) -> Snack:
    """Removes a snack from the database"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM snacks 
                WHERE sku = ? 
                RETURNING *
            """, (sku,))
            record = cursor.fetchone()
            if record is None:
                raise RecordNotFoundError(f"Didn't delete snack {sku} successfully")
            return Snack(**record)
    except ConnectionError as e:
        raise ConnectionError(f"Error when connecting to database: {str(e)}")
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when deleting snack {sku}: {str(e)}")
    
    
def create_snack(snack: SnackCreateSchema) -> Snack:
    """Creates a new snack in the database"""
    try:
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
                snack.quantity if snack.quantity is not None else 1, 
                snack.price, 
                snack.description, 
                snack.category, 
                snack.photo_url
            ))
            record = cursor.fetchone()
            if record is None:
                raise DatabaseError(f"Error when creating snack")
            return Snack(**record)
    except DuplicateRecordError as e:
        raise DuplicateRecordError(f"This snack already exists: {str(e)}")
    except ConnectionError as e:
        raise ConnectionError(f"Error when connecting to database: {str(e)}")
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when creating snack {snack.sku}: {str(e)}")


def update_snack(sku: str, updates: SnackUpdateSchema) -> Snack:
    """Updates an existing snack in the database"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
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
                updates.name, 
                updates.quantity, 
                updates.price, 
                updates.description, 
                updates.category, 
                updates.photo_url, 
                sku
            ))
            record = cursor.fetchone()
            if record is None:
                raise RecordNotFoundError(f"Snack with SKU: {sku} doesn't exist")
            return Snack(**record)
    except ConnectionError as e:
        raise ConnectionError(f"Error when connecting to database: {str(e)}")
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when updating snack {sku}: {str(e)}")


# Initialize the database and create tables
init_db()