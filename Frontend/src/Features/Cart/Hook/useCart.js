import { useDispatch } from "react-redux";
import { setItems, addItems, removeItem as removeItemAction, updateItemQuantity, setLoading } from "../State/cart.slice";
import { addItem, getCart, removeItem, updateItem,createPaymentOrder, verifyPaymentOrder, getPaymentOrderDetails} from "../Service/cart.api";


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

    async function handleGetCart() {
        try {
            dispatch(setLoading(true))
            const data = await getCart()
            dispatch(setItems(data.data.items))
            return data.data.items
        }
        catch (error) {
            console.log("error in handleGetCart", error)
            return error
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleRemoveItem(itemId) {
        try {
            // Optimistic update
            dispatch(removeItemAction(itemId))
            const data = await removeItem(itemId)
            dispatch(setItems(data.data.items))
            return data
        }
        catch (error) {
            console.log("error in handleRemoveItem", error)
            // Refetch on error to restore state
            handleGetCart()
            return error
        }
    }

    async function handleUpdateQuantity(itemId, quantity) {
        try {
            // Optimistic update
            dispatch(updateItemQuantity({ itemId, quantity }))
            const data = await updateItem(itemId, quantity)
            dispatch(setItems(data.data.items))
            return data
        }
        catch (error) {
            console.log("error in handleUpdateQuantity", error)
            // Refetch on error to restore state
            handleGetCart()
            return error
        }
    }


    async function handlePayment() {
        try {
            const data = await createPaymentOrder()
            return data.order
        }
        catch (error) {
            console.log("error in handlePayment", error)
            return error
        }
    }


  async function handleVerifyPaymentOrder(response){
    try{
        const razorpayOrderId = response.razorpay_order_id || response.razorpayOrderId;
        const razorpayPaymentId = response.razorpay_payment_id || response.razorpayPaymentId;
        const razorpaySignature = response.razorpay_signature || response.razorpaySignature;
        const data = await verifyPaymentOrder({razorpayOrderId,razorpayPaymentId,razorpaySignature})
        return data.success
    }
    catch(error){
        console.log("error in handleVerifyPaymentOrder", error)
        return error
    }
 }

 async function handleGetPaymentOrderDetails(orderId) {
     try {
         const data = await getPaymentOrderDetails(orderId)
         return data.payment
     } catch (error) {
         console.log("error in handleGetPaymentOrderDetails", error)
         return null
     }
 }



    return {
        handleAddToCart,
        handleGetCart,
        handleRemoveItem,
        handleUpdateQuantity,
        handlePayment,
        handleVerifyPaymentOrder,
        handleGetPaymentOrderDetails
    };

}
