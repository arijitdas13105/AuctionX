import React, { useState } from "react";

const BidModal = ({
  isOpen,
  onClose,
  onSubmit,
  minBid,
  bidPriceValue,
  setBidPriceValue,
  error,
}) => {
  const handleConfirm = () => {
    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4 shadow-xl transform transition-all">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Place Your Bid
        </h2>

        {/* Input Field */}
        <div className="mb-6">
          <label
            htmlFor="bidPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Bid Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              id="bidPrice"
              className="pl-7 block w-full rounded-lg border border-blue-500"
              placeholder="0.00"
              value={bidPriceValue}
              onChange={(e) => setBidPriceValue(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Minimum bid: ₹{minBid}</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-3 font-bold text-white rounded-lg transition-colors duration-200 ${
              bidPriceValue
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!bidPriceValue}
          >
            Confirm Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
