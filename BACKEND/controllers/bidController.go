// controllers/bidController.go

package controllers

import (
	"campusbids-backend/models"
	"campusbids-backend/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func PlaceBid(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var bidRequest models.Bid
	if err := c.ShouldBindJSON(&bidRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	bidRequest.BuyerID = userID.(uint)

	createdBid, err := services.PlaceBid(bidRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bid placed successfully",
		"bid":     createdBid,
	})
}

func GetBidsForItem(c *gin.Context) {
	itemIDParam := c.Param("itemID")
	itemID, err := strconv.Atoi(itemIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}
	bids, err := services.GetBidsForItem(uint(itemID))

	if err != nil {
		log.Printf("failed to get all bids:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": "failed to get all bids"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"messsage": "All bids fetched successfully",
		"bids":     bids,
	})
}

func GetAllBidsByUser(c *gin.Context) {
	userID, exist := c.Get("userID")
	if !exist {
		log.Printf("user not authenticated,%v", exist)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	bids, err := services.FetchAllBidsByUser(userID.(uint))
	if err != nil {
		log.Printf("failed to get all bids:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch bids"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "fetched all bids",
		"bids":    bids,
	})
}
