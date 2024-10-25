package tests

import (
	"backend/internal/database"
	"fmt"
	"testing"
)

// go test -v TestProductFetching ./tests
func TestProductFetching(t *testing.T) {
	product, err := database.GetProductInfo("3017620422003")

	if err != nil {
		t.Fatal("wrong", err)
	}
	t.Log(product.Name)
}
