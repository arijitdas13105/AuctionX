package main

import (
	"campusbids-backend/routes"
	"campusbids-backend/utils"
	"log"
	"net/http"
	"path/filepath"

	kafka "campusbids-backend/Kafka"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {

	ex, err := filepath.Abs("../")
	if err != nil {
		log.Fatalf("Error finding absolute path: %v", err)
	}
	log.Println("ex path:🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️", ex)
	if err := godotenv.Load(filepath.Join(ex, ".env")); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	utils.InitDB()
	utils.InitRedis()
	defer utils.CloseDB()
	// go kafka.StartConsumers()
	kafka.InitProducer()

	go kafka.StartBidFetchingService()
	go kafka.StartOrderCreationService()
	go kafka.StartItemStatusUpdateService()
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello Golang, I am coming!2225ss6",
		})
	})
	routes.UserRoutes(r)
	routes.ItemRoutes(r)
	routes.BidRoutes(r)
	routes.OrderRoutes(r)
	routes.AddressRoutes(r)
	routes.WalletRoutes(r)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "https://campusbids-frontend.vercel.app"},
		// AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	httpHandler := corsHandler.Handler(r)
	if err := http.ListenAndServe(":8080", httpHandler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}

}
