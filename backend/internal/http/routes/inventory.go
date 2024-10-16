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
	router.POST("/items/:id", func(c *gin.Context) {
		HandleAddItem(c, food)
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
	c.JSON(200, results)
}

func HandleGetItem(c *gin.Context, food *database.FoodItems) {
	id := c.Param("id")
	result, err := food.GetItem(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, result)

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
func HandleBuyItem(c *gin.Context, food *database.FoodItems) {
	id := c.Param("id")
	err := food.BuyItem(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "successfully bought item."})
}
