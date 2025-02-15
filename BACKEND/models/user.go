package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Role      string    `json:"role"` // "buyer" or "seller"
	CollegeID uint      `json:"college_id"`
	CreatedAt time.Time `json:"created_at"`
}
