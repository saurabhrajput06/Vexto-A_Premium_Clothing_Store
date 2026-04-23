import productModel from "../Models/product.model.js";


export const stockOfVariantInProduct = async(productId , variantId) => {
const product = await productModel.findOne({
    _id:productId,
    "variants._id":variantId
})



const stock = product.variants.find(variant => variant._id.toString() === variantId)?.stock

if (!stock){
    return null
}
return stock
}