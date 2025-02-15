import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../utils/utils";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, subMinutes, format, set } from "date-fns";
import {
  Package,
  FileText,
  DollarSign,
  Tag,
  Calendar,
  Upload,
  Grid,
  CheckCircle,
  Loader2,
} from "lucide-react";

function CreateItemComponent({
  loadingCreate,
  mode,
  handleSubmit,
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  expiryDate,
  setExpiryDate,
  handleImageUpload,
  imageUrl,
  setImageUrl,
  status,
  setStatus,
  loading,
  allCategories,
  setSelectCategory,
  sectectCategory,
  selectCategory,
  imageLoading,
}) {
  console.log("loadingCreate", loadingCreate);
  const renderButtonContent = () => {
    if (imageLoading) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Creating...</span>
        </>
      );
    } else if (mode === "edit") {
      return (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>Edit Item</span>
        </>
      );
    } else if (loadingCreate) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Creating...</span>
        </>
      );
    } else {
      return (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>Create Item</span>
        </>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white    rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          {mode === "edit" ? (
            <h1 className="text-3xl font-bold text-gray-900">edit Item</h1>
          ) : mode === "create" ? (
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Item
            </h1>
          ) : null}
          <p className="mt-2 text-gray-600">
            Fill in the details to list your item for auction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span>Title</span>
              </div>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter product title"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Description</span>
              </div>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <span>Price</span>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  <span>Status</span>
                </div>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Expiry Date and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>Expiry Date</span>
                </div>
              </label>

              <DatePicker
                selected={expiryDate}
                onChange={(date) => setExpiryDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                // dateFormat="Pp"
                className="p-2 border rounded-md"
                placeholderText="Select Expiry Date"
              />
              {expiryDate && (
                <>
                  {console.log("expiryDate in bracket", expiryDate)}
                  <p className="text-green-500">
                    Selected Expiry: {format(expiryDate, "dd-MM-yyyy hh:mm a")}
                  </p>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-500" />
                  <span>Category</span>
                </div>
              </label>
              <select
                value={selectCategory}
                onChange={(e) => setSelectCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {allCategories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className=" ">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                <span>Upload Image</span>
              </div>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                {!imageUrl ? (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                ) : (
                  <div className="relative  ">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <span className="sr-only">Remove image</span>×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={imageLoading}
              // disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {renderButtonContent()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItemComponent;
