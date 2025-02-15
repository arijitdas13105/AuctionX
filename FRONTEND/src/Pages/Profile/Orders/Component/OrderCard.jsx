import React, { useState } from "react";
import { ImPriceTags } from "react-icons/im";
import { TbTruckDelivery } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import useOrder from "../../../../Hooks/order/useOrder";
import OrderDetailsModal from "./OrderDetailsModal";

function OrderCard({ orderId, name, price, status, orderDate, imageUrl }) {
  const { fetchOrderDetails } = useOrder();
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);

  const handleOrderDetailsClick = async (orderID) => {
    setIsOrderDetailsOpen(true);
    try {
      const result = await fetchOrderDetails(orderID);
      setViewOrderDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Delivered: "bg-green-100 text-green-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row w-full">
          {/* Image Container */}
          <div className="w-full md:w-1/3 h-48 md:h-52 relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              src={
                imageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVqR7FCOLGbqIGQ9LlW5mUDkVwaCgtlDJ4XQ&s"
              }
              // src= "https://photographyproject.uk/wp-content/uploads/2024/01/06-3416-post/canon-camera-e1704554602159.jpg"
              alt={name}
            />
          </div>

          {/* Content Container */}
          <div className="w-full md:w-2/3 p-6">
            <div className="flex flex-col h-full justify-between gap-4">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <AiFillProduct className="text-emerald-600 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImPriceTags className="text-emerald-600 text-xl" />
                    <span className="text-lg font-bold text-gray-900">
                      ${price}
                    </span>
                  </div>
                </div>

                {/* Status and Date */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-emerald-600" />
                    <span className="text-sm text-gray-600">
                      Ordered on {orderDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbTruckDelivery className="text-emerald-600 text-xl" />
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handleOrderDetailsClick(orderId)}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium
                         hover:bg-emerald-700 active:bg-emerald-800 
                         transition-colors duration-200 transform hover:scale-[1.02]"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOrderDetailsOpen && viewOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <OrderDetailsModal
              orderDetails={viewOrderDetails}
              onClose={() => setIsOrderDetailsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
