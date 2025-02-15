import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../utils/utils";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, subMinutes, format, set } from "date-fns";

import CreateItemComponent from "./CreateItemComponent";
import UseItemCreateFn from "../../../Hooks/utils/UseItemCreateFn";
import useItems from "../../../Hooks/Items/useItems";

function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectCategory, setSelectCategory] = useState("");
  const {
    allCategories,
    getCategories,
    formatDateWithDateFns,
    imageUpload,
    imageUrl,
    setImageUrl,
    imageLoading,
  } = UseItemCreateFn();
  const {
    fetchMyProducts,
    createItemResponse,
    loadingCreate,
    handleCreateItem,
  } = useItems();

  useEffect(() => {
    getCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "main_image");
    console.log("Uploading image...");
    await imageUpload(formData);
    console.log("Image uploaded");
  };
  const handleSubmit = async (e) => {
    // console.log("item creating");
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }

    // Convert price to a number
    const numericPrice = parseFloat(price);

    // Check if the price is a valid number
    if (isNaN(numericPrice)) {
      alert("Please enter a valid price.");
      return;
    }

    const minBidPrice = numericPrice;
    const newItem = {
      title,
      description,
      price: numericPrice,
      status,
      image_url: imageUrl,
      expiry_date: formatDateWithDateFns(expiryDate),
      min_bidding_price: minBidPrice,
      current_bid_price: 0,
      category_id: parseInt(selectCategory),
    };

    // console.log("New Item:", newItem);

    console.log("Sending request to create item:", newItem);

    const createItemResponse = await handleCreateItem(newItem);

    if (createItemResponse?.status === 200) {
      setTitle("");
      setDescription("");
      setPrice("");
      setStatus("");
      setImage("");
      setImageUrl("");
      setExpiryDate(null);
      setSelectCategory(null);
      fetchMyProducts();
      console.log("Item created successfully");
    } else {
      console.error("Failed to create item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-2 px-4 sm:px-6 lg:px-8 rounded-lg ">
      <CreateItemComponent
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        status={status}
        setStatus={setStatus}
        expiryDate={expiryDate}
        setExpiryDate={setExpiryDate}
        handleImageUpload={handleImageUpload}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        loading={loading}
        allCategories={allCategories}
        selectCategory={selectCategory}
        setSelectCategory={setSelectCategory}
        imageLoading={imageLoading}
        loadingCreate={loadingCreate}
        mode="create"
      />
    </div>
  );
}

export default CreateItem;
