package services

import (
	"campusbids-backend/models"
	"campusbids-backend/utils"
	"database/sql"
	"errors"
	"log"
	"time"
)

func DepositAmount(userID uint, amount float64, description string) (models.Wallet, error) {
	var wallet models.Wallet
	currentTime := time.Now()

	err := utils.DB.QueryRow("SELECT id, current_balance FROM wallets WHERE user_id = ?", userID).
		Scan(&wallet.ID, &wallet.CurrentBalance)

	if err != nil {
		if err == sql.ErrNoRows {
			_, err := utils.DB.Exec(`
				INSERT INTO wallets (user_id, current_balance, deposit_amount, transaction_type, transaction_date, description, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				userID, amount, amount, "deposit", currentTime, description, currentTime,
			)
			if err != nil {
				log.Printf("Failed to create wallet: %v", err)
				return models.Wallet{}, errors.New("failed to create wallet")
			}

			wallet = models.Wallet{
				UserID:          userID,
				CurrentBalance:  amount,
				DepositAmount:   amount,
				TransactionType: "deposit",
				TransactionDate: currentTime,
				Description:     description,
				CreatedAt:       currentTime,
			}
			return wallet, nil
		}
		log.Printf("Error fetching wallet: %v", err)
		return models.Wallet{}, errors.New("internal server error")
	}

	newBalance := wallet.CurrentBalance + amount
	_, err = utils.DB.Exec(`
		UPDATE wallets 
		SET current_balance = ?, deposit_amount = ?, transaction_type = ?, transaction_date = ?, description = ?, created_at = ?
		WHERE user_id = ?`,
		newBalance, amount, "deposit", currentTime, description, currentTime, userID,
	)

	if err != nil {
		log.Printf("Failed to update wallet: %v", err)
		return models.Wallet{}, errors.New("failed to update wallet balance")
	}

	wallet.CurrentBalance = newBalance
	wallet.DepositAmount = amount
	wallet.TransactionType = "deposit"
	wallet.TransactionDate = currentTime
	wallet.Description = description
	wallet.CreatedAt = currentTime

	return wallet, nil
}

func FetchUserBalance(userID uint) (float64, error) {
	var balance float64
	err := utils.DB.QueryRow("SELECT current_balance FROM wallets WHERE user_id = ?", userID).Scan(&balance)
	if err != nil {
		log.Printf("Failed to fetch user balance: %v", err)
		return 0, errors.New("internal server error")
	}
	return balance, nil
}
