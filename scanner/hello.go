package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

const (
	Add = iota
	Buy
)

func addItem(barcode_num string) {
	// TODO: Make an API call that adds the item to the inventory
	// We can pass the product info in the request body
	productInfo, err := getProductInfo(barcode_num)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Adding", productInfo["name"])
	}
}

func buyItem(barcode_num string) {
	// TODO: Make an API call that purchases the item from the inventory
	// We only need the barcode number because it will be the primary key in DB
	fmt.Println("Buying barcode:", barcode_num)
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
				addItem(barcode_num)
			} else if mode == Buy {
				buyItem(barcode_num)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error:", err)
	}
}
