package services

import (
	"campusbids-backend/models"
	"campusbids-backend/utils"
	"database/sql"
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func CreateUser(user models.User) (models.User, error) {
	hasedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("failed to hased password", err)
	}

	query := `INSERT INTO users (name, email, password, role, college_id, created_at)
			  VALUES (?, ?, ?, ?, ?, NOW())`
	result, err := utils.DB.Exec(query, user.Name, user.Email, hasedPassword, user.Role, user.CollegeID)
	if err != nil {
		return models.User{}, err
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return models.User{}, err
	}

	var createdUser models.User
	selectQuery := `SELECT id, name, email, password, role, college_id, created_at
					FROM users WHERE id = ?`
	row := utils.DB.QueryRow(selectQuery, lastID)
	err = row.Scan(&createdUser.ID, &createdUser.Name, &createdUser.Email, &createdUser.Password, &createdUser.Role, &createdUser.CollegeID, &createdUser.CreatedAt)
	if err != nil {
		return models.User{}, err
	}

	return createdUser, nil
}

func LoginUser(loginRequest models.User) (models.User, string, error) {

	log.Println("login request🎦", loginRequest)
	var user models.User
	selectQuery := `SELECT id, name, email, password, role, college_id, created_at FROM users WHERE email = ?`
	row := utils.DB.QueryRow(selectQuery, loginRequest.Email)
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role, &user.CollegeID, &user.CreatedAt)
	if err != nil {

		if err == sql.ErrNoRows {
			return models.User{}, "", errors.New("invalid email or password")
		}

		log.Printf("Failed to query user: %v", err)
		return models.User{}, "", errors.New("internal server error")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))

	if err != nil {
		return models.User{}, "", errors.New("invalid email or password")
	}

	token, err := utils.GenerateJWT(user)
	if err != nil {
		log.Printf("Failed to generate JWT: %v", err)
		return models.User{}, "", errors.New("internal server error")
	}

	return user, token, nil
}

func FetchAllColleges() ([]models.College, error) {
	var colleges []models.College
	query := `SELECT id, name, location, created_at FROM colleges`
	rows, err := utils.DB.Query(query)

	if err != nil {
		log.Printf("failed to fetch colleges", err)
	}
	defer rows.Close()
	for rows.Next() {
		var college models.College
		err := rows.Scan(&college.ID, &college.Name, &college.Location, &college.CreatedAt)
		if err != nil {
			log.Printf("Failed to scan college row: %v", err)
			return nil, err
		}
		colleges = append(colleges, college)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows: %v", err)
		return nil, err
	}

	return colleges, nil
}

func FetchUserDetails(userId string) (models.User, error) {

	var user models.User
	selectQuery := `Select id,name,email  ,role,college_id  from users WHERE id=? `

	row := utils.DB.QueryRow(selectQuery, userId)
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CollegeID)
	if err != nil {

		if err == sql.ErrNoRows {
			return models.User{}, errors.New("user not found")
		}

		log.Printf("Failed to scan user row: %v", err)
		return models.User{}, errors.New("internal server error ")
	}

	return user, nil

}

func UpdateUser(userID uint, updateRequest models.User) (models.User, error) {
	var existingUser models.User

	query := `SELECT id, name, email, password, role, college_id, created_at FROM users WHERE id = ?`
	row := utils.DB.QueryRow(query, userID)
	if err := row.Scan(&existingUser.ID, &existingUser.Name, &existingUser.Email, &existingUser.Password, &existingUser.Role, &existingUser.CollegeID, &existingUser.CreatedAt); err != nil {
		return models.User{}, errors.New("user not found")
	}

	if updateRequest.Name != "" {
		existingUser.Name = updateRequest.Name
	}
	if updateRequest.Email != "" {
		existingUser.Email = updateRequest.Email
	}
	if updateRequest.Password != "" {
		hashedPassword, err := utils.HashPassword(updateRequest.Password)
		if err != nil {
			return models.User{}, errors.New("failed to hash password")
		}
		existingUser.Password = hashedPassword
	}

	updateQuery := `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`
	_, err := utils.DB.Exec(updateQuery, existingUser.Name, existingUser.Email, existingUser.Password, existingUser.ID)
	if err != nil {
		return models.User{}, errors.New("failed to update user details")
	}

	return existingUser, nil
}
