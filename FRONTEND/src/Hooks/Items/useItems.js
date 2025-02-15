import axios from "axios";
import { BASE_URL } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { set } from "date-fns";

const useItems = () => {
  const userToken = useSelector((state) => state.auth.token);
  const [popularItems, setPopularItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [ownProducts, setOwnProducts] = useState([]);
  const [fetchMyProductLoading, setFetchMyProductLoading] = useState(false);
  const fetchMyProducts = async () => {
    setFetchMyProductLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/items/myProducts`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const result = response?.data?.items;
      setOwnProducts(result);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchMyProductLoading(false);
    }
  };
  const fetchPopularItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/items/popularItems`);
      const result = response?.data?.items;
      // console.log("result",result);
      setPopularItems(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/items/availableItems`);
      const result = response?.data?.items;
      setAvailableItems(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (data) => {
    setLoadingCreate(true);
    try {
      const createItemResponse = await axios.post(
        `${BASE_URL}/items/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (createItemResponse.status === 200) {
        fetchMyProducts();
      }
      setLoadingCreate(false);
      return createItemResponse;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditItem = async (data, productID) => {
    console.log("productID", productID);
    console.log("data in handleEDit", data);
    try {
      const editItemResponse = await axios.put(
        `${BASE_URL}/items/updateProduct/${productID}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return editItemResponse;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteItem = async (productID) => {
    setLoading(true);
    try {
      const deleteItemResponse = await axios.delete(
        `${BASE_URL}/items/deleteProduct/${productID}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setLoading(false);
      return deleteItemResponse;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchMyProducts,
    ownProducts,
    popularItems,
    loadingCreate,
    loading,
    fetchPopularItems,
    handleCreateItem,
    handleEditItem,
    deleteItem,
    availableItems,
    fetchAvailableItems,
    fetchMyProductLoading,
  };
};
export default useItems;
