package database

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func GetProductInfo(barcode_num string) (map[string]interface{}, error) {
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
		"photo":      getString(product, "image_front_url"),
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
