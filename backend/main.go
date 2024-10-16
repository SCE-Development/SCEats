package main

import (
	"backend/internal/database"
	"backend/internal/http"
)

func main() {
	food, err := database.InitDB()
	if err != nil {
		panic(err)
	}
	http.StartREST(food)
}
