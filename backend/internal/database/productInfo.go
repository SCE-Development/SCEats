package database

import (
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func GetProductInfo(barcode_num string) (*Product, error) {
	req, err := http.NewRequest(
		http.MethodGet,
		fmt.Sprintf("https://world.openfoodfacts.org/api/v0/product/%s.json", barcode_num),
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("HTTP GET error: %v", err)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Unmarshal the JSON response into a map
	var result Product
	err2 := json.NewDecoder(resp.Body).Decode(&result)
	if err2 != nil {
		return nil, err2
	}

	// Marshal the result back to a pretty-printed JSON string
	jsonData, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("JSON marshal error: %v", err)
	}

	// Print the pretty JSON
	fmt.Println(string(jsonData))

	return &result, nil
}

// Helper function to safely get string values
func getString(m map[string]interface{}, key string) string {
	if value, ok := m[key].(string); ok {
		return value
	}
	return ""
}

type Product struct {
	Code       string     `json:"code"`
	Brand      string     `json:"brands"`
	Name       string     `json:"name"`
	Photo      string     `json:"image_front_url"`
	Nutriments Nutriments `json:"nutriments"`
}

type Nutriments struct {
	Carbohydrates                                         float64 `json:"carbohydrates"`
	Carbohydrates100G                                     float64 `json:"carbohydrates_100g"`
	CarbohydratesServing                                  float64 `json:"carbohydrates_serving"`
	CarbohydratesUnit                                     string  `json:"carbohydrates_unit"`
	CarbohydratesValue                                    float64 `json:"carbohydrates_value"`
	CarbonFootprintFromKnownIngredientsProduct            int     `json:"carbon-footprint-from-known-ingredients_product"`
	CarbonFootprintFromKnownIngredientsServing            float64 `json:"carbon-footprint-from-known-ingredients_serving"`
	Energy                                                int     `json:"energy"`
	EnergyKcal                                            int     `json:"energy-kcal"`
	EnergyKcal100G                                        int     `json:"energy-kcal_100g"`
	EnergyKcalServing                                     float64 `json:"energy-kcal_serving"`
	EnergyKcalUnit                                        string  `json:"energy-kcal_unit"`
	EnergyKcalValue                                       int     `json:"energy-kcal_value"`
	EnergyKcalValueComputed                               float64 `json:"energy-kcal_value_computed"`
	EnergyKj                                              int     `json:"energy-kj"`
	EnergyKj100G                                          int     `json:"energy-kj_100g"`
	EnergyKjServing                                       int     `json:"energy-kj_serving"`
	EnergyKjUnit                                          string  `json:"energy-kj_unit"`
	EnergyKjValue                                         int     `json:"energy-kj_value"`
	EnergyKjValueComputed                                 float64 `json:"energy-kj_value_computed"`
	Energy100G                                            int     `json:"energy_100g"`
	EnergyServing                                         int     `json:"energy_serving"`
	EnergyUnit                                            string  `json:"energy_unit"`
	EnergyValue                                           int     `json:"energy_value"`
	Fat                                                   float64 `json:"fat"`
	Fat100G                                               float64 `json:"fat_100g"`
	FatServing                                            float64 `json:"fat_serving"`
	FatUnit                                               string  `json:"fat_unit"`
	FatValue                                              float64 `json:"fat_value"`
	FiberModifier                                         string  `json:"fiber_modifier"`
	FruitsVegetablesLegumesEstimateFromIngredients100G    int     `json:"fruits-vegetables-legumes-estimate-from-ingredients_100g"`
	FruitsVegetablesLegumesEstimateFromIngredientsServing int     `json:"fruits-vegetables-legumes-estimate-from-ingredients_serving"`
	FruitsVegetablesNutsEstimateFromIngredients100G       int     `json:"fruits-vegetables-nuts-estimate-from-ingredients_100g"`
	FruitsVegetablesNutsEstimateFromIngredientsServing    int     `json:"fruits-vegetables-nuts-estimate-from-ingredients_serving"`
	NovaGroup                                             int     `json:"nova-group"`
	NovaGroup100G                                         int     `json:"nova-group_100g"`
	NovaGroupServing                                      int     `json:"nova-group_serving"`
	NutritionScoreFr                                      int     `json:"nutrition-score-fr"`
	NutritionScoreFr100G                                  int     `json:"nutrition-score-fr_100g"`
	Proteins                                              float64 `json:"proteins"`
	Proteins100G                                          float64 `json:"proteins_100g"`
	ProteinsServing                                       float64 `json:"proteins_serving"`
	ProteinsUnit                                          string  `json:"proteins_unit"`
	ProteinsValue                                         float64 `json:"proteins_value"`
	Salt                                                  float64 `json:"salt"`
	Salt100G                                              float64 `json:"salt_100g"`
	SaltServing                                           float64 `json:"salt_serving"`
	SaltUnit                                              string  `json:"salt_unit"`
	SaltValue                                             float64 `json:"salt_value"`
	SaturatedFat                                          float64 `json:"saturated-fat"`
	SaturatedFat100G                                      float64 `json:"saturated-fat_100g"`
	SaturatedFatServing                                   float64 `json:"saturated-fat_serving"`
	SaturatedFatUnit                                      string  `json:"saturated-fat_unit"`
	SaturatedFatValue                                     float64 `json:"saturated-fat_value"`
	Sodium                                                float64 `json:"sodium"`
	Sodium100G                                            float64 `json:"sodium_100g"`
	SodiumServing                                         float64 `json:"sodium_serving"`
	SodiumUnit                                            string  `json:"sodium_unit"`
	SodiumValue                                           float64 `json:"sodium_value"`
	Sugars                                                float64 `json:"sugars"`
	Sugars100G                                            float64 `json:"sugars_100g"`
	SugarsServing                                         float64 `json:"sugars_serving"`
	SugarsUnit                                            string  `json:"sugars_unit"`
	SugarsValue                                           float64 `json:"sugars_value"`
}
