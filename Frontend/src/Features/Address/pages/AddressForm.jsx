import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress } from "../state/addressSlice";

const AddressForm = ({ onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    houseName: "",
    area: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    addressType: "home",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    } else {
      dispatch(addAddress(formData));
      if (onClose) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Address</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="mobile"
          placeholder="10-digit Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-3">
        <input
          name="houseName"
          placeholder="Flat / House No / Building"
          value={formData.houseName}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-3">
        <input
          name="area"
          placeholder="Area / Street / Sector"
          value={formData.area}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <select
          name="addressType"
          value={formData.addressType}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="home">Home</option>
          <option value="office">Office</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Address
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;