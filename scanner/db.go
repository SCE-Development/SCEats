package main

import (
	"database/sql"
  	_ "github.com/mattn/go-sqlite3"
)

type food_items struct {
	db *sql.DB
}

func initDB() (*food_items, error) {
	db, err := sql.Open("sqlite3", "food_items.db")
	if err != nil {
	  return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS food_items (
	  barcode INTEGER,
	  name TEXT,
	  price REAL,
	  quantity INTEGER,
	  photo TEXT,
	)`)

	if err != nil {
	  return nil, err
	}
  
	return &food_items{
		db: db,
	}, nil
}
