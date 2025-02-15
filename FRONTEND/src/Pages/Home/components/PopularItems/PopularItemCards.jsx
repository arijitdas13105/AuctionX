import React, { useEffect, useState } from "react";
import {
  FaCircleArrowLeft,
  FaCircleArrowRight,
  FaHeart,
} from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PopularItemCards({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = (currentIndex - 1 + items?.length) % items?.length;
  const nextIndex = (currentIndex + 1) % items?.length;
  const navigate = useNavigate();
  // Auto-rotate logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items?.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [items?.length]);

  const handleNavigate = (id) => {
    navigate(`/products/${id}`);
  };
  return (
    <div className="   flex flex-row px-10 gap-10  items-center justify-center py-8   bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg shadow-2xl">
      {/* Previous Card */}
      <motion.div
        className="flex flex-col border-2 border-green-500 w-64 h-80 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-[4] overflow-hidden relative">
          <AnimatePresence>
            <motion.img
              key={prevIndex}
              className="h-full w-full object-cover border"
              src={
                items[prevIndex]?.item?.image_url ||
                "https://via.placeholder.com/300"
              }
              alt=""
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
        <div className="overflow-hidden p-3 flex flex-col gap-2 bg-white">
          <h2 className="font-bold text-lg">
            {items[prevIndex]?.item?.title || "N/A"}
          </h2>
          <p className="font-bold text-green-600">
            ${items[prevIndex]?.item?.price || "N/A"}
          </p>
          <button
            onClick={() => handleNavigate(items[prevIndex]?.item?.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
          >
            <FaShoppingCart className="text-sm" /> View Product
          </button>
        </div>
      </motion.div>

      {/* Current (Middle) Card */}
      <div className="relative border-x-4  border-[#ab0c98]  rounded-lg ">
        <motion.div
          className="flex flex-col  h-96 w-64 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence>
              <motion.img
                key={currentIndex} // Forces animation on change
                className="h-full w-full object-cover border"
                src={
                  items[currentIndex]?.item?.image_url ||
                  "https://via.placeholder.com/300"
                }
                alt=""
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>
          <FaCircleArrowLeft
            onClick={() => setCurrentIndex(nextIndex)}
            className="cursor-pointer absolute text-blue-800 font-bold text-5xl bottom-[50%] -left-8 hover:scale-110 transition-transform duration-300 ease-in-out  "
          />
          <FaCircleArrowRight
            onClick={() => setCurrentIndex(prevIndex)}
            className="cursor-pointer absolute text-red-800 font-bold text-5xl bottom-[50%] -right-8 hover:text-red-900 hover:scale-110 transition-transform duration-300 "
          />
          <div className="overflow-hidden p-3 flex flex-col gap-2 bg-white">
            <h2 className="font-bold text-lg">
              {items[currentIndex]?.item?.title || "N/A"}
            </h2>
            <p className="font-bold text-green-600">
              ${items[currentIndex]?.item?.price || "N/A"}
            </p>
            <button
              //    onClick={()=>navigate(`/products/${items[currentIndex]?.item?.id}`)}
              onClick={() => handleNavigate(items[currentIndex]?.item?.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
            >
              <FaShoppingCart className="text-sm" /> View Product
            </button>
          </div>
        </motion.div>
      </div>

      {/* Next Card */}
      <motion.div
        className="flex flex-col border-2 border-green-500 w-64 h-80 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-[4] overflow-hidden relative rounded-lg">
          <AnimatePresence>
            <motion.img
              key={nextIndex} // Forces animation on change
              className="h-full w-full object-cover border  "
              src={
                items[nextIndex]?.item?.image_url ||
                "https://via.placeholder.com/300"
              }
              alt=""
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
        <div className="overflow-hidden p-3 flex flex-col gap-2 bg-white">
          <h2 className="font-bold text-lg">
            {items[nextIndex]?.item?.title || "N/A"}
          </h2>
          <p className="font-bold text-green-600">
            ${items[nextIndex]?.item?.price || "N/A"}
          </p>
          <button
            onClick={() => handleNavigate(items[nextIndex]?.item?.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center gap-2"
          >
            <FaShoppingCart className="text-sm" /> View Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PopularItemCards;
