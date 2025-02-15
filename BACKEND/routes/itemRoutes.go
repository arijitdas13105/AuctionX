// routes/itemRoutes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"campusbids-backend/controllers"
	"campusbids-backend/middleware"
)
func ItemRoutes(router *gin.Engine){
	itemGroup:=router.Group("/items")
	{
		itemGroup.POST("/create",middleware.AuthMiddleware(),controllers.CreateItemController)
		itemGroup.GET("/allProducts",controllers.FetchAllItemsController)
		itemGroup.GET("/product/:itemID",controllers.GetItem)
		itemGroup.PUT("/updateProduct/:itemID",middleware.AuthMiddleware(),controllers.UpdateItem)
		itemGroup.DELETE("/deleteProduct/:itemID",middleware.AuthMiddleware(),controllers.DeleteItem)
		itemGroup.GET("/myProducts",middleware.AuthMiddleware(),controllers.FetchUserItemsController)
		itemGroup.GET("/categories",controllers.AllCategoriesController)
		itemGroup.GET("/categories/:categoryId",controllers.FetchItemsByCategoryController)
		itemGroup.GET("/availableItems",controllers.FetchAvailableItemsController)
		itemGroup.GET("/popularItems",controllers.FetchPopularItemsController)
	}
}