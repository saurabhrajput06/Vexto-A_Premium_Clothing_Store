import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/State/auth.slice";
import productReducer from "../Features/Products/state/product.slice";
import cartReducer from "../Features/Cart/State/cart.slice.js";
//
export const store = configureStore({
reducer:{
    auth:authReducer,
    product:productReducer,
    cart:cartReducer,
}
})
