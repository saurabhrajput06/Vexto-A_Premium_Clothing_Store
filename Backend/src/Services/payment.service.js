import razorpay from "razorpay";
import { Order } from "../Models/order.model.js";
import { Payment } from "../Models/payment.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const createOrder = async (amount) => {
    try {
        const order = await razorpayInstance.orders.create({
            amount: amount * 100,
            currency: "INR",
            //todo : receipt will be generated from order id
            receipt: `receipt_${Date.now()}`
        });
        return order;
    } catch (error) {
        throw error;
    }
}