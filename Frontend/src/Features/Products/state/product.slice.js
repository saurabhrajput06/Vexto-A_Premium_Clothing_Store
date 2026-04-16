import {createSlice} from "@reduxjs/toolkit"
import { getSellerProducts } from "../services/product.api"


//slice for product
const productSlice = createSlice({
   name :"product",
   initialState:{
    sellerProducts:[]
   },
   reducers:{
    //reducer to update seller products
    setSellerProducts:(state,action)=>{
        //update seller products
        state.sellerProducts = action.payload
    }
   }
})

export const {setSellerProducts} = productSlice.actions
export default productSlice.reducer       