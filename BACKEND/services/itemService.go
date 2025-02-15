// services/itemService.go
package services

import (
	"campusbids-backend/models"
	"campusbids-backend/utils"
	"database/sql"
	// "encoding/json"
	"errors"
	"log"
	"time"
)

const cacheExpiration = 3 * time.Minute
const availbleItemCacheExpiration = 3 * time.Minute
const popularItemCacheExpiration = 3 * time.Minute

func CreateItem(itemRequest models.Item) (models.Item, error) {

	if itemRequest.Title == "" || itemRequest.Description == "" || itemRequest.Price <= 0 {
		return models.Item{}, errors.New("invalid input: title, description, and price are required")
	}
	var category models.Category
	categoryQuery := `SELECT id, name FROM categories WHERE id = ?`
	err := utils.DB.QueryRow(categoryQuery, itemRequest.CategoryID).Scan(&category.ID, &category.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("Invalid category_id: %v", itemRequest.CategoryID)
			return models.Item{}, errors.New("invalid category_id: category does not exist")
		}
		log.Printf("Failed to validate category_id: %v", err)
		return models.Item{}, errors.New("internal server error")
	}

	itemRequest.CurrentBidPrice = itemRequest.MinBiddingPrice
	insertQuery := `INSERT INTO items(seller_id, college_id, title, description, price, min_bidding_price, current_bid_price, status, image_url, created_at,category_id,expiry_date)
	 VALUES(?, IFNULL(NULLIF(?, 0), NULL), ?, ?, ?, ?, ?, ?, ?, NOW(),?, ?) `

	result, err := utils.DB.Exec(insertQuery,
		itemRequest.SellerID,
		itemRequest.CollegeID,
		itemRequest.Title,
		itemRequest.Description,
		itemRequest.Price,
		itemRequest.MinBiddingPrice,
		itemRequest.CurrentBidPrice,
		itemRequest.Status,
		itemRequest.ImageUrl,
		itemRequest.CategoryID,
		itemRequest.ExpiryDate,
	)

	if err != nil {
		log.Printf("failed to insert item :%v", err)
		return models.Item{}, errors.New("internal server errors")

	}

	lastInsertedId, err := result.LastInsertId()
	if err != nil {
		log.Printf("Failed to get last insert ID: %v", err)
		return models.Item{}, errors.New("internal server error")
	}
	itemRequest.ID = uint(lastInsertedId)
	itemRequest.CreatedAt = time.Now()

	cachekey := "available_items_cache"
	err = utils.InvalidateCache(cachekey)
	if err != nil {
		log.Printf("❌Error in InvalidateCache: %v for key: %s", err, cachekey)
	}
	log.Printf("✅Cache invalidated for key: %s", cachekey)
	cachekey = "popular_items_cache"
	err = utils.InvalidateCache(cachekey)
	if err != nil {
		log.Printf("❌Error in InvalidateCache: %v for key: %s", err, cachekey)
	}
	log.Printf("✅Cache invalidated for key: %s", cachekey)
	log.Printf("✅✅Item created with ID: %d", itemRequest.ID)

	return itemRequest, nil

}

func FetchAllItems() ([]models.Item, error) {
	var items []models.Item

	selectQuery := `SELECT id, seller_id, college_id, title, description, price,min_bidding_price,current_bid_price, status, image_url, created_at,category_id,expiry_date FROM items`
	rows, err := utils.DB.Query(selectQuery)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")
	}
	defer rows.Close()

	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.SellerID, &item.CollegeID, &item.Title, &item.Description, &item.Price, &item.MinBiddingPrice, &item.CurrentBidPrice, &item.Status, &item.ImageUrl, &item.CreatedAt, &item.CategoryID, &item.ExpiryDate)
		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
		}
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating over rows: %v", err)
		return nil, errors.New("internal server error")
	}

	return items, nil
}

func FetchItemByID(itemID uint) (models.Item, error) {
	var item models.Item

	query := `SELECT id, seller_id, college_id, title, description, price,min_bidding_price,current_bid_price, status, image_url, created_at,category_id,expiry_date
			  FROM items WHERE id = ?`

	row := utils.DB.QueryRow(query, itemID)

	err := row.Scan(&item.ID, &item.SellerID, &item.CollegeID, &item.Title, &item.Description, &item.Price, &item.MinBiddingPrice, &item.CurrentBidPrice, &item.Status, &item.ImageUrl, &item.CreatedAt, &item.CategoryID, &item.ExpiryDate)
	if err != nil {
		if err == sql.ErrNoRows {
			return item, errors.New("item not found")
		}
		log.Printf("Error fetching item details: %v", err)
		return item, errors.New("internal server error")
	}

	return item, nil
}

