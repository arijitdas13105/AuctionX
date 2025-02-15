// controllers/itemController.go
package controllers

import (
	"campusbids-backend/models"
	"campusbids-backend/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"strconv"
)

func CreateItemController(c *gin.Context) {
	var itemRequest models.Item

	if err := c.ShouldBindJSON(&itemRequest); err != nil {
		log.Printf("invalid item request :%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request data"})
		return
	}
	userId, exist := c.Get("userID")
	collegeId, collegeExist := c.Get("collegeID")

	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "unauthorized"})

	}

	if !collegeExist {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "college not found"})
	}

	itemRequest.SellerID = userId.(uint)

	if collegeExist {
		collegeIDValue := collegeId.(uint)
		itemRequest.CollegeID = &collegeIDValue
	} else {
		itemRequest.CollegeID = nil
	}
	createdItem, err := services.CreateItem(itemRequest)

	if err != nil {
		log.Printf("failded to create item %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item created successfully",
		"data":    createdItem,
	})
}

func FetchAllItemsController(c *gin.Context) {
	items, err := services.FetchAllItems()
	if err != nil {
		log.Printf("Failed to fetch items: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Items fetched successfully",
		"data":    items,
	})
}

func GetItem(c *gin.Context) {
	itemIDStr := c.Param("itemID")

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	item, err := services.FetchItemByID(uint(itemID))
	if err != nil {
		if err.Error() == "item not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch item"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item fetched successfully",
		"item":    item,
	})
}

func AllCategoriesController(c *gin.Context) {

	categories, err := services.GetAllCategories()
	if err != nil {
		log.Printf("failed to get all bids:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch bids"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "fetched all categories",
		"data":    categories,
	})

}

func UpdateItem(c *gin.Context) {
	itemIDStr := c.Param("itemID")
	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var itemRequest models.Item
	if err := c.ShouldBindJSON(&itemRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	updatedItem, err := services.UpdateItem(userID.(uint), uint(itemID), itemRequest)
	if err != nil {
		if err.Error() == "you are not the seller of this item" {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not the seller of this item"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item updated successfully",
		"item":    updatedItem,
	})
}

func DeleteItem(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	itemID, err := strconv.Atoi(c.Param("itemID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	err = services.DeleteItem(uint(itemID), userID.(uint))
	if err != nil {
		if err.Error() == "you are not the seller of this item" {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not the seller of this item"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item deleted successfully",
	})
}

func FetchUserItemsController(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		log.Printf("user not authenticated,%v", exists)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}
	items, err := services.FetchUserItems(userID.(uint))
	if err != nil {
		log.Printf("failed to get user items:%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user items"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "fetched user items",
		"items":   items,
	})
}

func FetchItemsByCategoryController(c *gin.Context) {
	categoryIdStr := c.Param("categoryId")
	categoryIdInt, err := strconv.Atoi(categoryIdStr)
	if err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{"error": "invalid categoryId"})
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	categoryId := uint(categoryIdInt)

	getallItem, err := services.GetItemsByCategory(categoryId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "items fetched successfully",
		"data":    getallItem,
	})
}

// available items

func FetchAvailableItemsController(c *gin.Context) {
	availableItem, err := services.FetchAvailableItems()
	if err != nil {
		log.Printf("failed to get available items:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get available items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "fetched available items",
		"items":   availableItem,
	})
}

func FetchPopularItemsController(c *gin.Context) {

	popularItems, err := services.FetchPopularItems()
	if err != nil {
		log.Printf("failed to get popular items:%v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get popular items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "fetched popular items",
		"items":   popularItems,
	})
}
