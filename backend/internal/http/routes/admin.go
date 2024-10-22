package routes

import (
	"net/http"

	"backend/internal/database"

	"github.com/gin-gonic/gin"
)

func UseAdminRoutes(router *gin.RouterGroup, food *database.FoodItems) {
	router.POST("/items/:id", func(c *gin.Context) {
		HandleAddItem(c, food)
	})
	router.POST("/items/", func(c *gin.Context) {
		HandleAddItemManually(c, food)
	})

	router.DELETE("items/:id", func(c *gin.Context) {
		HandleDeleteItem(c, food)
	})
}

func HandleAddItem(c *gin.Context, food *database.FoodItems) {
	id := c.Param("id")
	err := food.AddItem(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "successfully added item."})
}
func HandleAddItemManually(c *gin.Context, food *database.FoodItems) {
	var request struct {
		Barcode  string  `json:"barcode"`
		Name     string  `json:"name"`
		Price    float64 `json:"price"`
		Quantity int     `json:"quantity"`
		Photo    string  `json:"photo"`
	}
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JSON body of request is malformed"})
		return
	}

	err2 := food.AddItemManually(request.Barcode, request.Name, request.Price, request.Quantity, request.Photo)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "added item " + request.Barcode + " " + "(" + request.Name + ")"})
}

func HandleDeleteItem(c *gin.Context, food *database.FoodItems) {
	id := c.Param("id")
	err := food.DeleteItem(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "successfully deleted item " + id})
}
