import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["INR","USD" ,"EUR","GBP","JPY"],
            default:"INR"
        }
    },

    images:[
        {
        url:{
            type:String,
            required:true
        }
    }
],

 


    // stock:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    // category:{
    //     type:String,
    //     required:true
    // },
    // brand:{
    //     type:String,
    //     required:true
    // },
    // rating:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    // numReviews:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    // reviews:[
    //     {
    //         user:{
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:"user"
    //         },
    //         name:{
    //             type:String,
    //             required:true
    //         },
    //         rating:{
    //             type:Number,
    //             required:true
    //         },
    //         comment:{
    //             type:String,
    //             required:true
    //         }
    //     }
    // ]
},
 {
    timestamps: true
})

const productModel = mongoose.model("Product", productSchema);
export default productModel;
