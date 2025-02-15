import axios from "axios";
import { BASE_URL } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userToken = useSelector((state) => state.auth.token);
  console.log("userToken in useOrder", userToken);
  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/userOrders`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const result = response?.data?.orders;
      // console.log("result",result);
      setOrders(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/orders/orderDetails/${orderID}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response?.data?.order;
      console.log("result", result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userToken]);

  return { orders, loading, fetchUserOrders, fetchOrderDetails };
};

export default useOrder;
