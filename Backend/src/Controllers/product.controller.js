import productModel from "../Models/product.model.js";
import userModel from "../Models/user.model.js";   
import { uploadFile } from "../Services/storage.service.js";


//@desc createProduct
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
//@desc getSellerProducts
export async function getSellerProducts(req , res){
    const seller =req.user
const product = await productModel.find({seller:seller._id})

return res.status(200).json({
    message:"Products fetched successfully",
    success:true,
    products:product
})
}

//fetchallproducts

export async function getAllProducts(req , res){
    const products =await productModel.find()

    return res.status(200).json({
        message:"Products fetched successfully",
        success:true,
        products
    })
}

//get product by id
export async function getProductById(req, res) {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching product" });
    }
}