func UpdateItem(userID uint, itemID uint, itemRequest models.Item) (models.Item, error) {
	item, err := FetchItemByID(itemID)
	if err != nil {
		return models.Item{}, err
	}

	if item.SellerID != userID {
		return models.Item{}, errors.New("you are not the seller of this item")
	}

	if item.SellerID != userID {
		return models.Item{}, errors.New("you are not the seller of this item")
	}

	if itemRequest.Title != "" {
		item.Title = itemRequest.Title
	}
	if itemRequest.Description != "" {
		item.Description = itemRequest.Description
	}
	if itemRequest.Price > 0 {
		item.Price = itemRequest.Price
	}
	if itemRequest.MinBiddingPrice > 0 {
		item.MinBiddingPrice = itemRequest.MinBiddingPrice
	}
	if itemRequest.CurrentBidPrice > 0 {
		item.CurrentBidPrice = itemRequest.CurrentBidPrice
	}
	if itemRequest.Status != "" {
		item.Status = itemRequest.Status
	}
	if itemRequest.ImageUrl != "" {
		item.ImageUrl = itemRequest.ImageUrl
	}
	if itemRequest.CategoryID > 0 {
		item.CategoryID = itemRequest.CategoryID
	}
	if itemRequest.ExpiryDate.After(time.Time{}) {
		item.ExpiryDate = itemRequest.ExpiryDate
	}
	if itemRequest.CollegeID != nil {
		item.CollegeID = itemRequest.CollegeID
	}
	updateQuery := `UPDATE items 
	          SET title=?, description=?, price=?, min_bidding_price=?, current_bid_price=?, 
	              status=?, image_url=?, category_id=?, expiry_date=?, college_id=?
	          WHERE id=?`
	_, err = utils.DB.Exec(updateQuery, item.Title, item.Description, item.Price,
		item.MinBiddingPrice, item.CurrentBidPrice, item.Status,
		item.ImageUrl, item.CategoryID, item.ExpiryDate,
		item.CollegeID, itemID)

	if err != nil {
		log.Printf("Failed to update item: %v", err)
		return models.Item{}, errors.New("internal server error")
	}

	return item, nil
}

func DeleteItem(itemID uint, userID uint) error {
	var item models.Item
	query := `SELECT id, seller_id FROM items WHERE id = ?`
	row := utils.DB.QueryRow(query, itemID)

	err := row.Scan(&item.ID, &item.SellerID)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return errors.New("item not found")
		}
		return err
	}

	if item.SellerID != userID {
		return errors.New("you are not the seller of this item")
	}

	deleteQuery := `DELETE FROM items WHERE id = ?`
	_, err = utils.DB.Exec(deleteQuery, itemID)
	if err != nil {
		log.Printf("Failed to delete item: %v", err)
		return errors.New("failed to delete item")
	}

	return nil
}

func FetchUserItems(userID uint) ([]models.Item, error) {
	var items []models.Item

	query := `SELECT id, seller_id, college_id, title, description, price, min_bidding_price, current_bid_price, status, image_url, created_at, category_id, expiry_date 
			  FROM items WHERE seller_id = ?`

	rows, err := utils.DB.Query(query, userID)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")
	}
	defer rows.Close()

	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.SellerID, &item.CollegeID, &item.Title, &item.Description, &item.Price, &item.MinBiddingPrice, &item.CurrentBidPrice, &item.Status, &item.ImageUrl, &item.CreatedAt, &item.CategoryID, &item.ExpiryDate)

		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
		}
		items = append(items, item)
	}
	if err != rows.Err() {
		log.Printf("Error iterating over rows: %v", err)
		return nil, errors.New("internal server error")
	}
	return items, nil
}

func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category

	cacheKey := "categories_cache"

	cachedCategories, err := utils.CacheGet(cacheKey, &categories)
	log.Printf("📍cachedCategories in GetAllCategories: %v", cachedCategories)
	if err != nil {
		log.Printf("Redis CacheGet error: %v", err)
	}
	if cachedCategories {
		log.Println("Categories fetched from Redis cache")
		return categories, nil
	}

	log.Println("Cache miss: Fetching categories from DB")
	query := `SELECT id,name from categories`

	rows, err := utils.DB.Query(query)
	if err != nil {
		log.Printf("failed to query:%v", err)
		return nil, errors.New("intertnal server errror")
	}
	defer rows.Close()

	for rows.Next() {
		var category models.Category

		err := rows.Scan(&category.ID, &category.Name)

		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")

		}
		categories = append(categories, category)
	}

	if err := utils.CacheSet(cacheKey, categories, cacheExpiration); err != nil {
		log.Printf("Redis CacheSet error: %v", err)
	}
	log.Println("Categories fetched from database and cached in Redis")

	return categories, nil
}

