package main

import (
	"backend/internal/database"
	"fmt"
)

func main() {
	product, err := database.GetProductInfo("3017620422003")
	if err != nil {
		panic("wrong " + err.Error())
	}
	fmt.Println(product.Name)
}
