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