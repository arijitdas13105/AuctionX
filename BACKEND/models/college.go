package models

import (
	"time"
)

type College struct {
	ID        uint       `json:"id"`
	Name      string     `json:"name"`
	Location  *string    `json:"location"`
	CreatedAt *time.Time `json:"created_at"`
}
