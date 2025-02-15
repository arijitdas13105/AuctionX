import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/utils";
import { ShoppingCart, Eye, Tag, CheckCircle, XCircle } from "lucide-react";

function ProductList({ product, mode }) {
  console.log("product", product);
  const navigate = useNavigate();
  const displayPrice = mode === "popular" ? product.item.price : product.price;
  const displayStatus =
    mode === "popular" ? product.item.status : product.status;
  const displayImage =
    mode === "popular" ? product.item.image_url : product.image_url;
  const displayTitle = mode === "popular" ? product.item.title : product.title;
  const displayProductId = mode === "popular" ? product.item.id : product.id;
  return (
    <div
      key={product.id}
      className="bg-white shadow-lg rounded-lg overflow-hidden  hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={mode === "popular" ? product.item.image_url : product.image_url}
          alt={mode === "popular" ? product.item.title : product.title}
          className="w-full h-64 object-cover"
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full 
           ${
             (mode === "popular" ? product.item.status : product.status) ===
             "available"
               ? "bg-green-100 text-green-800"
               : "bg-red-100 text-red-800"
           }`}
        >
          {(mode === "popular" ? product.item.status : product.status) ===
          "available" ? (
            <CheckCircle className="inline-block w-4 h-4 mr-1" />
          ) : (
            <XCircle className="inline-block w-4 h-4 mr-1" />
          )}
          {displayStatus}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3 ">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 ">
          <Tag className="w-5 h-5 text-blue-500" />
          {displayTitle}
        </h2>
        <p className="text-gray-500 text-sm">ID: {displayProductId}</p>

        <p className="text-lg font-bold text-blue-600 flex items-center gap-2">
          💰 Price: <span>${displayPrice}</span>
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            className="flex items-center justify-center gap-2 w-full bg-[#2cdaf1] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition group"
            onClick={() => navigate(`/products/${displayProductId}`)}
          >
            <Eye className="w-5 h-5 text-black group-hover:text-white" />{" "}
            <span className="text-black group-hover:text-white">View</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
