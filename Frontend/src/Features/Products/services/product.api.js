import axios from "axios";

const productApi = axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export async function createProduct(formData){
    const response = await productApi.post("/",formData)
    return response.data
}

export async function getSellerProducts(){
    const response = await productApi.get("/seller")
    return response.data
}

export async function getMe(){
    const response = await productApi.get("/me")
    return response.data
}
//getallproducts

export async function getAllProducts(){
    const response = await productApi.get("/")
    return response.data
}

export async function getProductById(id) {
    const response = await productApi.get(`/${id}`);
    return response.data;
}