func GetItemsByCategory(categoryId uint) ([]models.Item, error) {

	// var category models.Category
	var count int
	queryCategory := `SELECT count(*) FROM categories WHERE id =? `
	log.Printf("queryCategory:%v", queryCategory)
	err := utils.DB.QueryRow(queryCategory, categoryId).Scan(&count)
	log.Printf("count:%v", count)
	if err != nil {
		log.Printf("Failed to check category existence: %v", err)
		return nil, errors.New("internal server errorss")
	}
	if count == 0 {
		return nil, errors.New("invalid category_id: category does not exist")
	}
	var items []models.Item

	query := `SELECT id, seller_id, college_id, title, description, price,min_bidding_price,current_bid_price, status, image_url, created_at,category_id,expiry_date FROM items WHERE category_id=?`

	rows, err := utils.DB.Query(query, categoryId)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")
	}

	defer rows.Close()
	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.SellerID, &item.CollegeID, &item.Title, &item.Description, &item.Price, &item.MinBiddingPrice, &item.CurrentBidPrice, &item.Status, &item.ImageUrl, &item.CreatedAt, &item.CategoryID, &item.ExpiryDate)

		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
		}
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating over rows: %v", err)
		return nil, errors.New("internal server error")

	}
	return items, nil
}

func FetchAvailableItems() ([]models.Item, error) {
	var availableItems []models.Item

	cacheKey := "available_items_cache"
	found, err := utils.CacheGet(cacheKey, &availableItems)

	if err != nil {
		log.Printf("Redis CacheGet error: %v", err)

	}
	if found {
		log.Println("Items fetched from Redis cache")
		return availableItems, nil
	}
	log.Println("Cache miss: Fetching available items from DB")
	query := `SELECT id, seller_id, college_id, title, description, price,min_bidding_price,current_bid_price, status, image_url, created_at,category_id,expiry_date FROM items WHERE status="available"`
	rows, err := utils.DB.Query(query)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")

	}
	defer rows.Close()

	for rows.Next() {
		var item models.Item

		err := rows.Scan(
			&item.ID,
			&item.SellerID,
			&item.CollegeID,
			&item.Title,
			&item.Description,
			&item.Price,
			&item.MinBiddingPrice,
			&item.CurrentBidPrice,
			&item.Status,
			&item.ImageUrl,
			&item.CreatedAt,
			&item.CategoryID,
			&item.ExpiryDate,
		)

		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
		}
		availableItems = append(availableItems, item)
	}

	if err := utils.CacheSet(cacheKey, availableItems, availbleItemCacheExpiration); err != nil {
		log.Printf("Redis CacheSet error: %v", err)

	}

	log.Println("Items fetched from database and cached in Redis")

	return availableItems, nil
}

func FetchPopularItems() ([]map[string]interface{}, error) {
	// var items []models.Item
	var popularItems []map[string]interface{}
	const cacheKey = "popular_items_cache"
	found, err := utils.CacheGet(cacheKey, &popularItems)

	if err != nil {
		log.Printf("Redis CacheGet error: %v", err)

	}
	if found {
		log.Println("Items fetched from Redis cache")
		return popularItems, nil
	}
	log.Println("Cache miss: Fetching popular items from DB")

	query := `
		SELECT 
			i.id, 
			i.seller_id, 
			i.college_id, 
			i.title, 
			i.description, 
			i.price, 
			i.current_bid_price, 
			i.min_bidding_price, 
			i.status, 
			i.image_url, 
			i.category_id, 
			i.created_at, 
			i.expiry_date, 
			COUNT(b.id) AS bid_count 
		FROM 
			items i 
		LEFT JOIN 
			bids b 
		ON 
			i.id = b.item_id 
		WHERE 
            i.status = 'available'	
		GROUP BY 
			i.id 
		ORDER BY 
			bid_count DESC 
		LIMIT 10`

	rows, err := utils.DB.Query(query)
	log.Printf("rows.➡️➡️➡️:%v", rows)
	if err != nil {
		log.Printf("Failed to query items: %v", err)
		return nil, errors.New("internal server error")
	}

	defer rows.Close()

	// var popularItems []map[string]interface{}

	for rows.Next() {
		var item models.Item
		var bidCount int

		err := rows.Scan(&item.ID, &item.SellerID, &item.CollegeID, &item.Title, &item.Description, &item.Price, &item.CurrentBidPrice, &item.MinBiddingPrice, &item.Status, &item.ImageUrl, &item.CategoryID, &item.CreatedAt, &item.ExpiryDate, &bidCount)
		if err != nil {
			log.Printf("Failed to scan item row: %v", err)
			return nil, errors.New("internal server error")
		}
		itemMap := map[string]interface{}{
			"item":      item,
			"bid_count": bidCount,
		}
		popularItems = append(popularItems, itemMap)
	}

	if err := utils.CacheSet(cacheKey, popularItems, popularItemCacheExpiration); err != nil {
		log.Printf("Redis CacheSet error: %v", err)

	}

	log.Println("Items fetched from database and cached in Redis")

	return popularItems, nil
}
