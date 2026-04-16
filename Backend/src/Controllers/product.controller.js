import productModel from "../Models/product.model.js";
import userModel from "../Models/user.model.js";   
import { uploadFile } from "../Services/storage.service.js";

export async function createProduct(req , res){
    try{
        const {title , description , priceAmount , priceCurrency }=req.body;
        const seller =req.user
        const images= await Promise.all(req.files.map(async(file)=>{
            return await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname,
                folder:"Vexto"
            })
        }))
        const product =await productModel.create({
            title,
            description,
            price:{
                amount:priceAmount,
                currency:priceCurrency||"INR"
            },
            seller:seller._id,
            images
        })
        return res.status(201).json({message:"Product created successfully",product})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"error in product creating"})
    }
}

export async function getSellerProducts(req , res){
    const seller =req.user
const product = await productModel.find({seller:seller._id})

return res.status(200).json({
    message:"Products fetched successfully",
    success:true,
    product
})
}

