import { useDispatch, useSelector } from "react-redux";
import { createProduct, getSellerProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

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

    return { handleCreateProduct, handleGetSellerProducts }

}