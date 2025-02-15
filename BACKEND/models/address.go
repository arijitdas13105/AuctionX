//models/address.go
package models

import "time"

type Address struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Line      string    `json:"line"`
	City      string    `json:"city"`
	State     string    `json:"state"`
	ZipCode   uint      `json:"zipCode"`
	Country   string    `json:"country"`
	IsDefault bool      `json:"is_default"`
	CreatedAt time.Time `json:"created_at"`
}
