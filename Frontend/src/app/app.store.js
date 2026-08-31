import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/State/auth.slice";
import productReducer from "../Features/Products/state/product.slice";
import cartReducer from "../Features/Cart/State/cart.slice.js";
import wishlistReducer from "../Features/Wishlist/State/wishlist.slice";
import addressReducer from "../Features/Address/state/addressSlice";

export const store = configureStore({
reducer:{
    auth:authReducer,
    product:productReducer,
    cart:cartReducer,
    wishlist:wishlistReducer,
    address:addressReducer,
}
})
