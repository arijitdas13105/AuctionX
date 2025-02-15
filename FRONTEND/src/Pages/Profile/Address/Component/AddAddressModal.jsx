import React, { useEffect, useState } from "react";
import useAddresses from "../../../../Hooks/address/useAddresses";

function AddAddressModal({ onClose, onSuccess, addressToEdit }) {
  const { createAddress, editAddress, loading } = useAddresses();
  const [address, setAddress] = useState({
    line: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    is_default: false,
  });
  useEffect(() => {
    console.log("addressToEdit", addressToEdit);
    if (addressToEdit) {
      setAddress({
        line: addressToEdit.line || "",
        city: addressToEdit.city || "",
        state: addressToEdit.state || "",
        country: addressToEdit.country || "",
        zipCode: addressToEdit.zipCode || "",
        is_default: addressToEdit.is_default || false,
      });
    }
  }, [addressToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setAddress({ ...address, [name]: value });
    setAddress({
      ...address,
      [name]: name === "zipCode" ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (e) => {
    setAddress({ ...address, is_default: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addressToEdit) {
        await editAddress(addressToEdit.id, address);
        alert("Address updated successfully.");
      } else {
        await createAddress(address);
        alert("Address added successfully.");
      }
      onSuccess();
      setAddress({
        line: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        is_default: false,
      });
    } catch (error) {
      alert("Failed to save address. Please try again.");
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
        Add Address
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Line Input */}
        <div>
          <label
            htmlFor="line"
            className="block text-sm font-medium text-gray-700"
          >
            Line
          </label>
          <input
            type="text"
            id="line"
            name="line"
            value={address.line}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* City Input */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* State Input */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Country Input */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Zip Code Input */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            type="number"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={address.is_default}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_default"
            className="ml-2 block text-sm text-gray-700"
          >
            Set as default address
          </label>
        </div>

        {/* Submit Button */}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 p-2 text-white font-bold rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Adding..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAddressModal;
