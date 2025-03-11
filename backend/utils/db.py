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
from utils.exceptions import DatabaseError, ConnectionError, RecordNotFoundError, DuplicateRecordError, DatabaseInitError

def get_db_connection(db_file_path:str="data/db.sqlite3"):
    """
    Creates and returns a SQLite database connection

    Args:
        db_file_path: File path object of database

    Returns:
        SQLite database connection
    
    Raises:
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try:
        connection = sqlite3.connect(db_file_path)
        connection.row_factory = sqlite3.Row
        return connection
    except sqlite3.Error as e:
        raise ConnectionError(f"Failed to connect to database: {str(e)}")


def init_db(db_file_path: str = "data/db.sqlite3"):
    """
    Initialize the database with schema
    
    Args:
        db_file_path: File path object of database

    Raises:
        DatabaseInitError: If database initialization fails
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try:
        os.makedirs(os.path.dirname(db_file_path), exist_ok=True)
        with open('data/schema.sql') as f:
            schema = f.read()
        with get_db_connection() as conn:
            conn.executescript(schema)
    except sqlite3.Error as e:
        raise DatabaseInitError(f"Failed to initialize database: {str(e)}")



def get_inventory() -> list[Snack]:
    """
    Returns all snacks in the database
    
    Returns:
        List of Snack objects
        
    Raises:
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try: 
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM snacks")
            records = cursor.fetchall()
            return [Snack(**record) for record in records]
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching inventory: {str(e)}")


def get_snack(sku: str) -> Snack:
    """
    Returns a single snack by SKU
    
    Args:
        sku: The unique SKU of the snack
        
    Returns:
        Snack object
        
    Raises:
        RecordNotFoundError: If no snack with the given SKU exists
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM snacks WHERE sku = ?", (sku,))
            record = cursor.fetchone()
        if record is None:
            raise RecordNotFoundError(f"No snack found with SKU: {sku}" )
        return Snack(**record)
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching snack {sku}: {str(e)}")


def delete_snack(sku: str) -> Snack:
    """
    Removes a snack from the database
    
    Args:
        sku: The unique SKU of the snack

    Returns:
        Deleted snack object
    
    Raises:
        RecordNotFoundError: If no snack with the given SKU exists
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
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
            raise RecordNotFoundError(f"No snack found with SKU {sku}")
        return Snack(**record)
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching snack {sku}: {str(e)}")
        

def create_snack(snack: SnackCreateSchema) -> Snack:
    """
    Creates a new snack in the database
    
    Args:
        snack: New snack object

    Returns:
        New snack object

    Raises:
        DuplicateRecordError: If snack already exists
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""SELECT sku FROM snacks WHERE sku = ?""", (snack.sku,)) 
            existing = cursor.fetchone()
            if existing is not None:
                raise DuplicateRecordError(f"Snack with SKU {snack.sku} already exists")
            cursor.execute("""
                INSERT INTO snacks (sku, name, quantity)
                VALUES (?, ?, ?)
                RETURNING *
            """, (snack.sku, snack.name, snack.quantity if snack.quantity is not None else 1))
            record = cursor.fetchone()
            return Snack(**record)
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching snack {snack.sku}: {str(e)}")


def update_snack(sku: str, updates: SnackUpdateSchema) -> Snack:
    """
    Updates an existing snack in the database
    
    Args:
        sku: The unique SKU of snack
        updates: New snack object

    Returns:
        Updated snack object
    
    Raises:
        RecordNotFoundError: If no snack with the given SKU exists
        ConnectionError: If database connection fails
        DatabaseError: For other database errors
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE snacks 
                SET name = ?, quantity = ?
                WHERE sku = ?
                RETURNING *
            """, (updates.name, updates.quantity, sku))
            record = cursor.fetchone()
        if record is None:
            raise RecordNotFoundError(f"No snack found with SKU {sku}")
        return Snack(**record)
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error in fetching snack {sku}: {str(e)}")



# Initialize the database and create tables
init_db()