package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	_ "github.com/mattn/go-sqlite3"
)

const (
	Add = iota
	Buy
)

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

func getProductInfo(barcode_num string) (map[string]interface{}, error) {
	url := "https://world.openfoodfacts.org/api/v0/product/" + barcode_num + ".json"
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("HTTP GET error: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body error: %v", err)
	}

	// Unmarshal the JSON response into a map
	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("JSON unmarshaling error: %v", err)
	}

	// Check if the product information is present
	product, ok := result["product"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("product information not found")
	}

	// Extract the specific information from the product map
	specificInfo := map[string]interface{}{
		"id":         getString(product, "code"),
		"brand":      getString(product, "brands"),
		"name":       getString(product, "product_name"),
		"nutriments": getNutriments(product),
		"photo": 	  getString(product, "image_front_url"),
	}

	return specificInfo, nil
}

// Helper function to safely get string values
func getString(m map[string]interface{}, key string) string {
	if value, ok := m[key].(string); ok {
		return value
	}
	return ""
}

// Helper function to get nutriments or return an empty map
func getNutriments(product map[string]interface{}) map[string]interface{} {
	if nutriments, ok := product["nutriments"].(map[string]interface{}); ok {
		return nutriments
	}
	return make(map[string]interface{})
}

func main() {

	foodItems, err := initDB()
	if err != nil {
		fmt.Printf("Couldn't initialize db: %v\n", err)
		return
	}
	defer foodItems.db.Close()

	var mode = Buy
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		barcode_num := scanner.Text()
		// Check if the text contains the add or buy strings and set the mode accordingly
		if strings.Contains(barcode_num, "sceaddsnacks") {
			fmt.Println("Switching to ADD mode")
			mode = Add
		} else if strings.Contains(barcode_num, "scebuysnacks") {
			mode = Buy
			fmt.Println("Switching to BUY mode")
		} else {
			if mode == Add {
				err := foodItems.addItem(barcode_num)
				if err != nil {
					fmt.Printf("Error adding item: %v\n", err)
				}

			} else if mode == Buy {
				err := foodItems.buyItem(barcode_num)
				if err != nil {
					fmt.Printf("Error buying item(s): %v\n", err)
				}
			}
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error:", err)
	}
}
