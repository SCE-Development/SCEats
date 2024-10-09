package backend

import (
	"fmt"
	"database/sql"
  	_ "github.com/mattn/go-sqlite3"
)

type food_items struct {
	db *sql.DB
}

func (c *food_items) addItem(barcode_num string) error {
    productInfo, err := getProductInfo(barcode_num)
    if err != nil {
        return fmt.Errorf("failed to get product info: %v", err)
    }

    name := productInfo["name"].(string)
    // figure out price later
    price := 0.0
    // set initial quantity, +1 quantity is in prepare logic
    quantity := 1
    // assume no photo url
    photo := productInfo["photo"].(string)

    stmt, err := c.db.Prepare(`
        INSERT INTO food_items (barcode, name, price, quantity, photo)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(barcode) DO UPDATE SET
        quantity = quantity + 1
    `)
    if err != nil {
        return fmt.Errorf("failed to prepare SQL statement: %v", err)
    }
    defer stmt.Close()

    _, err = stmt.Exec(barcode_num, name, price, quantity, photo)
    if err != nil {
        return fmt.Errorf("failed to execute SQL statement: %v", err)
    }

    fmt.Printf("Added/Updated item: %s (Barcode: %s)\n", name, barcode_num)
    return nil
}

func (c *food_items) buyItem(barcode_num string) error {
    stmt, err := c.db.Prepare(`
        UPDATE food_items
        SET quantity = quantity - 1
        WHERE barcode = ? AND quantity > 0
    `)
    if err != nil {
        return fmt.Errorf("failed to prepare SQL statement: %v", err)
    }
    defer stmt.Close()

    result, err := stmt.Exec(barcode_num)
    if err != nil {
        return fmt.Errorf("failed to execute SQL statement: %v", err)
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return fmt.Errorf("failed to get rows affected: %v", err)
    }

    if rowsAffected == 0 {
        return fmt.Errorf("item not found or out of stock")
    }

    fmt.Printf("Bought item with barcode: %s\n", barcode_num)
    return nil
}

func initDB() (*food_items, error) {
	db, err := sql.Open("sqlite3", "food_items.db")
	if err != nil {
	  return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS food_items (
	  barcode INTEGER UNIQUE,
	  name TEXT,
	  price REAL,
	  quantity INTEGER,
	  photo TEXT
	)`)

	if err != nil {
	  return nil, err
	}
  
	return &food_items{
		db: db,
	}, nil
}
