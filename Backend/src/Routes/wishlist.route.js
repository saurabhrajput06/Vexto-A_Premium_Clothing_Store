import express from "express";
import { Router } from "express";
import { AuthenticateUser } from "../Middleware/auth.middleware.js";
import { toggleWishlist ,getWishlist } from "../Controllers/wishlist.controller.js";


const router = Router();

router.post("/toggle/:productId", AuthenticateUser , toggleWishlist);

router.post("/toggle/:productId/:variantId", AuthenticateUser , toggleWishlist);

//get wishlist

router.get("/", AuthenticateUser , getWishlist);



export default router;