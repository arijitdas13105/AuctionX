package controllers

import (
	"campusbids-backend/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DepositAmountController(c *gin.Context) {
	var depositRequest struct {
		Amount      float64 `json:"amount"`
		Description string  `json:"description"`
	}

	if err := c.ShouldBindJSON(&depositRequest); err != nil {
		log.Printf("Invalid deposit request: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if depositRequest.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Deposit amount must be greater than zero"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	updatedWallet, err := services.DepositAmount(userID.(uint), depositRequest.Amount, depositRequest.Description)
	if err != nil {
		log.Printf("Failed to deposit amount: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deposit amount"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Amount deposited successfully",
		"wallet":  updatedWallet,
	})
}

func FetUserBalanceController(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	balance, err := services.FetchUserBalance(userID.(uint))
	if err != nil {
		log.Printf("Failed to fetch user balance: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user balance"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "fetched user balance",
		"balance": balance,
	})
}
