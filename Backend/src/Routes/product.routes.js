import express from "express";
import { AuthenticateSeller } from "../Middleware/auth.middleware.js";
import multer from "multer";
import { createProductValidator } from "../Validator/product.validator.js";
import { createProduct } from "../Controllers/product.controller.js";

const upload = multer({ storage: multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5 //5MB
    }
 });

const router = express.Router();
router.post("/",AuthenticateSeller,createProductValidator, upload .array("images",7),createProduct    )

export default router;  