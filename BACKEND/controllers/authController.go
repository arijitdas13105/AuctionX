package controllers

import (
	"campusbids-backend/models"
	"campusbids-backend/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func LoginUser(c *gin.Context) {
	var loginRequest models.User

	if err := c.ShouldBindBodyWithJSON(&loginRequest); err != nil {
		log.Printf("failed to get last insert ID:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}
	loggedUser, token, err := services.LoginUser(loginRequest)
	if err != nil {
		log.Printf("failed to login user:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "failed to login user"})
		return
	}

	responseUser := gin.H{
		"id":         loggedUser.ID,
		"name":       loggedUser.Name,
		"email":      loggedUser.Email,
		"role":       loggedUser.Role,
		"college_id": loggedUser.CollegeID,
		"created_at": loggedUser.CreatedAt,
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		// "data":    loggedUser,
		"data":  responseUser,
		"token": token,
	})

}
