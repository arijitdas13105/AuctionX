import React, { useState } from "react";
import AddressCard from "./Component/AddressCard";
import useAddresses from "../../../Hooks/address/useAddresses";
import { FaPlusCircle } from "react-icons/fa";
import AddAddressModal from "./Component/AddAddressModal";

function MyAddresses() {
  const { addresses, loading, fetchUserAddresses, deleteAddress } =
    useAddresses();
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const handleAddAddressSuccess = () => {
    setIsAddAddressModalOpen(false);
    setAddressToEdit(null);
    fetchUserAddresses();
  };

  const openEditModal = (address) => {
    setAddressToEdit(address);
    setIsAddAddressModalOpen(true);
  };
  const handleDeleteAddress = async (addressId) => {
    try {
      console.log("addressId", addressId);
      await deleteAddress(addressId);
      fetchUserAddresses();
    } catch (error) {
      console.log(error);
    }
    // console.log("clicked");
  };
  return (
    <div className="flex flex-col gap-3 p-2 h-full">
      {/* Add Address Button */}
      <div
        onClick={() => {
          setIsAddAddressModalOpen(true);
        }}
        className="cursor-pointer border w-fit flex flex-row gap-2 items-center bg-red-400 p-2 rounded-md hover:bg-red-500 transition duration-200"
      >
        <FaPlusCircle className="text-2xl text-black" />
        <span className="font-bold">Add Address</span>
      </div>

      {/* Address List */}
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-auto  ">
        {addresses?.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => openEditModal(address)}
              addressDelete={handleDeleteAddress}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">No Address Found</span>
            <button className="bg-blue-400 p-2 rounded-md mt-4">
              + Add New Address
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <AddAddressModal
              onClose={() => setIsAddAddressModalOpen(false)}
              onSuccess={handleAddAddressSuccess}
              addressToEdit={addressToEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAddresses;
