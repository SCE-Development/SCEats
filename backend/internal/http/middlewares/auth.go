package middlewares

import (
	"errors"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var authKey = ""
var ErrUnauthorized = errors.New("Unauthorized")

func init() {
	authKey = os.Getenv("AUTH_KEY")
	if authKey == "" {
		panic("AUTH_KEY is not set")
	}
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.GetHeader("Authorization") != authKey {
			c.AbortWithError(http.StatusUnauthorized, ErrUnauthorized)
		}
		c.Next()
	}
}
