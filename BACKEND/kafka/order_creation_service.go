// backend/kafka/order_creation_service.go
package kafka

import (
	"encoding/json"
	"log"
	"time"

	"campusbids-backend/models"
	"campusbids-backend/utils"
)

func StartOrderCreationService() {
	StartConsumer("order-creation-topic", "order-creation-group", func(message []byte) {
		var data map[string]interface{}
		err := json.Unmarshal(message, &data)
		if err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			return
		}

		itemId := uint(data["itemId"].(float64))
		buyerId := uint(data["buyerId"].(float64))
		bidPrice := data["bidPrice"].(float64)

		log.Printf("Creating order for item %d, buyer %d, bid price %f", itemId, buyerId, bidPrice)

		var bid models.Bid
		query := `
			SELECT id 
			FROM bids 
			WHERE item_id = ? AND buyer_id = ? AND bid_price = ? 
			LIMIT 1`
		err = utils.DB.QueryRow(query, itemId, buyerId, bidPrice).Scan(&bid.ID)
		if err != nil {
			log.Printf("Failed to fetch bid ID: %v", err)
			return
		}

		order := models.Order{
			UserID:    buyerId,
			ItemID:    itemId,
			BidID:     bid.ID,
			OrderDate: time.Now(),
			CreatedAt: time.Now(),
		}

		insertQuery := `
			INSERT INTO orders (user_id, item_id, bid_id, order_date, created_at) 
			VALUES (?, ?, ?, ?, ?)`
		result, err := utils.DB.Exec(insertQuery, order.UserID, order.ItemID, order.BidID, order.OrderDate, order.CreatedAt)
		if err != nil {
			log.Printf("Failed to create order: %v", err)
			return
		}

		orderId, _ := result.LastInsertId()
		log.Printf("Order created with ID: %d", orderId)

		orderMessage := map[string]interface{}{
			"orderId": orderId,
			"itemId":  itemId,
		}
		err = PublishMessageToTopic("item-status-update-topic", orderMessage)
		if err != nil {
			log.Printf("Failed to publish message to item-status-update-topic: %v", err)
			return
		}
	})
}
