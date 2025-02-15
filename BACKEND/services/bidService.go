// services/bidService.go

package services

import (
	"campusbids-backend/models"

	"campusbids-backend/utils"
	"errors"
	"log"
	"time"
)

func PlaceBid(bidRequest models.Bid) (models.Bid, error) {
	if bidRequest.BidPrice <= 0 {
		return models.Bid{}, errors.New("invalid bid price, must be greater than zero")
	}
	log.Printf("bidRequest🍟 %v", bidRequest)

	item, err := FetchItemByID(bidRequest.ItemID)
	if err != nil {
		log.Printf("invalid item,%v", err)
		return models.Bid{}, err

	}
	if bidRequest.BuyerID == item.SellerID {
		log.Printf("bidder id %v and seller id %v", bidRequest.BuyerID, item.SellerID)
		return models.Bid{}, errors.New("you cannot bid on your own item")

	}
	log.Printf("expiry time🍟 %v", item.ExpiryDate)
	currentTime := time.Now()
	log.Printf("current time⚒️ %v", currentTime)

	if currentTime.After(item.ExpiryDate) {
		log.Printf("item expired at %v of itemId %v ", item.ExpiryDate, item.ID)
		return models.Bid{}, errors.New("bidding for this item has expired")
	}
	if bidRequest.BidPrice <= item.CurrentBidPrice {
		return models.Bid{}, errors.New("your bid must be higher than current bid")
	}

	insertQuery := `INSERT INTO bids (item_id, buyer_id, bid_price, created_at) 
					VALUES (?, ?, ?, NOW())`

	result, err := utils.DB.Exec(insertQuery,
		bidRequest.ItemID,
		bidRequest.BuyerID,
		bidRequest.BidPrice,
	)

	if err != nil {
		log.Printf("Failed to place bid: %v", err)
		return models.Bid{}, errors.New("internal server error")
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Failed to get last insert ID: %v", err)
		return models.Bid{}, errors.New("internal server error")
	}

	bidRequest.ID = uint(lastInsertID)
	bidRequest.CreatedAt = time.Now()

	updateBidQuery := `UPDATE items set current_bid_price=? WHERE id=? `

	_, err = utils.DB.Exec(updateBidQuery, bidRequest.BidPrice, bidRequest.ItemID)

	if err != nil {
		log.Printf("Failed to update current bid price: %v", err)
		return models.Bid{}, errors.New("internal server error")

	}

	return bidRequest, nil
}

func GetBidsForItem(itemID uint) ([]models.Bid, error) {

	query := `SELECT id, item_id, buyer_id, bid_price, created_at FROM bids WHERE item_id=?`

	rows, err := utils.DB.Query(query, itemID)
	if err != nil {
		log.Printf("Failed to fetch bids for item %d: %v", itemID, err)
		return nil, errors.New("internal server error")
	}
	defer rows.Close()
	var bids []models.Bid

	for rows.Next() {
		var bid models.Bid
		err := rows.Scan(&bid.ID, &bid.ItemID, &bid.BuyerID, &bid.BidPrice, &bid.CreatedAt)
		if err != nil {
			log.Printf("Failed to scan bid row: %v", err)
			return nil, errors.New("internal server error")
		}
		bids = append(bids, bid)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows for bids: %v", err)
		return nil, errors.New("internal server error")
	}

	return bids, nil

}

func FetchAllBidsByUser(userID uint) ([]map[string]interface{}, error) {

	// query:=`SELECT id, item_id, buyer_id, bid_price, created_at FROM bids WHERE item_id=?`
	query := `SELECT B.id AS bid_id, B.item_id, B.buyer_id, B.bid_price, B.created_at,
	i.title AS item_title, 
	i.description AS item_description, 
	i.image_url AS item_image_url, 
	i.status AS item_status,
	i.price AS item_price,
	i.expiry_date AS item_expiry_date

	FROM bids B
	JOIN items i
	ON B.item_id = i.id
	WHERE B.buyer_id = ?
	`
	rows, err := utils.DB.Query(query, userID)
	if err != nil {
		log.Printf("Failed to fetch bids for user %d: %v", userID, err)
		return nil, errors.New("internal server error")
	}
	defer rows.Close()
	var bidsWithItems []map[string]interface{}

	for rows.Next() {

		var bidId, itemId, buyerId uint
		var bidPrice float64
		var createdAt time.Time
		var itemTitle, itemDescription, itemImageUrl, itemStatus string
		var itemPrice float64
		var itemExpiryDate time.Time

		err := rows.Scan(&bidId, &itemId, &buyerId, &bidPrice, &createdAt, &itemTitle, &itemDescription, &itemImageUrl, &itemStatus, &itemPrice, &itemExpiryDate)
		if err != nil {
			log.Printf("Failed to scan bid row: %v", err)
			return nil, errors.New("internal server error")
			continue
		}

		bidItem := map[string]interface{}{
			"bid_id":           bidId,
			"item_id":          itemId,
			"buyer_id":         buyerId,
			"bid_price":        bidPrice,
			"created_at":       createdAt,
			"item_title":       itemTitle,
			"item_description": itemDescription,
			"item_image_url":   itemImageUrl,
			"item_status":      itemStatus,
			"item_price":       itemPrice,
			"item_expiry_date": itemExpiryDate,
		}
		bidsWithItems = append(bidsWithItems, bidItem)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows for bids: %v", err)
		return nil, errors.New("internal server error")
	}

	return bidsWithItems, nil

}
