import { Router } from "express";
import { validateRegister,validateLogin } from "../Validator/auth.validator.js";
import { register,login } from "../Controllers/auth.controller.js";

const router=Router();

router.post("/register",validateRegister,register);

router.post("/login",validateLogin,login)

export default router;