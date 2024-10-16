package routes

import "github.com/gin-gonic/gin"

func UsePaymentRoutes(router *gin.RouterGroup) {
	router.GET("/payment", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Payment route",
		})
	})

}
