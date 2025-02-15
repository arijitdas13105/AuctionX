package routes

import (
	"campusbids-backend/controllers"

	"github.com/gin-gonic/gin"
	"campusbids-backend/middleware"

)

func OrderRoutes(router *gin.Engine){
	orderGroup:=router.Group("/orders")
{
		orderGroup.GET("/userOrders",middleware.AuthMiddleware(),controllers.GetUserOrders)
		orderGroup.GET("/orderDetails/:id",middleware.AuthMiddleware(),controllers.OrderDetails)
	}
}