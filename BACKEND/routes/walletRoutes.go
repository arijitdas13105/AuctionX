package routes

import (
	"campusbids-backend/controllers"
	"campusbids-backend/middleware"

	"github.com/gin-gonic/gin"
)

func WalletRoutes(router *gin.Engine){
	walletGroup:=router.Group("/wallet")
	{
		walletGroup.POST("/deposit", middleware.AuthMiddleware() ,controllers.DepositAmountController)
		walletGroup.GET("/balance", middleware.AuthMiddleware() ,controllers.FetUserBalanceController)
	}
}