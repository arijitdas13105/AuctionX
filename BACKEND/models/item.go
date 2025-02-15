// models//item.go
package models

import (
	"time"
)

type Item struct {
	ID              uint      `json:"id"`
	SellerID        uint      `json:"seller_id"`
	CollegeID       *uint     `json:"college_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Price           float64   `json:"price"`
	CurrentBidPrice float64   `json:"current_bid_price"`
	MinBiddingPrice float64   `json:"min_bidding_price"`
	Status          string    `json:"status"`
	ImageUrl        string    `json:"image_url"`
	CategoryID      uint      `json:"category_id"`
	CreatedAt       time.Time `json:"created_at"`
	ExpiryDate      time.Time `json:"expiry_date"`
}
