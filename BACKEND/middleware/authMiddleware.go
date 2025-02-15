 

package middleware

import (
	"campusbids-backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

 func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
 		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

 		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}
		tokenString := parts[1]

 		userID, collegeID, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

 		c.Set("userID", userID)
		c.Set("collegeID", collegeID)
		c.Next()
	}
}
