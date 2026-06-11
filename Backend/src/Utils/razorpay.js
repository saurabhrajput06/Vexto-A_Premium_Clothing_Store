import crypto from "crypto";

export const validatePaymentVerification = (params, signature, secret) => {
    const orderId = params.razorpay_order_id || params.order_id;
    const paymentId = params.razorpay_payment_id || params.payment_id;

    if (!orderId || !paymentId || !signature || !secret) {
        return false;
    }

    const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return generatedSignature === signature;
};
