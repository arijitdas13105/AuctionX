// backend/kafka/bid_fetching_service.go
package kafka

import (
	"encoding/json"
	"log"

	"campusbids-backend/models"
	"campusbids-backend/utils"
)

func StartBidFetchingService() {
	StartConsumer("bidding-expiry-topic", "bid-fetching-group", func(message []byte) {
		var itemId uint
		err := json.Unmarshal(message, &itemId)
		if err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			return
		}

		log.Printf("Processing expired item ID: %d", itemId)

		var highestBid models.Bid
		query := `
			SELECT id, item_id, buyer_id, bid_price 
			FROM bids 
			WHERE item_id = ? 
			ORDER BY bid_price DESC 
			LIMIT 1`
		err = utils.DB.QueryRow(query, itemId).Scan(
			&highestBid.ID,
			&highestBid.ItemID,
			&highestBid.BuyerID,
			&highestBid.BidPrice,
		)
		if err != nil {
			log.Printf("Failed to fetch highest bid for item %d: %v", itemId, err)
			return
		}

		log.Printf("Highest bid for item %d: %+v", itemId, highestBid)

		bidMessage := map[string]interface{}{
			"itemId":   highestBid.ItemID,
			"buyerId":  highestBid.BuyerID,
			"bidPrice": highestBid.BidPrice,
		}

		err = PublishMessageToTopic("order-creation-topic", bidMessage)
		if err != nil {
			log.Printf("Failed to publish message to order-creation-topic: %v", err)
			return
		}
	})
}
