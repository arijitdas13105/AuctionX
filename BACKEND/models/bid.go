 

//models/bid.go
package models

import (
	"time"
)

type Bid struct {
    ID        uint      `json:"id"`
    ItemID    uint      `json:"item_id"`
    BuyerID   uint      `json:"buyer_id"`
    BidPrice  float64   `json:"bid_price"`
    CreatedAt time.Time `json:"created_at"`
    
}
