import { Router } from "express";
import { validateRegister } from "../Validator/auth.validator.js";
import { register } from "../Controllers/auth.controller.js";

const router=Router();

router.post("/register",validateRegister,register);

export default router;