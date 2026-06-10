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

export const getCart = async () =>{
    const response = await cartApiInstance.get("/")
    return response.data;
}

export const removeItem = async (itemId) => {
    const response = await cartApiInstance.delete(`/item/${itemId}`)
    return response.data;
}

export const updateItem = async (itemId, quantity) => {
    const response = await cartApiInstance.patch(`/item/${itemId}`, { quantity })
    return response.data;
}


export const createPaymentOrder = async ()=>{
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}