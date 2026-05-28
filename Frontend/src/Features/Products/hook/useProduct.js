import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts,getAllProducts, getProductById, createProductVariant, updateProductVariantStock, addProductReview } from "../services/product.api";
import { setSellerProducts , setProducts } from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            const data = await createProduct(formData)
            return data.product
        }
        catch (error) {
            console.log(error)
        }
    }

    async function handleGetSellerProducts() {
        try {
            const data = await getSellerProducts()
            dispatch(setSellerProducts(data.products))
            
            return data.products
        }
        catch (error) {
            console.log(error)
        }
    }

    async function handleGetAllProducts() {
        try {
            const data = await getAllProducts()
            //set all products
            dispatch(setProducts(data.products))    
            return data.products
        }
        catch (error) {
            console.log(error)
        }
    }

    async function handleGetProductById(id) {
        try {
            const data = await getProductById(id)
            return data.product
        }
        catch (error) {
            console.log(error)
        }
    }

    async function handleCreateProductVariant(productId, formData) {
        try {
            const data = await createProductVariant(productId, formData);
            return data.product;
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdateVariantStock(productId, variantId, stock) {
        try {
            const data = await updateProductVariantStock(productId, variantId, stock);
            return data.product;
        } catch (error) {
            console.log(error);
        }
    }

    async function handleAddProductReview(productId, reviewData) {
        try {
            const data = await addProductReview(productId, reviewData);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return { handleCreateProduct, handleGetSellerProducts , handleGetAllProducts, handleGetProductById, handleCreateProductVariant, handleUpdateVariantStock, handleAddProductReview }

}