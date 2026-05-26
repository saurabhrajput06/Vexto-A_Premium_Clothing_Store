import { createSlice } from "@reduxjs/toolkit";

// 1. Plain aur clean state definition
const initialState = {
    items: [],
    loading: false,
    error: null
};

// 2. createSlice ka sahi invocation
const wishlistSlice = createSlice({
    name: "wishlist",
    initialState, // Hamein direct variable pass karna hai
    reducers: {
        setItems: (state, action) => {
            // Null products ko filter out karke hi state me save karo (Safety Net)
            state.items = action.payload.filter(item => item.product !== null);
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            // Hum productId ke base par filter out kar rahe hain
            state.items = state.items.filter(item => item.product?._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

// 3. Actions aur Reducer ko export karo
export const { setItems, addItem, removeItem, setLoading, setError } = wishlistSlice.actions;
export default wishlistSlice.reducer;