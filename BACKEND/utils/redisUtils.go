package utils

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
	"time"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	redisAddr := os.Getenv("REDIS_ADDR")
	redisUsername := os.Getenv("REDIS_USERNAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")

	RedisClient = redis.NewClient(&redis.Options{
		// Addr: "127.0.0.1:6379",
		// Password: "",
		// DB: 0, // default DB index
		// Addr:     redisHost + ":" + redisPort,
		Addr:     redisAddr,
		Username: redisUsername,
		Password: redisPassword,
		DB:       0,
	})
	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("❌Failed to connect to Redis: %v", err)
	}
	log.Println("☑️☑️Redis connection established")
}

func CacheGet(key string, result interface{}) (bool, error) {

	val, err := RedisClient.Get(Ctx, key).Result()

	if err == redis.Nil {
		return false, errors.New("key does not exist")
	} else if err != nil {
		return false, errors.New("internal server error")
	}

	err = json.Unmarshal([]byte(val), result)

	if err != nil {
		return false, err
	}
	return true, nil
}

func CacheSet(key string, value interface{}, expiration time.Duration) error {

	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return RedisClient.Set(Ctx, key, jsonData, expiration).Err()
}

func InvalidateCache(key string) error {

	err := RedisClient.Del(Ctx, key).Err()
	if err != nil {
		log.Printf("❌Error in InvalidateCache: %v for key: %s", err, key)
		return err
	}
	log.Printf("❌Cache invalidated for key: %s", key)
	return nil
}
