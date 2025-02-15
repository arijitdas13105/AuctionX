import axios from "axios";
import { BASE_URL } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allAddress, setAllAddress] = useState([]);

  const userToken = useSelector((state) => state.auth.token);
  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/address/userAddress`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const result = response?.data?.data;
      // console.log("result",result);
      setAddresses(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (newAddress) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/address/addAddress`,
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response?.data?.data;
      setAllAddress((prevAddresses) => [...prevAddresses, result]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const editAddress = async (addressId, newAddress) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/address/editAddress/${addressId}`,
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response?.data?.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/address/deleteAddress/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response?.data?.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [userToken]);

  return {
    addresses,
    loading,
    fetchUserAddresses,
    createAddress,
    editAddress,
    deleteAddress,
  };
};

export default useAddresses;
