import express from "express";
import { AuthenticateSeller } from "../Middleware/auth.middleware.js";
import multer from "multer";
import { createProductValidator } from "../Validator/product.validator.js";
import { createProduct, getSellerProducts } from "../Controllers/product.controller.js";


const upload = multer({ storage: multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5 //5MB
    }
 });

const router = express.Router();
/**
 * @router POST/api/Products
 * @descrption Create a new Product
 * @access Private {Seller only}
 */
router.post("/", AuthenticateSeller, upload.array("images",7), createProductValidator, createProduct)

/**
 * @route Get/api/products/selller
 * @description Get all Products
 * @access Public (seller only)
 */

router.get("/seller", AuthenticateSeller,getSellerProducts)


export default router;  