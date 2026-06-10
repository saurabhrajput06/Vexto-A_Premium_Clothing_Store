import razorpay from "razorpay";
import { config } from "../config/config.js";



const razorpayInstance = new razorpay({
    key_id: config.razorpay_key_id,
    key_secret: config.razorpay_key_secret
}); 


export const createOrder = async ({amount , currency="INR"}) => {
    const options ={
        amount: amount *100, //convert to paise
        currency,
        receipt:`receipt_${Date.now()}`
    }
    const order = await razorpayInstance.orders.create(options);
    return order;
        
}