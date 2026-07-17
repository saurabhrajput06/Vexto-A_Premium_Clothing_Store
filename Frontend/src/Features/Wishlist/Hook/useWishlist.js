import {useDispatch , useSelector} from "react-redux";
import { toggleWishlist , getWishlist } from "../Service/wishlist.api";
import { setItems, setLoading } from "../State/wishlist.slice";

export const useWishlist = () => {
    const dispatch = useDispatch()

    const {items , loading , error} = useSelector((state) => state.wishlist);

    async function handleToggleWishlist({productId , variantId}) {
        try {
            const data = await toggleWishlist({productId , variantId})
            // dispatch(setItems(data.items))
           
            if (data?.success) {
                await handleGetWishlist()
                return data
            }
    
        }
        catch (error) {
            console.log("error in handleToggleWishlist", error)
            return error
        }
    }

    async function handleGetWishlist() {
        try {
            dispatch(setLoading(true))

            const data = await getWishlist()
            dispatch(setItems(data.items))
            return data.items
        }
        catch (error) {
            console.log("error in handleGetWishlist", error)
            return error
        }
        finally{
            dispatch(setLoading(false))
        }
    }

    // 3. Helper: Check karne ke liye ki heart laal dikhana hai ya nahi (supports variants)
    const isLiked = (productId, variantId) => {
        if (!items) return false;
        return items.some((item) => {
            const matchesProduct = item.product?._id === productId;
            if (!matchesProduct) return false;
            
            if (variantId) {
                const itemVariantId = item.variant?._id?.toString() || item.variant?.toString();
                return itemVariantId === variantId.toString();
            }
            return true;
        });
    };

    return {
        items,
        loading,
        error,
        isLiked,
        handleToggleWishlist,
        handleGetWishlist
    };

}