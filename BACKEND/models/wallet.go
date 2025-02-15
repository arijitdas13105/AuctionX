// models/wallet.go
package models

import "time"

type Wallet struct{
	ID              uint      `json:"id"`
    UserID          uint      `json:"user_id"`
    CurrentBalance  float64   `json:"current_balance"`
    DepositAmount   float64   `json:"deposit_amount"`
    TransactionType string    `json:"transaction_type"` // e.g., "deposit", "withdrawal", "refund"
    TransactionDate time.Time `json:"transaction_date"`
    Description     string    `json:"description"`
    CreatedAt       time.Time `json:"created_at"`
}