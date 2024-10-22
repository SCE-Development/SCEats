package middlewares

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var authKey = ""
var ErrUnauthorized = errors.New("Unauthorized")

func init() {
	// change this to check for username and auth

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	authKey = os.Getenv("JWT_SECRET")
	if authKey == "" {
		panic("JWT_SECRET is not set")
	}

}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := strings.Split(c.GetHeader("Authorization"), "Bearer ")[0]
		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrAbortHandler
			}
			return []byte(authKey), nil
		})

		if err != nil || !token.Valid {
			if err != nil {
				println(err.Error())
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Set the token claims to the context
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("claims", claims)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Next() // Proceed to the next handler if authorized
	}
}
