// pages/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../../utils/utils";
import ProductDesign from "./Component/ProductDesign";
import BidModal from "./Component/BidModal";
import { Loader } from "lucide-react";

const ProductDetails = () => {
  const userToken = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bidPriceValue, setBidPriceValue] = useState("");
  const [error, setError] = useState("");

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/items/product/${productId}`
      );
      setProduct(response.data.item);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleBidSubmit = async () => {
    try {
      await axios.post(
        `${BASE_URL}/items/bids`,
        { item_id: parseInt(productId), bid_price: parseFloat(bidPriceValue) },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      await fetchProductDetails();
      setIsOpen(false);
      setBidPriceValue("");
    } catch (error) {
      console.error("Error placing bid:", error);
      setError(error.response.data.error);
    }
  };

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm">
        <Loader className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-green-600 font-medium text-lg">Loading...</p>
      </div>
    );

  return (
    <>
      <ProductDesign
        product={product}
        isLoggedIn={isLoggedIn}
        onBidClick={() => setIsOpen(true)}
      />

      <BidModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        minBid={product?.min_bidding_price}
        onSubmit={handleBidSubmit}
        bidPriceValue={bidPriceValue}
        setBidPriceValue={setBidPriceValue}
        error={error}
      />
    </>
  );
};

export default ProductDetails;
