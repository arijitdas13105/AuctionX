import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/utils";
import { ShoppingCart, Eye, Tag, CheckCircle, XCircle } from "lucide-react";
import ProductList from "./ProductList";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/items/categories/${categoryId}`
      );
      setProducts(response?.data?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        🛍️ Products in this Category
      </h1>

      {products?.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products?.map((product) => (
            <>
              <ProductList product={product} />
            </>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          🚫 No products found in this category.
        </p>
      )}
    </div>
  );
};

export default CategoryProducts;
