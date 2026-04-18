import {createSlice} from "@reduxjs/toolkit"



//slice for product
const productSlice = createSlice({
   name :"product",
   initialState:{
    sellerProducts:[],
    products:[],
    
   },
   reducers:{

    //reducer to update seller products
    setSellerProducts:(state,action)=>{
        //update seller products
        state.sellerProducts = action.payload
    },
    //set all products
    setProducts:(state,action)=>{
        state.products = action.payload
    }
   }
})

export const {setSellerProducts , setProducts} = productSlice.actions
export default productSlice.reducer       