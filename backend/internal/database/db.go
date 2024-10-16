package database

import (
	"database/sql"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type FoodItems struct {
	db *sql.DB
}

func (c *FoodItems) AddItem(barcode_num string) error {
	productInfo, err := GetProductInfo(barcode_num)
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

func (c *FoodItems) BuyItem(barcode_num string) error {
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

func (f *FoodItems) GetAllItems() (gin.H, error) {
	rows, err := f.db.Query("SELECT * from food_items")
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve all of database items")
	}
	defer rows.Close()

	// Prepare a slice to hold the results (row data)
	var foodItems []map[string]interface{}

	// Iterate through the rows
	for rows.Next() {
		var name string
		var barcode int64
		var price float64
		var quantity int
		var photo string

		// Scan the row values into variables
		if err := rows.Scan(&barcode, &name, &price, &quantity, &photo); err != nil {
			return nil, err
		}

		// Append the row data as a map to the foodItems slice
		foodItems = append(foodItems, map[string]interface{}{
			"barcode":  barcode,
			"name":     name,
			"price":    price,
			"quantity": quantity,
			"photo":    photo,
		})
	}

	return gin.H{"data": foodItems}, nil

}

func (f *FoodItems) GetItem(bc string) (gin.H, error) {
	barcode_id, err := strconv.ParseInt(bc, 10, 64)
	if err != nil {
		return nil, err
	}
	row := f.db.QueryRow("SELECT * from food_items WHERE barcode_id = ?", barcode_id)

	// Prepare variables to hold the results
	var name string
	var barcode int64
	var price float64
	var quantity int
	var photo string

	// Scan the row values into variables
	read_err := row.Scan(&barcode, &name, &price, &quantity, &photo)
	if read_err != nil {
		if read_err == sql.ErrNoRows {
			// Handle case where no result is found
			return nil, fmt.Errorf("no item found with barcode_id: %d", barcode_id)
		}
		// Return any other error
		return nil, read_err
	}

	// Return the fetched name and price
	return gin.H{
		"barcode":  barcode,
		"name":     name,
		"price":    price,
		"quantity": quantity,
		"photo":    photo,
	}, nil
}

func InitDB() (*FoodItems, error) {
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

	return &FoodItems{
		db: db,
	}, nil
}
