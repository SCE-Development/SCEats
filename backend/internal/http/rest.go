package http

import (
	"fmt"
	"os"

	"backend/internal/database"
	"backend/internal/http/middlewares"
	"backend/internal/http/routes"

	"github.com/gin-gonic/gin"
)

// TODO:

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return fmt.Sprintf(":%s", port)
}

func StartREST(food *database.FoodItems) {
	app := gin.Default()
	routes.UseItemRoutes(app.Group("/inventory"), food)
	app.POST("/login", routes.HandleLogin)

	app.Use(middlewares.Auth())

	routes.UseAdminRoutes(app.Group("/admin"), food)
	//routes.UseCheckoutRoutes(app.Group("/checkout"))
	app.Run(
		getPort(),
	)
}
