import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Clock, DollarSign, IndianRupee, Tag, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function AvailableItemCard({ item }) {
    const navigate=useNavigate()

    const handleNavigate=(id)=>{
        navigate(`/products/${id}`)
    }
  return (
    <div
    onClick={() => handleNavigate(item.id)}
      className="relative cursor-pointer shadow-lg    h-72 w-64   bg-white  rounded-md overflow-visible group"
    >
      {/* Image Container */}
      <div className="absolute -top-20   w-[70%] left-1/2 transform -translate-x-1/2 ">
        <img
          src={item.image_url}
          alt={item.title}
          className="object-cover h-40 w-full   rounded-full  border-2 border-gray-400 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
        <span className="font-bold text-xl">{item.title}</span>
      </div>

      {/* Line */}
      <hr className="absolute bottom-16 border-t border-gray-400 w-[90%] px-2 transform  translate-x-3" />

      {/* Content */}
      <div className="absolute bottom-4    px-2 flex flex-row justify-between  w-full">
        <div className="flex flex-row     items-center">
                 <FaRupeeSign className='text-green-500  text-md'/>
          <span className='text-green-500 text-md font-medium'>{item.current_bid_price} Bidding </span>
        </div>
        <div className="flex flex-row  gap-1    items-center">
            <Clock className="w-5 h-5 text-md text-orange-500" />
            {/* <span className="text-md font-medium text-orange-600">24-12-2025    </span> */}
            <span className="text-md font-medium text-orange-600">{format(item.expiry_date, "dd-MM-yyyy") }   </span>
        </div>
      </div>
    </div>
  );
}

export default AvailableItemCard;