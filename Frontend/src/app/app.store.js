import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/State/auth.slice";
//
export const store = configureStore({
reducer:{
    auth:authReducer,
}
})
