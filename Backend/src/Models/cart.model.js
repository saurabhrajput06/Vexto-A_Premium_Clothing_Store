import mongoose from "mongoose";
import priceSchema from "./price.schema.js";
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: priceSchema,
                required: false
            }


        }
    ]

})

const cartModel = mongoose.model("cart", cartSchema)
export default cartModel