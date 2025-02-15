// components/ProductDesign.js
import React from "react";
import {
  Clock,
  Key,
  DollarSign,
  IndianRupee,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDesign = ({ product, isLoggedIn, onBidClick }) => {
  const navigate = useNavigate();
  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return "N/A";
    return new Date(expiryDate).toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 h-[400px] lg:h-auto relative">
              <img
                src={product.image_url}
                alt={product?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium
                    ${
                      product?.status === "available"
                        ? "bg-green-100 text-green-800"
                        : product?.status === "sold"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  `}
                >
                  {product?.status}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product?.title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    IDs: {product?.id}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Current Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{product?.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Minimum Bid</p>
                      <p className="text-xl font-semibold text-green-600">
                        ₹{product?.min_bidding_price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Current Highest Bid
                      </p>
                      <p className="text-xl font-semibold text-purple-600">
                        ₹{product?.current_bid_price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Auction Ends</p>
                      <p className="text-lg font-medium text-orange-600">
                        {formatExpiryDate(product?.expiry_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700 mt-1">
                        {product?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {isLoggedIn ? (
                  <button
                    onClick={onBidClick}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <IndianRupee className="w-5 h-5" />
                    Place Your Bid
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Please Login to Bid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDesign;
