import mongoose from "mongoose";
import WishlistModel from "../Models/wishlist.model.js";
import productModel from "../Models/product.model.js";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.params;

        // 1. Check karo ki kya user ki koi bhi wishlist pehle se bani hui hai
        let wishlist = await WishlistModel.findOne({ user: userId });

        // 2. CASE 1: Agar wishlist bilkul nahi hai (User pehli baar koi bhi product add kar raha hai)
        if (!wishlist) {
            wishlist = await WishlistModel.create({
                user: userId,
                items: [{ product: productId, variant: variantId || null }]
            });

            return res.status(201).json({
                success: true,
                message: "Item added to wishlist successfully",
                data: { product: productId, variant: variantId }
            });
        }

        // 3. CASE 2: Agar wishlist document pehle se hai, toh check karo kya YE SPECIFIC item array me hai?
        const itemIndex = wishlist.items.findIndex(
            (item) => 
                item.product.toString() === productId && 
                (!variantId || item.variant?.toString() === variantId)
        );

        if (itemIndex > -1) {
            // Item pehle se array me hai -> Iska matlab user ise REMOVE karna chahta hai
            wishlist.items.splice(itemIndex, 1);
            await wishlist.save();

            return res.status(200).json({
                success: true,
                message: "Item removed from wishlist successfully",
                data: { product: productId, variant: variantId }
            });
        } else {
            // Item array me nahi hai -> Iska matlab naya item ADD (push) karna hai
            wishlist.items.push({
                product: productId,
                variant: variantId || null
            });
            await wishlist.save();

            return res.status(200).json({
                success: true,
                message: "Item added to wishlist successfully",
                data: { product: productId, variant: variantId }
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const getWishlist = async (req , res)=>{
    try{
    const userId = req.user._id;

    const wishlist = await WishlistModel.findOne({user:userId}).populate({
        path:"items.product",
        select :"title price images.url description"
    }).populate({
        path:"items.variant",
        select :"price images attributes"
    })

    if(!wishlist || wishlist.items.length ===0){
        return res.status(200).json({
            success:true,
            message:" Wishlist is empty",
            items:[],
        })
    }
    return res.status(200).json({
        success:true,
        message:"wishlist fetched successfully",
        items: wishlist.items
    })
    }

catch(error){
    return res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message
    });
}
}