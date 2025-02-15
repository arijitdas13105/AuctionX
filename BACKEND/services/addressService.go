package services

import (
	"campusbids-backend/models"
	"campusbids-backend/utils"
	"errors"
	"log"
	"time"
)

func CreateAddress(addressRequest models.Address)(models.Address ,error) {
	
	if addressRequest.City==""||addressRequest.Country==""||addressRequest.Line==""||addressRequest.State==""{
		return models.Address{},errors.New("invalid input ")
	}

	insertQuery:=`INSERT INTO addresses (user_id, line, city, state, zipCode, country, is_default, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	result,err:=utils.DB.Exec(insertQuery,
		addressRequest.UserID,
		addressRequest.Line,
		addressRequest.City,
		addressRequest.State,
		addressRequest.ZipCode,
		addressRequest.Country,
		addressRequest.IsDefault,
		time.Now(),
	)

	if err!=nil{
		log.Printf("error to insert address:%v",err)
		return models.Address{},errors.New("internal server errror ")
	}

	lastInsertedId,err:=result.LastInsertId()

	if err!=nil{
		log.Printf("failed to get the last inserted id :%v",err)
		return models.Address{},errors.New("internal server error ")
	}
	addressRequest.ID=uint(lastInsertedId)
	addressRequest.CreatedAt=time.Now()

	return addressRequest,nil
}

func FetchUserAddress(userId uint)([]models.Address ,error){
	var userAlladdress []models.Address

	query:=`SELECT id ,user_id, line, city, state, zipCode, country, is_default, created_at FROM addresses WHERE user_id=?`
	rows,err:=utils.DB.Query(query,userId)

	if err!=nil{
		log.Printf("failed to get the addresss:%v",err)
		return nil,errors.New("failed to get the user address")
	}

	defer rows.Close()

	for rows.Next(){
		var adress models.Address

		err:=rows.Scan(&adress.ID,&adress.UserID,&adress.Line,&adress.City,&adress.State,&adress.ZipCode,&adress.Country,&adress.IsDefault,&adress.CreatedAt)
		if err!=nil{
			log.Printf("failed to scan address:%v",err)
			return nil,errors.New("internal server error")
		}
		userAlladdress=append(userAlladdress,adress)
	}

	if err!=nil{
		log.Printf("Error iterating over rows: %v", err)
		return nil, errors.New("internal server error")
	}
	return userAlladdress,nil
}



func EditedAddress(addressRequest models.Address)(models.Address ,error){
	if addressRequest.City == "" || addressRequest.Country == "" || addressRequest.Line == "" || addressRequest.State == "" {
		return models.Address{}, errors.New("invalid input")
	}

	updateQuery := `UPDATE addresses SET line=?, city=?, state=?, zipCode=?, country=?, is_default=? WHERE id=? AND user_id=?`

	_, err := utils.DB.Exec(updateQuery,
		addressRequest.Line,
		addressRequest.City,
		addressRequest.State,
		addressRequest.ZipCode,
		addressRequest.Country,
		addressRequest.IsDefault,
		addressRequest.ID,
		addressRequest.UserID,
	)

	if err != nil {
		log.Printf("error updating address: %v", err)
		return models.Address{}, errors.New("internal server error")
	}

	return addressRequest, nil
}
func DeleteAddressService(addressId uint ,userId uint)(error){

	deleteQuery:=`DELETE FROM addresses WHERE id=? AND user_id=?`
	result,err:=utils.DB.Exec(deleteQuery,addressId,userId)

	if err!=nil{
		log.Printf("failed to delete address:%v",err)
		return errors.New("failed to delete address")
	}

	rowsAffected,err:=result.RowsAffected()

	if err!=nil{
		log.Printf("failed to get the rows affected:%v",err)
		return errors.New("internal server error")
	}
	 
	if rowsAffected==0{
		return errors.New("address not found")
	}
	return nil
}