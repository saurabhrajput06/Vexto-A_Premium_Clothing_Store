import express from "express"
import { AuthenticateUser } from "../Middleware/auth.middleware.js";
import { validateAddToCart, validateUpdateCartItem, validateRemoveFromCart } from "../Validator/cart.validator.js";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../Controllers/cart.controler.js";




const router = express.Router();

/**
 * @method : POST
 * @url : /cart/:productId/:variantId
 * @description : Add a product to the cart
 * @access : private
 * @argument productId - id of the product
 * @argument variantId - id of the variant
 * @argument body - { quantity: number }
 * @response 200 - Cart with the added product
 */

router.post("/add/:productId/:variantId", AuthenticateUser, validateAddToCart, addToCart)

router.post("/add/:productId", AuthenticateUser, validateAddToCart, addToCart);


router.get("/", AuthenticateUser, getCart)

router.delete("/item/:itemId", AuthenticateUser, validateRemoveFromCart, removeFromCart)

router.patch("/item/:itemId", AuthenticateUser, validateUpdateCartItem, updateCartItem)


export default router
