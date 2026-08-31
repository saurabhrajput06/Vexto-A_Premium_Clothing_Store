import axios from "axios";


const addressApiInstance = axios.create({
    baseURL: "https://vexto-backend.onrender.com/api/address",
    withCredentials: true,

})

export const fetchUserAddresses = async () => {
    const response = await addressApiInstance.get("/getAddressByUser");
    return response.data;
};


// Naya address add karna
export const createAddress = async (addressData) => {
    const response = await addressApiInstance.post("/addAddress", addressData);
    return response.data;
};

// Address update karna
export const editAddress = async (addressId, updatedData) => {
    const response = await addressApiInstance.put(`/updateAddress/${addressId}`, updatedData);
    return response.data;
};

// Default address set karna
export const makeDefaultAddress = async (addressId) => {
  const response = await addressApiInstance.patch(`/setDefaultAddress/${addressId}`);
  return response.data;
};

// Address delete karna
export const removeAddress = async (addressId) => {
  const response = await addressApiInstance.delete(`/deleteAddress/${addressId}`);
  return response.data;
};