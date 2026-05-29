import {createSlice} from "@reduxjs/toolkit"



//slice for product
const productSlice = createSlice({
   name :"product",
   initialState:{
    sellerProducts:[],
    products:[],
    search: "",
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
    },
    setSearch:(state,action)=>{
        state.search = action.payload
    }
   }
})

export const {setSellerProducts , setProducts, setSearch} = productSlice.actions
export default productSlice.reducer       