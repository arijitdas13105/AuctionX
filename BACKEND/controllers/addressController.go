package controllers

import (
	"campusbids-backend/models"
	"campusbids-backend/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AddAddress(c *gin.Context) {

	var addressRequest models.Address

	if err := c.ShouldBindJSON(&addressRequest); err != nil {
		log.Printf("invalid item request:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid request data"})
	}
	userId, exist := c.Get("userID")

	if !exist {
		log.Printf("unatuthorized")
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "unauthorized"})
	}

	addressRequest.UserID = userId.(uint)

	createdAddress, err := services.CreateAddress(addressRequest)

	if err != nil {
		log.Printf("failed to create address,%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "added address",
		"data":    createdAddress,
	})

}

func GetUserAddress(c *gin.Context) {

	userId, exist := c.Get("userID")

	if !exist {
		log.Printf("unauthorized")
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "unauthrozied"})
	}

	userAddress, err := services.FetchUserAddress(userId.(uint))

	if err != nil {
		log.Printf("failed to get user address:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user address"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "succesfully get the user address",
		"data":    userAddress,
	})
}

func EditAddress(c *gin.Context) {
	addressId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Printf("invalid address id:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid address id"})
		return
	}
	userId, exist := c.Get("userID")
	if !exist {
		log.Printf("unauthorized")
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "unauthorized"})
		return
	}

	var addressRequest models.Address

	addressRequest.ID = uint(addressId)
	addressRequest.UserID = userId.(uint)

	if err := c.ShouldBindJSON(&addressRequest); err != nil {
		log.Printf("invalid item request:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid request data"})
		return
	}
	editedAddress, err := services.EditedAddress(addressRequest)

	if err != nil {
		log.Printf("failed to edit address:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to edit address"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "edited address",
		"data":    editedAddress,
	})

}

func DeleteAddress(c *gin.Context) {
	addressId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Printf("invalid address id:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid address id"})
		return
	}
	userId, exist := c.Get("userID")
	if !exist {
		log.Printf("unauthorized")
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "unauthorized"})
		return
	}

	err = services.DeleteAddressService(uint(addressId), userId.(uint))
	if err != nil {
		log.Printf("failed to delete address:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete address"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "deleted address",
	})
}
