class DatabaseError(Exception):
    """Base exception for database errors"""
    pass

class ConnectionError(DatabaseError):
    """Failed to connect to database"""
    pass

class RecordNotFoundError(DatabaseError):
    """Requested record does not exist"""
    pass

class DuplicateRecordError(DatabaseError):
    """Record with this identifier already exists"""
    pass

class DatabaseInitError(DatabaseError):
    """Failed to initialize database"""
    pass

import sqlite3
from typing import Type
from models.snack import Snack, SnackCreateSchema, SnackUpdateSchema


def get_db_connection(db_file_path:str="data/db.sqlite3"):
    """Creates and returns a SQLite database connection"""
    try:
        connection = sqlite3.connect(db_file_path)
        connection.row_factory = sqlite3.Row
        return connection
    except sqlite3.Error as e:
        raise ConnectionError(f"Failed to connect to database: {str(e)}")
    


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
                raise RecordNotFoundError(f"No snack found with SKU: {sku}")
                
            return Snack(**record)
    except sqlite3.Error as e:
        raise DatabaseError(f"Database error when fetching snack {sku}: {str(e)}")
    except RecordNotFoundError as e:
        raise RecordNotFoundError(f"Snack not found {sku}: {str(e)}")
    except ConnectionError as e:
        raise ConnectionError(f"Database error when connecting to database {sku}: {str(e)}")

    

def create_snack(sku: str,name: str, ) -> Snack:
    """
    Returns a single snack by SKU
    
    Args:
        sku: The unique SKU of the snack
        
    Returns:
        result
        
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
            
            if Type(sku) is not str:
                raise RecordNotFoundError(f"{sku} is not a string")
            if Type(name) is not str:
                raise RecordNotFoundError(f"{name} is not a string")
            return Snack(**record)
    except ConnectionError as e:
        raise ConnectionError(f"Database error when connecting to database {sku}: {str(e)}")
    except DatabaseError as e:
        raise DatabaseError(f"Database error {sku}: {str(e)}")
    
# def update_snack(sku: str) -> Snack:
#     """
#     Returns a single snack by SKU
    
#     Args:
#         sku: The unique SKU of the snack
        
#     Returns:
#         Snack object
        
#     Raises:
#         RecordNotFoundError: If no snack with the given SKU exists
#         ConnectionError: If database connection fails
#         DatabaseError: For other database errors
#     """
#     try:
#         with get_db_connection() as conn:
#             cursor = conn.cursor()
#             cursor.execute("SELECT * FROM snacks WHERE sku = ?", (sku,))
#             record = cursor.fetchone()
            
#             if record is None:
#                 raise RecordNotFoundError(f"No snack found with SKU: {sku}")
                
#             return Snack(**record)
#     except sqlite3.Error as e:
#         raise DatabaseError(f"Database error when fetching snack {sku}: {str(e)}")
#     except RecordNotFoundError as e:
#         raise RecordNotFoundError(f"Snack not found {sku}: {str(e)}")
#     except ConnectionError as e:
#         raise ConnectionError(f"Database error when connecting to database {sku}: {str(e)}")
#     except DatabaseError as e:
#         raise DatabaseError(f"Database error {sku}: {str(e)}")


    
