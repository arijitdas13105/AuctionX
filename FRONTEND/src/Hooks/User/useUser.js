import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/utils";
import axios from "axios";
import { useEffect } from "react";

const useUser = () => {
  const userId = useSelector((state) => state.auth.userId);
  console.log("userId IN useUser", userId);
  const userToken = useSelector((state) => state.auth.token);
  console.log("userToken IN useUser", userToken);
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/user/${userId}`);
      const result = response?.data?.user;
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUserBalance = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const result = response?.data?.balance;
      console.log("result", result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserBalance();
  }, []);
  useEffect(() => {
    fetchUserDetails();
  }, [userId, userToken]);

  return { fetchUserDetails, fetchUserBalance };
};

export default useUser;
