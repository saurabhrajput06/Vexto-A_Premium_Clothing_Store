import { useDispatch } from "react-redux";
import { setItems , addItems} from "../State/cart.slice";
import { addItem } from "../Service/cart.api";



export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddToCart({ productId, variantId }) {

        try {
            const data = await addItem({ productId, variantId })
           

            return data

        }
        catch (error) {
            console.log("error in handleaddToCart", error)
            return error

        }



    }
    return {
        handleAddToCart
    };

}


