import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiBox,
  FiUser,
  FiPlusSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaWallet, FaRupeeSign, FaPlusCircle } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import AuctionxLogo3 from "../..//../assets/Auctionx3.png";
import { BASE_URL } from "../../../utils/utils";
import useUser from "../../../Hooks/User/useUser";
import { PaymentElement } from "@stripe/react-stripe-js";
import StripePaymentModal from "./Wallet/StripePaymentModal";
import PaymentForm from "./Wallet/PaymentForm";
import { Wallet, PlusCircle } from "lucide-react";
// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51LgX81SHEgAWx7EZb3IfN5mbYbOAxnsYQ7WXrmlaggS279EXYiCNxUZyqJl8W1WiPpIjRComAsANNBzLIzEDrDhs00xeY4jW3w"
);
function Navbar() {
  const { fetchUserBalance } = useUser();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const handlePaymentSuccess = async (amount) => {
    console.log(`Successfully deposited $${amount}`);
    setIsWalletOpen(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await fetchUserBalance();
      setUserBalance(balance);
      console.log("userBalance in fn", balance);
    };
    fetchBalance();
  }, []);
  console.log("userBalance", userBalance);

  return (
    <nav className="top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img
              src={AuctionxLogo3}
              alt="CampusBids Logo"
              className="h-44 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-colors"
              >
                <FiHome className="mr-2" />
                Home
              </button>
              <button
                onClick={() => navigate("/myProducts")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-colors"
              >
                <FiBox className="mr-2" />
                My Items
              </button>
              <button
                onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-colors"
              >
                <FiUser className="mr-2" />
                {isLoggedIn ? "Profile" : "Login"}
              </button>
            </div>
            <button
              onClick={() => navigate("/createItem")}
              className="ml-4 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPlusSquare className="mr-2" />
              Post an Item
            </button>
            <div className="relative">
              <span
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className="ml-4 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <FaWallet className="mr-2" />
                Wallet
              </span>
              {isWalletOpen && (
                <div className="absolute top-10 right-0 mt-2 py-3 w-48 bg-white rounded-lg shadow-lg z-10">
                  <ul className="text-gray-700">
                    {/* Balance Section */}
                    <li className="px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                      <Wallet className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">₹ {userBalance}</span>
                    </li>

                    {/* Deposit Option */}
                    <li
                      className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer transition duration-200"
                      onClick={() => {
                        setIsPaymentModalOpen(true);
                        setIsWalletOpen(false);
                      }}
                    >
                      <PlusCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Deposit</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <FiHome className="mr-2" />
              Home
            </button>
            <button
              onClick={() => {
                navigate("/myProducts");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <FiBox className="mr-2" />
              My Items
            </button>
            <button
              onClick={() => {
                navigate(isLoggedIn ? "/profile" : "/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <FiUser className="mr-2" />
              {isLoggedIn ? "Profile" : "Login"}
            </button>
            <button
              onClick={() => {
                navigate("/createItem");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              <FiPlusSquare className="mr-2" />
              Post an Item
            </button>

            <div className="relative">
              <span
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className="  flex items-center bg-gradient-to-r   hover:text-blue-600 text-black px-3 py-2  font-semibold     cursor-pointer"
              >
                <FaWallet className="mr-2" />
                Wallet
              </span>
              {isWalletOpen && (
                <div className="absolute top-10  mt-2 py-2 w-40 bg-white rounded-lg shadow-lg overflow-visible z-10">
                  <ul className="text-gray-600">
                    <li className="px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                      <Wallet className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">₹ {userBalance}</span>
                    </li>
                    <li
                      className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer transition duration-200"
                      onClick={() => {
                        setIsPaymentModalOpen(true);
                        setIsWalletOpen(false);
                      }}
                    >
                      <PlusCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Deposit</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </nav>
  );
}

export default Navbar;
