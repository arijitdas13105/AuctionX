import React from "react";
import { FaLocationDot } from "react-icons/fa6";

function AddressCard({ address,onEdit,addressDelete }) {
  console.log("address", address);

  return (
    <div className="flex  flex-col p-3 gap-3 border shadow-md rounded-md  ">
      <div>
        <span>🏠{address.line}</span>
        <div className="flex flex-row gap-1 items-center">
          <FaLocationDot className="text-red-500" />
          <div className="text-gray-500 flex flex-row gap-1  items-center">
            <span>{address.city},</span>
            <span>{address.state},</span>
            <span>{address.country},</span>
            <span>{address.zipCode}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        {address.is_default ? (
          <span className="bg-green-400 px-4 py-1 rounded-lg  text-white text-center">
            default
          </span>
        ) : (
          <span className="  px-4 py-1   invisible   ">default</span>
        )}
        <div className="flex flex-row gap-3 ">
          <span  onClick={onEdit} className="bg-orange-400 px-4 py-1  rounded-lg  text-white text-center">
            Edit
          </span>
          <span onClick={()=>addressDelete(address.id)} className="bg-red-900 px-4 py-1 rounded-lg  text-white text-center">
            Delete
          </span>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
