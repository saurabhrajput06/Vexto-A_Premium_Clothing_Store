import { param, body, validationResult } from "express-validator";


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export const validateAddToCart = [
    param("productId").notEmpty().withMessage("Product ID is required"),
    param("variantId").optional().isMongoId().withMessage("Variant ID must be a valid Mongo ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateRequest
]

export const validateUpdateCartItem = [
    param("itemId").notEmpty().withMessage("Item ID is required"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateRequest
]

export const validateRemoveFromCart = [
    param("itemId").notEmpty().withMessage("Item ID is required"),
    validateRequest
]

export const validateClearCart = [
    validateRequest
]
