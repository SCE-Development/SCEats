package routes

import (
	"net/http"

	"backend/internal/database"

	"github.com/gin-gonic/gin"
)

func UseItemRoutes(router *gin.RouterGroup, food *database.FoodItems) {
	router.GET("/items", func(c *gin.Context) {
		HandleGetAllItems(c, food)
	})
	router.GET("/items/:id", func(c *gin.Context) {
		HandleGetItem(c, food)
	})
	router.PUT("/items/:id", func(c *gin.Context) {
		HandleBuyItem(c, food)
	})
}

func HandleGetAllItems(c *gin.Context, food *database.FoodItems) {
	results, err := food.GetAllItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": results})
}

func HandleGetItem(c *gin.Context, food *database.FoodItems) {
	id := c.Param("id")
	result, err := food.GetItem(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"data": result})

}

func HandleBuyItem(c *gin.Context, food *database.FoodItems) {
	var request struct {
		Amount int `json:"amount"`
	}

	id := c.Param("id")
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JSON body of request is malformed"})
		return
	}

	err := food.BuyItem(id, request.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "successfully bought item " + id})
}
