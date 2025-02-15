package services

import (
	kafka "campusbids-backend/Kafka"
	"database/sql"

	"campusbids-backend/utils"
	"errors"
	"time"

	"log"
)

func FinalizeBiddingForExpiredItems() error {
	query := `SELECT id FROM items WHERE expiry_date < NOW() AND status != 'sold'`

	rows, err := utils.DB.Query(query)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var itemId uint
		err := rows.Scan(&itemId)
		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			continue
		}

		err = kafka.PublishMessageToTopic("bidding-expiry-topic", itemId)
		if err != nil {
			log.Printf("Failed to publish item %d to Kafka: %v", itemId, err)
			continue
		}
	}

	return nil
}

func FetchUserOrders(userID uint) ([]map[string]interface{}, error) {
	query := `SELECT o.id AS order_id, o.user_id, o.item_id, o.bid_id, o.transaction_id, o.shipping_address_id, o.order_date, o.delivery_status, o.created_at AS order_created_at, 
			i.title AS item_title, i.description AS item_description, i.image_url AS item_image_url, i.status AS item_status, i.price AS item_price
			 FROM 
			 	orders o 
			 JOIN 
			 	items i
			ON 
				o.item_id = i.id
			WHERE 
				o.user_id = ?`

	rows, err := utils.DB.Query(query, userID)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")
	}
	defer rows.Close()

	var ordersWithItems []map[string]interface{}
	for rows.Next() {
		var orderId, userId, itemId, bidId uint
		var transactionId, shippingAddressId *uint
		var orderDate, orderCreatedAt time.Time
		var deliveryStatus, itemTitle, itemDescription, itemImageUrl, itemStatus string
		var itemPrice float64

		err := rows.Scan(&orderId, &userId, &itemId, &bidId, &transactionId, &shippingAddressId, &orderDate, &deliveryStatus, &orderCreatedAt, &itemTitle, &itemDescription, &itemImageUrl, &itemStatus, &itemPrice)
		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
			continue
		}
		orderWithItem := map[string]interface{}{
			"order_id":            orderId,
			"user_id":             userId,
			"item_id":             itemId,
			"bid_id":              bidId,
			"transaction_id":      transactionId,
			"shipping_address_id": shippingAddressId,
			"order_date":          orderDate,
			"delivery_status":     deliveryStatus,
			"order_created_at":    orderCreatedAt,
			"item_title":          itemTitle,
			"item_description":    itemDescription,
			"item_image_url":      itemImageUrl,
			"item_status":         itemStatus,
			"item_price":          itemPrice,
		}
		ordersWithItems = append(ordersWithItems, orderWithItem)

	}

	return ordersWithItems, nil
}

func FetchOrderDetails(orderId uint) (map[string]interface{}, error) {
	query := `SELECT o.id AS order_id, o.user_id, o.item_id, o.bid_id, o.transaction_id, o.shipping_address_id, o.order_date, o.delivery_status, o.created_at AS order_created_at, 
			i.title AS item_title, i.description AS item_description, i.image_url AS item_image_url, i.status AS item_status, i.price AS item_price,
			b.buyer_id AS bid_buyer_id, b.bid_price AS bid_bid_price, b.created_at AS bid_created_at,
			s.line AS shipping_address_line, s.city AS shipping_address_city, s.state AS shipping_address_state, s.zipCode AS shipping_address_zip_code, s.country AS shipping_address_country,
			t.amount AS transaction_amount,t.payment_status AS transaction_payment_status,t.transaction_date AS transaction_transaction_date, t.payment_method AS transaction_method  ,t.payment_method AS transaction_payment_method , t.created_at AS transaction_created_at

			 FROM 
			 	orders o 
			 JOIN 
			 	items i
			ON 
				o.item_id = i.id
			LEFT JOIN 
			 	bids b
			ON 
				o.bid_id = b.id
			LEFT JOIN 
			 	addresses s
			ON 
				o.shipping_address_id = s.id
			LEFT JOIN 
			 	transactions t
			ON 
				o.transaction_id = t.id
			WHERE 
				o.id = ?`

	row := utils.DB.QueryRow(query, orderId)

	var orderIdVal, userId, itemId, bidId uint
	var transactionId, shippingAddressId *uint
	var orderDate, orderCreatedAt, bidCreatedAt time.Time
	var deliveryStatus, itemTitle, itemDescription, itemImageUrl, itemStatus string
	var bidBidPrice, itemPrice float64
	var bidBuyerId *uint
	var shippingAddressLine, shippingAddressCity, shippingAddressState, shippingAddressZipCode, shippingAddressCountry *string
	var transactionAmount, transactionPaymentStatus, transactionTransactionDate, transactionMethod, transactionPaymentMethod, transactionCreatedAt *string

	err := row.Scan(
		&orderIdVal, &userId, &itemId, &bidId, &transactionId, &shippingAddressId, &orderDate, &deliveryStatus, &orderCreatedAt,
		&itemTitle, &itemDescription, &itemImageUrl, &itemStatus, &itemPrice,
		&bidBuyerId, &bidBidPrice, &bidCreatedAt,
		&shippingAddressLine, &shippingAddressCity, &shippingAddressState, &shippingAddressZipCode, &shippingAddressCountry,
		&transactionAmount, &transactionPaymentStatus, &transactionTransactionDate, &transactionMethod, &transactionPaymentMethod, &transactionCreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("order not found")
		}
		log.Printf("Failed to scan order row: %v", err)
		return nil, errors.New("internal server error")
	}
	orderWithItem := map[string]interface{}{
		"order_id":                     orderIdVal,
		"user_id":                      userId,
		"item_id":                      itemId,
		"bid_id":                       bidId,
		"transaction_id":               transactionId,
		"shipping_address_id":          shippingAddressId,
		"order_date":                   orderDate,
		"delivery_status":              deliveryStatus,
		"order_created_at":             orderCreatedAt,
		"item_title":                   itemTitle,
		"item_description":             itemDescription,
		"item_image_url":               itemImageUrl,
		"item_status":                  itemStatus,
		"item_price":                   itemPrice,
		"bid_buyer_id":                 bidBuyerId,
		"bid_bid_price":                bidBidPrice,
		"bid_created_at":               bidCreatedAt,
		"shipping_address_line":        shippingAddressLine,
		"shipping_address_city":        shippingAddressCity,
		"shipping_address_state":       shippingAddressState,
		"shipping_address_zip_code":    shippingAddressZipCode,
		"shipping_address_country":     shippingAddressCountry,
		"transaction_amount":           transactionAmount,
		"transaction_payment_status":   transactionPaymentStatus,
		"transaction_transaction_date": transactionTransactionDate,
		"transaction_method":           transactionMethod,
		"transaction_payment_method":   transactionPaymentMethod,
		"transaction_created_at":       transactionCreatedAt,
	}

	return orderWithItem, nil
}
