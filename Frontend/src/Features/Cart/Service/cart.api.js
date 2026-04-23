import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true,

})

export const addItem = async ({ productId, variantId , quantity=1}) => {
  

const url = variantId 
        ? `/add/${productId}/${variantId}` 
        : `/add/${productId}`;

    const response = await cartApiInstance.post(url, { quantity });
    return response.data;
}





