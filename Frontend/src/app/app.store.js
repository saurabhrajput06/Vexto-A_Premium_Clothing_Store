import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/State/auth.slice";
import productReducer from "../Features/Products/state/product.slice";

//
export const store = configureStore({
reducer:{
    auth:authReducer,
    product:productReducer,
}
})
