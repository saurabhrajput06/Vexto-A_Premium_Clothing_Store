import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../state/addressSlice";

export const useAddress = (autoFetch = false) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  useEffect(() => {
    if (autoFetch && addresses.length === 0) {
      dispatch(getAddresses());
    }
  }, [dispatch, autoFetch, addresses.length]);

  const handleAddAddress = (data) => dispatch(addAddress(data)).unwrap();
  const handleDeleteAddress = (id) => dispatch(deleteAddress(id)).unwrap();
  const handleSetDefault = (id) => dispatch(setDefaultAddress(id)).unwrap();
  const handleFetchAddresses = () => dispatch(getAddresses()).unwrap();

  // Default address alag se extract karke dena (Checkout me kaam aata hai)
  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    fetchAddresses: handleFetchAddresses,
    createAddress: handleAddAddress,
    removeAddress: handleDeleteAddress,
    setDefault: handleSetDefault,
  };
};