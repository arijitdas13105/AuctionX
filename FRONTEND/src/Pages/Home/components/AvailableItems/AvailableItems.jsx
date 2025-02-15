import React, { useEffect, useState } from "react";
import useItems from "../../../../Hooks/Items/useItems";
import AvailableItemCard from "./Components/AvailableItemCard";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  Package,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AvailableItems = () => {
  const navigate = useNavigate();
  const { availableItems, fetchAvailableItems, loading } = useItems();
  const [startIndex, setStartIndex] = useState(0);
  // const itemsPerPage = 5;
  const [itemsPerPage, setItemsPerPage] = useState(5);
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1); // Mobile: 1 item per row
      } else if (width < 768) {
        setItemsPerPage(2); // Small screens: 2 items
      } else if (width < 1024) {
        setItemsPerPage(3); // Tablets: 3 items
      } else {
        setItemsPerPage(5); // Default for larger screens
      }
    };

    updateItemsPerPage(); // Run on mount
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < availableItems?.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(availableItems?.length - itemsPerPage);
    }
  };

  const visibleItems = availableItems?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm">
        <Loader className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-green-600 font-medium text-lg">Loading...</p>
      </div>
    );
  }
  if (!availableItems || availableItems.length === 0) {
    return (
      <div className=" flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
        <Package className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium text-lg">No items available</p>
        <p className="text-gray-500 text-sm mt-1">
          Check back soon for new items
        </p>
      </div>
    );
  }

  return (
    <section className="   py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          onClick={() => navigate("/allAvailableItems")}
          className="group flex items-center justify-between mb-8 cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
              <Store className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                Available Items
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Browse currently available items for purchase
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
            View All →
          </span>
        </div>

        {/* Carousel Section */}
        <div className="relative bg-white rounded-xl shadow-sm p-6    mt-20 bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg shadow-2xl">
          <div className="flex items-center justify-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-4  ">
              {visibleItems?.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex-shrink-0 w-64 transform transition-all duration-300"
                >
                  <AvailableItemCard item={item} />
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full">
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, availableItems?.length)} of{" "}
                {availableItems?.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mx-auto max-w-2xl bg-gray-200 rounded-full h-1">
          <div
            className="bg-green-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((startIndex + itemsPerPage) / availableItems?.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AvailableItems;
