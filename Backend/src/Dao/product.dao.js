import productModel from "../Models/product.model.js";


export const stockOfVariantInProduct = async(productId , variantId) => {
const product = await productModel.findOne({
    _id:productId,
    "variants._id":variantId
})

if (!product) return null

const variant = product.variants.find(variant => variant._id.toString() === variantId)

if (!variant || variant.stock == null){
    return null
}
return variant.stock
}