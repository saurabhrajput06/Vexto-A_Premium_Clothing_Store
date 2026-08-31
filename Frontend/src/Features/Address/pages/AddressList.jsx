import React, { useState } from "react";
import { useAddress } from "../Hook/useAddress.js";
import AddressForm from "./AddressForm.jsx";

const AddressList = () => {
  // Hook se functions aur state destructure karein
  const { addresses, loading, removeAddress, setDefault } = useAddress(true);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) return <div className="p-4 text-center">Loading addresses...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          {showAddForm ? "Close" : "+ Add New Address"}
        </button>
      </div>

      {showAddForm && <AddressForm onClose={() => setShowAddForm(false)} />}

      <div className="space-y-4 mt-4">
        {addresses.map((addr) => (
          <div key={addr._id} className="p-4 border rounded bg-white shadow-sm flex justify-between">
            <div>
              <p className="font-bold">{addr.name} ({addr.addressType})</p>
              <p className="text-sm text-gray-600">{addr.houseName}, {addr.area}, {addr.city} - {addr.pincode}</p>
              <p className="text-sm text-gray-600">Mobile: {addr.mobile}</p>
              {addr.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>}
            </div>

            <div className="flex flex-col gap-2">
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr._id)} className="text-blue-600 text-sm">
                  Set Default
                </button>
              )}
              <button onClick={() => removeAddress(addr._id)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;