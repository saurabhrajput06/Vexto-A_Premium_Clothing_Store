import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as addressService from "../service/address.api.js";

// Async Thunks
export const getAddresses = createAsyncThunk(
  "address/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await addressService.fetchUserAddresses();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const data = await addressService.createAddress(addressData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await addressService.removeAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const data = await addressService.makeDefaultAddress(addressId);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to set default");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add address
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      // Delete address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      })
      // Set Default
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === action.payload._id,
        }));
      });
  },
});

export default addressSlice.reducer;