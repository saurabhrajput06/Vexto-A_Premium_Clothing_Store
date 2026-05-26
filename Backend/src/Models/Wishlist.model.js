import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const wishListSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
        items:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                variant:{
                    type:mongoose.Schema.Types.ObjectId,
                    required:false
                },
                price:{
                    type:priceSchema,
                    required:false
                }

            }

        ]
    }
) 

const wishlistModel = mongoose.model("wishlist",wishListSchema)

export default wishlistModel