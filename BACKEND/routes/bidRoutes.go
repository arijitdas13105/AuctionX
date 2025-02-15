// routes/bidRoutes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"campusbids-backend/controllers"
	"campusbids-backend/middleware"
)


func BidRoutes(router *gin.Engine){
	itemGroup:=router.Group("/items")
	{
		itemGroup.POST("/bids",middleware.AuthMiddleware(),controllers.PlaceBid)
		itemGroup.GET("/bids/:itemID",controllers.GetBidsForItem)
		itemGroup.GET("/bids/me",middleware.AuthMiddleware(),controllers.GetAllBidsByUser)
		itemGroup.POST("/finalize-bidding", controllers.FinalizeBidsForExpiredItems) 
	}
}