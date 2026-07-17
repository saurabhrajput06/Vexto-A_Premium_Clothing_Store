import axios from "axios";

const productApi = axios.create({
    baseURL:"https://vexto-backend.onrender.com/api/products",
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
    console.log("Fetching product with ID:", id);
    const response = await productApi.get(`/${id}`);
    console.log("Response:", response.data);
    return response.data;
}

export async function createProductVariant(productId, formData) {
    const response = await productApi.post(`/${productId}/variants`, formData);
    return response.data;
}

export async function updateProductVariantStock(productId, variantId, stock) {
    const response = await productApi.patch(`/${productId}/variants/${variantId}/stock`, { stock });
    return response.data;
}

export async function addProductReview(productId, { rating, comment }) {
    const response = await productApi.post(`/${productId}/reviews`, { rating, comment });
    return response.data;
}
