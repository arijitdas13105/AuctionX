import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/utils';
import { addMinutes, subMinutes, format, set } from "date-fns";

const UseItemCreateFn = () => {
    const [allCategories, setAllCategories] = useState([]);
      const [imageUrl, setImageUrl] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const getCategories = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/items/categories`);
          const categoryData = response?.data?.data;
          setAllCategories(categoryData);
          console.log("allCategories in UseItemCreateFn", categoryData);
        } catch (error) {
          console.log(error);
        }
      };
      // const formatDateWithDateFns=(expiryDate)=>{
      //   console.log("expiryDate✅", expiryDate);

      //   // {expiryDate && console.log("expiryDate hapened✅", expiryDate)}
      
      //     const istDate = new Date(expiryDate);

      //     // Subtract 5 hours and 30 minutes (330 minutes) to convert IST to UTC
      //     const utcDate = subMinutes(istDate, 330); // 5 * 60 + 30 = 330 minutes
  
      //     console.log("utcTime❌", utcDate);
      //     const formatted = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
      //     console.log("formatted.🏠", formatted);
      //     return formatted;
        

      //   // const utcDate = new Date(
      //   //   expiryDate.getTime() - expiryDate.getTimezoneOffset() * 60000
      //   // ); // Convert to UTC
      //   // Parse the IST date string into a Date object

      //   // const istDate = new Date(expiryDate);

      //   // // Subtract 5 hours and 30 minutes (330 minutes) to convert IST to UTC
      //   // const utcDate = subMinutes(istDate, 330); // 5 * 60 + 30 = 330 minutes

      //   // console.log("utcTime❌", utcDate);
      //   // const formatted = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
      //   // console.log("formatted.🏠", formatted);
      //   // return formatted;
      // }


      const formatDateWithDateFns = (expiryDate) => {
        if (!expiryDate) return;  // If expiryDate is falsy, exit early
    
        console.log("expiryDate✅", expiryDate);
        
        const istDate = new Date(expiryDate);
        const utcDate = subMinutes(istDate, 330);  
    
        console.log("utcTime❌", utcDate);
    
        const formatted = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        console.log("formatted.🏠", formatted);
    
        return formatted;
    };
    

    const imageUpload = async (formData) => {
      try {
        setImageLoading(true);
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/duqgqajbf/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );
    
          const data = await response.json();
          setImageUrl(data.secure_url);
          setImageLoading(false);
      } catch (error) {
        console.log(error);
      }
    }     
      // useEffect(() => {
      //   getCategories();
      // }, []);

      return {allCategories, getCategories,formatDateWithDateFns,imageUpload,imageUrl,setImageUrl,imageLoading}
}

export default UseItemCreateFn