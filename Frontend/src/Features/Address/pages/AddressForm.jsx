import React, { useState } from "react";

const AddressForm = ({ initialData = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      mobile: "",
      houseName: "",
      area: "",
      city: "",
      state: "",
      country: "India", // Default India set rahega
      pincode: "",
      addressType: "home",
    }
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      if (onClose) onClose();
    } catch (err) {
      alert("Something went wrong while saving address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            {initialData ? "Edit Address" : "Add New Address"}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-800 text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Full Name</label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Mobile Number</label>
              <input
                name="mobile"
                required
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Flat / House No / Building</label>
            <input
              name="houseName"
              required
              value={formData.houseName}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Area / Street / Sector</label>
            <input
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">City</label>
              <input
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">State</label>
              <input
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {/* Country aur Pincode field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Country</label>
              <input
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Pincode</label>
              <input
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 block">Address Type</label>
            <select
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl p-3 text-xs capitalize focus:outline-none focus:border-neutral-900"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;