package database

import (
	"database/sql"
	"fmt"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type FoodItems struct {
	db *sql.DB
}

func retrieveRowData(row interface{}) (interface{}, error) {
	var name string
	var barcode int64
	var price float64
	var quantity int
	var photo string

	switch obj := row.(type) {
	case *sql.Row:
		// Scan the row values into variables
		if err := obj.Scan(&barcode, &name, &price, &quantity, &photo); err != nil {
			return nil, err
		}

		return map[string]interface{}{
			"barcode":  barcode,
			"name":     name,
			"price":    price,
			"quantity": quantity,
			"photo":    photo,
		}, nil

	case *sql.Rows:
		defer obj.Close()
		var results []map[string]interface{}
		for obj.Next() {
			if err := obj.Scan(&barcode, &name, &price, &quantity, &photo); err != nil {
				return nil, err
			}

			results = append(results, map[string]interface{}{
				"barcode":  barcode,
				"name":     name,
				"price":    price,
				"quantity": quantity,
				"photo":    photo,
			})
		}
		return results, nil

	default:
		return nil, fmt.Errorf("unsupported type: %T", row)
	}
}

func (f *FoodItems) prepAddRow() (*sql.Stmt, error) {
	stmt, err := f.db.Prepare(`
        INSERT INTO food_items (barcode, name, price, quantity, photo)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(barcode) DO UPDATE SET
        quantity = quantity + 1
    `)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare SQL statement: %v", err)
	}
	return stmt, nil

}

func (f *FoodItems) AddItem(barcode_num string) error {
	productInfo, err := GetProductInfo(barcode_num)
	if err != nil {
		return fmt.Errorf("failed to get product info: %v", err)
	}

	n, err := strconv.ParseInt(barcode_num, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to convert to string")
	}
	name := productInfo.Name
	// figure out price later
	price := 0.0
	// set initial quantity, +1 quantity is in prepare logic
	quantity := 1
	// assume no photo url
	photo := productInfo.Photo
	stmt, err2 := f.prepAddRow()
	if err2 != nil {
		return fmt.Errorf("failed to add row because: %v", err2.Error())
	}
	defer stmt.Close()
	_, err = stmt.Exec(n, name, price, quantity, photo)

	if err != nil {
		return fmt.Errorf("failed to execute SQL statement: %v", err)
	}

	fmt.Printf("Added/Updated item: %s (Barcode: %s)\n", name, barcode_num)
	return nil
}

func (f *FoodItems) AddItemManually(barcode_num string, name string, price float64, quantity int, photo string) error {
	stmt, err := f.prepAddRow()

	n, err := strconv.ParseInt(barcode_num, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to convert to string")
	}

	_, err = stmt.Exec(n, name, price, quantity, photo)
	if err != nil {
		return fmt.Errorf("failed to execute SQL statement: %v", err)
	}

	fmt.Printf("Added/Updated item: %s (Barcode: %s)\n", name, barcode_num)
	return nil
}

func (f *FoodItems) BuyItem(barcode_num string, amount int) error {
	stmt, err := f.db.Prepare(`
        UPDATE food_items
        SET quantity = quantity - ?
        WHERE barcode = ? AND quantity > 0
    `)
	if err != nil {
		return fmt.Errorf("failed to prepare SQL statement: %v", err)
	}
	defer stmt.Close()
	n, err := strconv.ParseInt(barcode_num, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to convert to string")
	}
	result, err := stmt.Exec(amount, n)
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

func (f *FoodItems) GetAllItems() (interface{}, error) {
	rows, err := f.db.Query("SELECT * from food_items")
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve all of database items")
	}
	data, err := retrieveRowData(rows)
	if err != nil {
		return nil, fmt.Errorf(err.Error())
	}
	return data, nil
}

func (f *FoodItems) GetItem(barcode_num string) (interface{}, error) {
	n, err := strconv.ParseInt(barcode_num, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to convert to string")
	}
	row := f.db.QueryRow("SELECT * from food_items WHERE barcode = ?", n)
	data, err := retrieveRowData(row)
	if err != nil {
		return nil, fmt.Errorf(err.Error())
	}
	return data, nil
}

func (f *FoodItems) DeleteItem(barcode_num string) error {
	n, err := strconv.ParseInt(barcode_num, 10, 64)
	if err != nil {
		return fmt.Errorf("failed to convert to string")
	}
	// Prepare the DELETE statement
	stmt, err := f.db.Prepare("DELETE FROM food_items WHERE barcode = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Execute the DELETE statement
	result, err := stmt.Exec(n)
	if err != nil {
		return err
	}

	// Check if a row was affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check affected rows")
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no item found with that ID")
	}
	return nil
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
	  quantity INTEGER CHECK(quantity >= 0),
	  photo TEXT
	)`)

	if err != nil {
		return nil, err
	}

	return &FoodItems{
		db: db,
	}, nil
}
