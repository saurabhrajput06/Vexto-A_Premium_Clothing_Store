import cartModel from "../Models/cart.model.js";
import userModel from "../Models/user.model.js";
import productModel from "../Models/product.model.js";
import { stockOfVariantInProduct } from "../Dao/product.dao.js";
import { createOrder } from "../Services/payment.service.js";
import mongoose from "mongoose";
import { getCartDetails } from "../Dao/cart.dao.js";
import PaymentModel from "../Models/payment.model.js";
import { validatePaymentVerification } from "../Utils/razorpay.js";


export const addToCart = async (req, res) => {
    //fetch the product and variant from the database 
    try {
        let { productId, variantId } = req.params;
        const { quantity = 1 } = req.body;

        const product = variantId
            ? await productModel.findOne({ _id: productId, "variants._id": variantId })
            : await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product or variant not found", success: false });
        }

        // If no variantId is provided, but the product has variants, default to the first one
        if (!variantId && product.variants && product.variants.length > 0) {
            variantId = product.variants[0]._id.toString();
        }

        // to find or create a cart for user
        const cart = (await cartModel.findOne({ user: req.user._id })) ||
            await cartModel.create({ user: req.user._id });

        // Get stock for this variant (or total product stock if no variant)
        const stock = variantId
            ? await stockOfVariantInProduct(productId, variantId)
            : product.stock ?? Infinity;

        const isProductAlreadyInCart = cart.items.some(
            item => item.product.toString() === productId &&
                (variantId ? item.variant?.toString() === variantId : !item.variant));

        if (isProductAlreadyInCart) {
            const quantityInCart = cart.items.find(
                item => item.product.toString() === productId &&
                    (variantId ? item.variant?.toString() === variantId : !item.variant)
            )?.quantity;

            if (quantityInCart + quantity > stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${stock} are available in stock. and you have already ${quantityInCart} in your cart`
                });
            }

            const filter = variantId
                ? { user: req.user._id, "items.product": productId, "items.variant": variantId }
                : { user: req.user._id, "items.product": productId, "items.variant": null };

            await cartModel.findOneAndUpdate(
                filter,
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            );

            return res.status(200).json({
                message: "Cart updated successfully",
                success: true
            });
        }

        if (quantity > stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${stock} are available in stock.`
            });
        }

        cart.items.push({
            product: productId,
            variant: variantId || null,
            quantity: quantity
        });

        await cart.save();

        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
        });

    }





    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }

}

export const getCart = async (req, res) => {
    const user = req.user
    try {

        let existingCart = await cartModel.findOne({ user: user._id });
        if (!existingCart) {
            existingCart = await cartModel.create({ user: user._id });
        }

        if (!existingCart.items || existingCart.items.length === 0) {
            return res.status(200).json({
                message: "Cart fetched successfully",
                success: true,
                data: { ...existingCart.toObject(), totalPrice: 0, currency: "INR", items: [] }
            });
        }

        let cart = await getCartDetails(user._id);

        if (!cart) {
            cart = await cartModel.create({ user: user._id, items: [] })
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            data: cart
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params
        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false })
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId)
        await cart.save()

        // Re-populate after save so the response matches getCart format
        const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")

        return res.status(200).json({
            message: "Item removed from cart",
            success: true,
            data: updatedCart
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params
        const { quantity } = req.body

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1", success: false })
        }

        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false })
        }

        const item = cart.items.find(item => item._id.toString() === itemId)
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart", success: false })
        }

        // Check stock
        const product = await productModel.findById(item.product)
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false })
        }

        let stock = null
        if (item.variant) {
            stock = await stockOfVariantInProduct(item.product, item.variant)
        } else {
            stock = product.stock ?? null
        }

        if (stock != null && quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} available in stock`,
                success: false
            })
        }

        item.quantity = quantity
        await cart.save()

        const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            data: updatedCart
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}


export const createPaymentOrder = async (req, res) => {
  
    const cart = await getCartDetails(req.user._id);
    if(!cart){
        return res.status(404).json({message:"Cart not found",success:false})
    }

    try {
        const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })
        
const payment = await PaymentModel.create({
    user:req.user._id,
    razorpay:{
        orderId:order.id,
    },
    price:{
        amount:cart.totalPrice,
        currency:cart.currency
    },
   orderItems:cart.items.map(items=>({
    productId:items.product._id,
    variant:items.variant,
    quantity:items.quantity,
    title:items.product.title,
    images:items.product.variants.images || items.product.images,
    description:items.product.description || items.product.description,
    price:{
       amount:items.product.variants.price.amount || items.product.price.ammount,
       currency:items.product.variants.price.currency || items.product.price.currency,
    },
   }))
})

        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            order
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: " error in payments", success: false })
    }
}

export const verifyPaymentOrder = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
    
        } = req.body

        const payment = await PaymentModel.findOne(
            { 
            "razorpay.orderId": razorpayOrderId ,
            status:"pending"

        })
        if(!payment){
            return res.status(404).json({message:"payment not found",success:false})
        }

        const isPaymentValid = validatePaymentVerification({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
        },razorpaySignature,process.env.RAZORPAY_KEY_SECRET)

        if(!isPaymentValid){
            payment.status ="failed"
            await payment.save()
            return res.status(400).json({message:"payment verfication failed",success:false})
        }

        payment.status = "paid"
        payment.razorpay.paymentId = razorpayPaymentId
        payment.razorpay.signature = razorpaySignature
        await payment.save()

        return res.status(200).json({message:"Payment verified successfully",success:true})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error in payment verfication",success:false})
        
    }
}

export const getPaymentDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await PaymentModel.findOne({
            "razorpay.orderId": orderId,
            user: req.user._id
        });

        if (!payment) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        return res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching order details", success: false });
    }
};