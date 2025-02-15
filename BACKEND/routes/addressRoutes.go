package routes

import (
	"campusbids-backend/controllers"
	"campusbids-backend/middleware"

	"github.com/gin-gonic/gin"
)

func AddressRoutes(router *gin.Engine){
	addressGroup:=router.Group("/address")
	{
		addressGroup.POST("/addAddress",middleware.AuthMiddleware(),controllers.AddAddress)
		addressGroup.GET("/userAddress",middleware.AuthMiddleware(),controllers.GetUserAddress)
		addressGroup.PUT("/editAddress/:id",middleware.AuthMiddleware(),controllers.EditAddress)
		addressGroup.DELETE("/deleteAddress/:id",middleware.AuthMiddleware(),controllers.DeleteAddress)
	}
}