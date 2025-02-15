import React, { useEffect, useState } from "react";
import MyOrder from "./Orders/MyOrder";
import MyAddresses from "./Address/MyAddresses";
import MyBiddings from "./Bid/MyBiddings";
import AccountSetting from "./AccountSetting";
import Notifications from "./Notifications";
import { FaBagShopping } from "react-icons/fa6";
import { RiAuctionFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";
import OrderCard from "./Orders/Component/OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import useUser from "../../Hooks/User/useUser";

function ProfileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const { fetchUserDetails } = useUser();

  const [activeSection, setActiveSection] = useState("myOrders");
  const sections = [
    { key: "myOrders", lable: "My Orders", icon: <FaBagShopping /> },
    { key: "myAddresses", lable: "My Addresses", icon: <FaHome /> },
    { key: "myBiddings", lable: "Bidding History", icon: <RiAuctionFill /> },
    {
      key: "accountSetting",
      lable: "Account Settings",
      icon: <IoMdSettings />,
    },
    {
      key: "notificatons",
      lable: "Notifications",
      icon: <MdNotificationsActive />,
    },
  ];
  const renderContent = () => {
    switch (activeSection) {
      case "myOrders":
        return <MyOrder />;
      // return <OrderCard />;
      case "myAddresses":
        return <MyAddresses />;
      case "myBiddings":
        return <MyBiddings />;
      case "accountSetting":
        return <AccountSetting />;
      case "notificatons":
        return <Notifications />;
      default:
        return (
          <>
            <h1>set a selection</h1>
          </>
        );
    }
  };
  const handleFetchUserDetails = async () => {
    const result = await fetchUserDetails();

    setUserDetails(result);
  };
  useEffect(() => {
    handleFetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());
    navigate("/login");
  };
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log("isLoggedIn", isLoggedIn);
  return (
    <div className="flex flex-col h-screen sm:px-16 ">
      <div className="flex flex-col items-center">
        <img
          className="w-[200px] h-[200px] rounded-full object-cover "
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <span className="text-2xl font-bold">{userDetails?.name}</span>
        <span className="text-sm text-gray-600 underline">
          {userDetails?.email}{" "}
        </span>
        <div className="flex flex-row gap-3">
          <div className=" cursor-pointer border  px-5 py-2 mt-2  rounded-lg   bg-orange-400 ">
            <span className="text-white font-bold">Edit</span>
          </div>
          <div
            onClick={() => handleLogout()}
            className=" cursor-pointer border  px-5 py-2 mt-2  rounded-lg   bg-red-900 "
          >
            <span className="text-white font-bold">Log Out</span>
          </div>
        </div>
      </div>
      <div className="    flex flex-col sm:flex-row   sm:overflow-hidden sm:gap-10 sm:p-5 ">
        <div className="flex-[2]   flex items-center justify-center sm:flex-none sm:items-start sm:justify-start">
          <ul className="    transform scale-75 sm:scale-100   flex flex-row sm:flex-col gap-2 sm:gap-5 ">
            {sections.map((section) => (
              <li
                onClick={() => setActiveSection(section.key)}
                key={section.key}
                className={`   cursor-pointer border border-green-500 rounded-lg sm:p-4 shadow-md transition-all duration-200 ${
                  activeSection === section.key
                    ? "bg-blue-100 border-blue-500 shadow-lg scale-110"
                    : "bg-white hover:bg-gray-100 hover:shadow-lg"
                }`}
              >
                <span className="flex flex-row items-center sm:gap-6 font-bold">
                  <span className=" text-green-500  sm:text-lg">
                    {section.icon}
                  </span>
                  {section.lable}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className=" border-2 rounded-lg shadow-md  flex-[5]  h-full ">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
