package routes

import (
	"campusbids-backend/controllers"
	"campusbids-backend/middleware"

	"github.com/gin-gonic/gin"
)

 func UserRoutes(router *gin.Engine) {
	userGroup := router.Group("/users")
	{
		userGroup.POST("/create", controllers.CreateUser)
		userGroup.POST("/login", controllers.LoginUser)
		userGroup.GET("/colleges", controllers.GetAllColleges)
		userGroup.GET("/user/:id", controllers.FetchUserDetails)
		userGroup.PUT("/user/update",middleware.AuthMiddleware(),controllers.UpdateUser)

	}
}
