// models/order.go
package models

import (
	"time"
)

type Order struct {
	ID     uint `json:"id"`
	UserID uint `json:"user_id"`
	ItemID uint `json:"item_id"`
	BidID  uint `json:"bid_id"`

	TransactionID     *uint `json:"transaction_id"`
	ShippingAddressID *uint `json:"shipping_address_id"`

	OrderDate      time.Time `json:"order_date"`
	DeliveryStatus string    `json:"delivery_status"`
	CreatedAt      time.Time `json:"created_at"`
}
