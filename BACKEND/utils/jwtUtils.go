package utils

import (
	"campusbids-backend/models"
	"errors"
 	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"log"
)

var jwtSecret = []byte("my_secret_key")  

 func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"role":       user.Role,
		"college_id": user.CollegeID,
		// "exp":        time.Now().Add(time.Hour * 24).Unix(), // Token expiry: 24 hours
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateJWT(tokenString string)(uint,uint,error){
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return jwtSecret, nil
	})

	if err!=nil{
		return 0,0,err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		 

		userID, ok  := claims["id"].(float64) 
		collegeID,ok1:=claims["college_id"].(float64)
		if !ok || !ok1 {
			return 0,0,errors.New("invalid token")
		}
		return uint(userID), uint(collegeID), nil
	}
	return 0,0, errors.New("invalid token")

}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return "", err
	}
	return string(hashedPassword), nil
}

 func CheckPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

 