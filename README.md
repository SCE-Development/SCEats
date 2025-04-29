# SCEats

SCE's snack inventory management

## Project Structure

### Frontend

- Vite (React and Typescript)

### Backend

- Python
- sqlite3
  - Purpose: Maages dstructured data storage in relational database.
  - usage: Stores all snack-related information.
  - Benefit: ensures data consistency, efficient querying, and relational integrity.
- FastAPI

  - Purpose: A modern, high performance web framework for building APIs
  - Features Used:
    - CorsMiddleware: Automaticaly enables cross-origin requests, which is essential for frontend-bakcend communication in web apps.
  - Benefit: Combines performance with developer-friendly features like automatic validation and interactive API docs (Swagger UI, ReDoc)
  - Ability to process several requests without blocking due to support for asynchronous programming.

### File structure

- /backend
  - /data
    - creates structured database tables for snacks
  - /models
    - create data models for Inventory API responses using Pydantic
    - create several data models for snack related data using Pydantic
  - /routes
    - All routes included within /v1/inventory.py
    - /test creates reusable tests to set up API calling, setting up DB, etc. Uses PyTest
  - /utils
    - /db.py Utility functions that are called by the routes
  - /main.py Sets up starting point for FastAPI application

## Backend Documentation

### Routes (haven't included error codes, calls Utility functions)

#### GET /

Description:
Fetches all snacks from the database and returns them as a list of Snack objects.

Calls:
get_inventory() – Opens a database connection and queries the snacks table for all snacks.

Request:
None.

Response:

```{
  "snacks": [
    {
      "sku": "CH001",
      "name": "Chips",
      "quantity": 25,
      "price": 1.99,
      "description": "Crunchy and salty",
      "category": "Snacks",
      "photo_url": "https://example.com/chips.png"
    }
  ]
}
```

#### GET /snacks/{sku}

Description:
Fetches details for a specific snack identified by sku.

Calls:
get_snack(sku) – Opens a database connection and queries the snacks table for the snack with the given sku.

Request:

Path Parameter: sku (string) – The unique identifier for the snack.

Response:

```
{
  "sku": "CH001",
  "name": "Chips",
  "quantity": 25,
  "price": 1.99,
  "description": "Crunchy and salty",
  "category": "Snacks",
  "photo_url": "https://example.com/chips.png"
}
```

#### POST /snacks

Description:
Creates a new snack in the database.

Calls:
create_snack(snack) – Opens a database connection and inserts a new snack object.

Request:

```
{
  "sku": "CK002",
  "name": "Cookies",
  "quantity": 10,
  "price": 2.50,
  "description": "Chocolate chip",
  "category": "Dessert",
  "photo_url": null
}
```

Response:

```
{
  "sku": "CK002",
  "name": "Cookies",
  "quantity": 10,
  "price": 2.50,
  "description": "Chocolate chip",
  "category": "Dessert",
  "photo_url": null
}
```

#### PUT /snacks/{sku}

Description:
Updates the snack identified by sku with the provided updates.

Calls:
update_snack(sku, updates) – Opens a database connection, updates the snack with the given sku, and replaces its attributes with the new values.

Request:

Path Parameter: sku (string) – The SKU of the snack to be updated.

Body: SnackUpdateSchema – The updated data for the snack.

Example Request Body:

```
{
  "name": "Updated Cookies",
  "quantity": 15,
  "price": 3.00,
  "description": "Updated chocolate chip",
  "category": "Dessert",
  "photo_url": "https://example.com/updated-cookies.png"
}
```

Response:

```
{
  "sku": "CK002",
  "name": "Updated Cookies",
  "quantity": 15,
  "price": 3.00,
  "description": "Updated chocolate chip",
  "category": "Dessert",
  "photo_url": "https://example.com/updated-cookies.png"
}
```

#### DELETE /snacks/{sku}

Description:
Deletes the snack identified by sku.

Calls:
delete_snack(sku) – Opens a database connection, finds the snack with the given sku, and deletes it.

Request:

Path Parameter: sku (string) – The SKU of the snack to delete.

Response:

```
{
  "sku": "CH001",
  "name": "Chips",
  "quantity": 25,
  "price": 1.99,
  "description": "Crunchy and salty",
  "category": "Snacks",
  "photo_url": "https://example.com/chips.png"
}
```

If the snack is not found:

```
{
  "detail": "Snack not found"
}
```

#### POST /snacks/bulk

Description:
Deletes the snack identified by sku.

Calls:
delete_snack(sku) – Opens a database connection, finds the snack with the given sku, and deletes it.

Request:

Path Parameter: sku (string) – The SKU of the snack to delete.

Response:

```
{
  "sku": "CH001",
  "name": "Chips",
  "quantity": 25,
  "price": 1.99,
  "description": "Crunchy and salty",
  "category": "Snacks",
  "photo_url": "https://example.com/chips.png"
}
```

If the snack is not found:

```
{
  "detail": "Snack not found"
}
```

#### DELETE /metrics

Description:
WIP?

Calls:

Request:

Response:

```

```

```

```

### Database Schema

Uses sqlite3

Table: snacks
Stores information about snack item, including product details, quantity, pricing, and optional metadata like category and photo.

| Column Name   | Data Type      | Description                                                   | Constraints           |
| ------------- | -------------- | ------------------------------------------------------------- | --------------------- |
| `sku`         | `TEXT`         | Unique identifier for the snack item.                         | Primary Key, Required |
| `name`        | `TEXT`         | Name of the snack.                                            | Required              |
| `quantity`    | `INTEGER`      | Number of items available in stock.                           | Default: `1`          |
| `price`       | `DECIMAL(4,2)` | Price of the snack, with up to 2 decimal places (e.g., 9.99). | Required              |
| `description` | `TEXT`         | Detailed description of the snack.                            | Optional              |
| `category`    | `TEXT`         | Classification like "chips", "candy", etc.                    | Optional              |
| `photo_url`   | `TEXT`         | URL pointing to a photo of the snack.                         | Optional              |

?

## API Documentation

- pydantic
  - for data validation and serialization.
- fastAPI
  - Provides gateway for database to be accessed by the user.
- Promentheus client
  - Provide data visualization, powerful querying, and more metric insights

## Setup Guide

### How to run the frontend

- No frontend?

### How to run the backend

- Change directories into the backend folder with `cd backend`
- Create a virtual environment with `python -m venv .venv`
- Activate the virtual environment
  - Windows: `.\.venv\Scripts\activate`
  - Mac: `source ./.venv/bin/activate`
- Run `pip install -r requirements.txt`
- Run `python main.py`

## Deployment Documentation

Not deployed?

### Process

?

### CI/CD Pipline

Not deployed?
