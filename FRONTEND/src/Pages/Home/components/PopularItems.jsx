import React, { useEffect } from "react";
import useItems from "../../../Hooks/Items/useItems";
import ProductList from "./ProductList";
import PopularItemCards from "./PopularItems/PopularItemCards";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight, Package, Loader } from "lucide-react";

function PopularItems() {
  const navigate = useNavigate();
  const { popularItems, loading, fetchPopularItems } = useItems();
  useEffect(() => {
    fetchPopularItems();
  }, []);
  console.log("popularItems", popularItems);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm">
        <Loader className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-green-600 font-medium text-lg">Loading...</p>
      </div>
    );
  }
  if (!popularItems || popularItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm">
        <Package className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium text-lg">
          No popular items available
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Check back later for trending items
        </p>
      </div>
    );
  }

  console.log("loading", loading);
  return (
    <section className="   py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          onClick={() => navigate("/allPopularProducts")}
          className="group flex items-center justify-between mb-6 cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Popular Items
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Discover what other students are interested in
              </p>
            </div>
          </div>
          <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
            <span className="mr-2 text-sm font-medium">View All</span>
            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 ">
          <div className="relative">
            <PopularItemCards items={popularItems} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularItems;
