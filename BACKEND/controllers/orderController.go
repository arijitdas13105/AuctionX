//controllers/orderController.go

package controllers

import (
	"campusbids-backend/services"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func FinalizeBidsForExpiredItems(c *gin.Context) {
	err := services.FinalizeBiddingForExpiredItems()
	if err != nil {
		log.Printf("Failed to finalize bidding: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to finalize bids"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Bidding finalized for expired items"})
}

func GetUserOrders(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		log.Printf("user not authenticated,%v", exists)
		return
	}

	orders, err := services.FetchUserOrders(userID.(uint))

	if err != nil {
		log.Printf("Failed to fetch user orders: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User orders fetched successfully",
		"orders":  orders,
	})
}

func OrderDetails(c *gin.Context) {
	_, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		log.Printf("user not authenticated,%v", exists)
		return
	}

	// orderId,err:=strconv.Atoi(c.Param("id"))
	orderId, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		log.Printf("invalid order id:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": "invalid address id"})
		return
	}

	// order, err := services.FetchOrderDetails(orderId.(uint))
	order, err := services.FetchOrderDetails(uint(orderId))

	if err != nil {
		log.Printf("Failed to fetch order details: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order details"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Order details fetched successfully",
		"order":   order,
	})
}
