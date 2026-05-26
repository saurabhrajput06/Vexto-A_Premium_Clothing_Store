import axios from "axios"

const wishlistApiInstance = axios.create({
    baseURL:"http://localhost:3000/api/wishlist",
    withCredentials:true
})

export const toggleWishlist= async({productId , variantId}) =>{
    
    const url = variantId
        ? `/toggle/${productId}/${variantId}`
        : `/toggle/${productId}`;
        
    const response = await wishlistApiInstance.post(url);
    return response.data
    
} 

export const getWishlist =async()=>{
    const response = await wishlistApiInstance.get("/")
    return response.data
}
