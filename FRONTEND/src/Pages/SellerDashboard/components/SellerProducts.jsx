import React, { useEffect, useState } from "react";
import demoImage from "../../../assets/bids.avif";
import axios from "axios";
import { BASE_URL } from "../../../utils/utils";
import CreateItemComponent from "./CreateItemComponent";
import { MdCancel } from "react-icons/md";
import UseItemCreateFn from "../../../Hooks/utils/UseItemCreateFn";
import useItems from "../../../Hooks/Items/useItems";
import { addMinutes, subMinutes, format, set } from "date-fns";
import YesNoModal from "../../../utils/Components/YesNoModal";
import { useNavigate } from "react-router-dom";

function SellerProducts() {
  const navigate = useNavigate();
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
    ownProducts,
    createItemResponse,
    handleCreateItem,
    handleEditItem,
    deleteItem,
    fetchMyProductLoading,
  } = useItems();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const [isEditeModalOpen, setIsEditeModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isYesNoModalOpen, setIsYesNoModalOpen] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!isYesNoModalOpen) {
      console.log("Refetching products after modal close...");
      fetchMyProducts();
    }
  }, [isYesNoModalOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    // if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "main_image");
    console.log("Uploading image...");
    await imageUpload(formData);
    console.log("Image uploaded");
  };

  const handleSubmit = async (e) => {
    console.log("submitting👇");
    e.preventDefault();

    const numericPrice = parseFloat(price);

    const minBidPrice = numericPrice;
    const updatedItem = {
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

    // console.log("updatedItem👇", updatedItem);
    // setIsEditeModalOpen(true);
    const editItemResponse = await handleEditItem(
      updatedItem,
      selectedProductId
    );
    if (editItemResponse.status === 200) {
      setTitle("");
      setDescription("");
      setPrice("");
      setStatus("");
      setImageUrl("");
      setExpiryDate(null);
      setSelectCategory(null);
      setIsEditeModalOpen(false);
      console.log("Item edited successfully");
    } else {
      console.error("Failed to edit item");
    }
  };

  const handleEditeClick = (product) => {
    setIsEditeModalOpen(true);
    setSelectedProductId(product.id);
    // console.log("product", product);
  };
  const handleDeleteClick = (product) => {
    setIsYesNoModalOpen(true);
    setSelectedProductId(product.id);
  };
  const handleDelete = async () => {
    try {
      await deleteItem(selectedProductId);
      setIsYesNoModalOpen(false);
      // getProducts();
      fetchMyProducts();
    } catch (error) {
      console.log(error);
    }
  };

  if (fetchMyProductLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {ownProducts?.length > 0 ? (
          ownProducts.map((product) => (
            <div
              onClick={() => navigate(`/products/${product.id}`)}
              key={product.id}
              className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-row justify-between items-center transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Left Section: Product Details */}
              <div className="flex flex-col space-y-2 w-2/3">
                <h2 className="text-xl font-bold text-gray-800">
                  {product.title}
                </h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    ID: {product.id}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Price: ${product.price}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Status: {product.status}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Category: {product.category_id}
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); //Prevent click from bubbling to parent
                      handleEditeClick(product);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); //Prevent click from bubbling to parent
                      handleDeleteClick(product);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Right Section: Product Image */}
              <div className="w-1/3 flex justify-center">
                <img
                  src={product.image_url || demoImage}
                  alt={product.title}
                  className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg font-medium">
              No products available.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Add products to see them here.
            </p>
          </div>
        )}
      </div>
      {isEditeModalOpen && (
        <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className=" bg-gray-200 p-10 rounded-lg shadow-lg transform scale-75 ">
            <div
              onClick={() => setIsEditeModalOpen(false)}
              className="absolute top-0 right-2   px-2"
            >
              <MdCancel className=" text-5xl text-red-700" />
            </div>
            <CreateItemComponent
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
              selectCategory={selectCategory}
              setSelectCategory={setSelectCategory}
              allCategories={allCategories}
              loading={loading}
              handleSubmit={handleSubmit}
              imageLoading={imageLoading}
              mode="edit"
            />
          </div>
        </div>
      )}
      {isYesNoModalOpen && (
        <YesNoModal
          setIsYesNoModalOpen={setIsYesNoModalOpen}
          onClose={() => setIsYesNoModalOpen(false)}
          onSuccess={handleDelete}
        />
      )}
    </>
  );
}

export default SellerProducts;
