package controllers

import (
	"campusbids-backend/models"
	"campusbids-backend/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func CreateUser(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindBodyWithJSON(&user); err != nil {
		log.Printf("Failed to get last insert ID: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdUser, err := services.CreateUser(user)
	if err != nil {
		log.Printf("falied to create user :%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "falied to create User"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": createdUser,
	})
}

func GetAllColleges(c *gin.Context) {

	colleges, err := services.FetchAllColleges()

	if err != nil {
		log.Printf("failed to get colleges:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "failed to get colleges"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message":  "Colleges fetched successfully",
		"colleges": colleges,
	})

}

func FetchUserDetails(c *gin.Context) {
	userId := c.Param("id")
	user, err := services.FetchUserDetails(userId)
	if err != nil {
		log.Printf("failed to get user details:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "failed to get user details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User details fetched successfully",

		"user": gin.H{
			"id":         user.ID,
			"name":       user.Name,
			"email":      user.Email,
			"role":       user.Role,
			"college_id": user.CollegeID,
			"created_at": user.CreatedAt,
		},
	})
}

func UpdateUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	log.Printf("user id 👇%v", userID)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var updateRequest models.User
	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	updatedUser, err := services.UpdateUser(userID.(uint), updateRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User details updated successfully",
		"user":    updatedUser,
	})
}
