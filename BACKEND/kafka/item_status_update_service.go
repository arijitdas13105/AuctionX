// backend/kafka/item_status_update_service.go
package kafka

import (
	"encoding/json"
	"log"

	"campusbids-backend/utils"
)

func StartItemStatusUpdateService() {
	StartConsumer("item-status-update-topic", "item-status-update-group", func(message []byte) {
		var data map[string]interface{}
		err := json.Unmarshal(message, &data)
		if err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			return
		}

		orderId := int64(data["orderId"].(float64))
		log.Printf("Processing order ID: %d", orderId)
		itemId := uint(data["itemId"].(float64))

		log.Printf("Updating status for item %d to 'sold'", itemId)

		// Update the item status to "sold"
		query := `UPDATE items SET status = 'sold' WHERE id = ?`
		_, err = utils.DB.Exec(query, itemId)
		if err != nil {
			log.Printf("Failed to update item status: %v", err)
			return
		}

		log.Printf("Item %d status updated to 'sold'", itemId)
	})
}
