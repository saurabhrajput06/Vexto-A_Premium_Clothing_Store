import { Router } from "express";
import { validateRegister, validateLogin } from "../Validator/auth.validator.js";
import { register, login, googleCallback } from "../Controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback", passport.authenticate("google", { failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login", 
    session: false 
}), googleCallback)

export default router;