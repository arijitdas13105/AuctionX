import axios from "axios";
import { BASE_URL } from "./../../utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const useBid = () => {
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = useSelector((state) => state.auth.token);
  const fetchUserBids = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items/bids/me`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const result = response?.data?.bids;
      setUserBids(result);
    } catch (error) {
      console.log("error us ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserBids();
  }, [userToken]);
  return { userBids, loading, fetchUserBids };
};

export default useBid;
