import cartModel from "../Models/cart.model.js";
import userModel from "../Models/user.model.js";
import productModel from "../Models/product.model.js";
import { stockOfVariantInProduct } from "../Dao/product.dao.js";


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
        let cart = await cartModel.findOne({ user: user._id }).populate("items.product")

        if (!cart) {
            cart = await cartModel.create({ user: user._id })
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