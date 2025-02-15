import React from "react";
import {
  FaTimes,
  FaBox,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
} from "react-icons/fa";

function OrderDetailsModal({ orderDetails, onClose }) {
  return (
    <div className="fixed inset-0   bg-opacity-80 flex justify-center items-center p-4  scale-75 ">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out">
        {/* Header with Close Icon */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Product Information with Image */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center">
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVqR7FCOLGbqIGQ9LlW5mUDkVwaCgtlDJ4XQ&s"
            }
            alt={orderDetails?.item_title}
            className="w-36 h-36 object-cover rounded-md mr-6 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <FaBox className="mr-2 text-blue-600" size={20} /> Product
              Information
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">Title:</span>{" "}
              {orderDetails?.item_title}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Description:</span>{" "}
              {orderDetails?.item_description}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Price:</span>{" "}
              <span className="text-green-600 font-bold">
                ${orderDetails?.item_price}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize text-purple-600 font-semibold">
                {orderDetails?.item_status}
              </span>
            </p>
          </div>
        </div>

        {/* Bid Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-600" size={20} /> Bid
            Information
          </h3>
          <p className="text-gray-600">
            <span className="font-medium">Bid Price:</span>{" "}
            <span className="text-blue-600 font-bold">
              ${orderDetails?.bid_bid_price}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Bid Created At:</span>{" "}
            {new Date(orderDetails?.bid_created_at).toLocaleString()}
          </p>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <FaTruck className="mr-2 text-orange-600" size={20} /> Shipping
            Information
          </h3>
          <p className="text-gray-600">
            <span className="font-medium">Delivery Status:</span>{" "}
            <span className="capitalize text-yellow-600 font-semibold">
              {orderDetails?.delivery_status}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Shipping Address:</span>{" "}
            {orderDetails?.shipping_address_line || "Not Provided"}
          </p>
        </div>

        {/* Transaction Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <FaCreditCard className="mr-2 text-indigo-600" size={20} />{" "}
            Transaction Information
          </h3>
          <p className="text-gray-600">
            <span className="font-medium">Transaction Amount:</span>{" "}
            <span className="text-green-600 font-bold">
              ${orderDetails?.transaction_amount || "N/A"}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Payment Method:</span>{" "}
            {orderDetails?.transaction_payment_method || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Payment Status:</span>{" "}
            {orderDetails?.transaction_payment_status || "N/A"}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
