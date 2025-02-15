//models/transaction.go
package models

import "time"

type Transaction struct {
	ID              uint    `json:"id"`
	UserID          uint    `json:"user_id"`
	ItemID          uint    `json:"item_id"`
	Amount          float64 `json:"amount"`
	PaymentStatus   string  `json:"payment_status"`
	TransactionDate string  `json:"transaction_date"`
	PaymentMethod   string  `json:"payment_method"`
	CreatedAt       time.Time `json:"created_at"`
}