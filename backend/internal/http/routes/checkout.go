package routes

import "github.com/gin-gonic/gin"

func UseCheckoutRoutes(router *gin.RouterGroup) {
	router.GET("/cart", HandleGetCart)
	router.POST("/cart", HandleAddToCart)
	router.DELETE("/cart", HandleRemoveFromCart)
	router.POST("/checkout", HandleMarkCheckout)
}

func HandleGetCart(c *gin.Context) {
	//get cart items

}

func HandleAddToCart(c *gin.Context) {
	//add item to cart
}

func HandleRemoveFromCart(c *gin.Context) {
	//remove item from cart
}

func HandleMarkCheckout(c *gin.Context) {
	//mark checkout as waiting for payment
}
