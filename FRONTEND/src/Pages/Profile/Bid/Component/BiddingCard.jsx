import React from "react";
import { FaRupeeSign } from "react-icons/fa";

function BiddingCard({ bidding }) {
  console.log("bidding", bidding);
  return (
    <div className="px-5 py-2 flex flex-col gap-2 border-2  rounded-md shadow-lg">
      <img
        className="w-[90%] h-[150px]  self-center  object-contain "
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRth4FHgoxD8tpLsEIoE4wqq_hUaSa40dnqwg&s"
        alt=""
      />
      <span className="font-bold">{bidding.item_title} </span>

      <div className="flex flex-row gap-2   items-center">
        <span className="font-bold text-sm">Price:</span>
        <div className="flex flex-row items-center text-sm">
          <FaRupeeSign className="text-green-500  text-sm" />
          <span className="text-green-500 font-medium">
            {" "}
            {bidding.item_price}
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-2   items-center">
        <span className="font-bold text-sm">Your Bid:</span>
        <div className="flex flex-row items-center text-sm">
          <FaRupeeSign className="text-green-500  text-sm" />
          <span className="text-green-500 font-medium">
            {" "}
            {bidding.bid_price}{" "}
          </span>
        </div>
      </div>

      <div>
        <span className="font-bold text-green-700">
          {" "}
          {bidding.item_status}{" "}
        </span>
      </div>

      <div className="flex flex-row gap-2 text-xs font-semibold ">
        <span className="text-gray-500">Expiry Date</span>
        <span className="text-gray-700">{bidding.item_expiry_date} </span>
      </div>
      <span className="text-white bg-blue-500 cursor-pointer px-3 py-2 rounded-md text-center font-bold">
        View Details
      </span>
    </div>
  );
}

export default BiddingCard;
