import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
    },

    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItems: (state, action) => {
            state.items.push(action.payload)
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload)
        },
        updateItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload
            const item = state.items.find(item => item._id === itemId)
            if (item) {
                item.quantity = quantity
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    }
})

export const { setItems, addItems, removeItem, updateItemQuantity, setLoading } = cartSlice.actions
export default cartSlice.reducer
