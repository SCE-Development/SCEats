package routes

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func HandleLogin(c *gin.Context) {
	var request LoginRequest

	// Bind the JSON request to the request struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Retrieve the credentials from the environment variables
	validUsername := os.Getenv("AUTH_USERNAME")
	validPassword := os.Getenv("AUTH_PASSWORD")

	println(request.Password + " " + request.Username)
	println(validUsername + " " + validPassword)

	// Check if the credentials are correct
	if request.Username == validUsername && request.Password == validPassword {
		// Create a new token object, specifying signing method and the claims
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": validUsername,
			"role":     "admin",
			"exp":      time.Now().Add(time.Hour * 1).Unix(), // Token expiration time
		})

		// Sign and get the complete encoded token as a string
		tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	} else {
		// Unauthorized if credentials don't match
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
	}
}
