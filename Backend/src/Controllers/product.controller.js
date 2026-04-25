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
        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            seller: seller._id,
            images,
            variants: [{
                images,
                stock: 0,
                price: {
                    amount: priceAmount,
                    currency: priceCurrency || "INR"
                },
                attributes: { type: "Standard" }
            }]
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

// add product variant
export async function addProductVariant(req, res) {
    try {
        const { stock, priceAmount, priceCurrency, attributes } = req.body;
        const productId = req.params.id;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Verify seller owns product
        if (product.seller.toString() !== req.user._id.toString()) {
             return res.status(403).json({ message: "Unauthorized" });
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                    folder: "Vexto"
                });
            }));
        }

        const variant = {
            images,
            stock: Number(stock) || 0,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR"
            },
            attributes: attributes ? JSON.parse(attributes) : {}
        };

        product.variants.push(variant);
        await product.save();


        return res.status(201).json({ message: "Variant added successfully", product });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding variant" });
    }
}

// update variant stock
export async function updateVariantStock(req, res) {
    try {
        const { id: productId, variantId } = req.params;
        const { stock } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        variant.stock = Number(stock);
        await product.save();

        return res.status(200).json({ message: "Stock updated successfully", product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating stock" });
    }
}
