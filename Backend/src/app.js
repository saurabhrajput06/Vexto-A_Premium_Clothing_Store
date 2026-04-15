import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import authRoutes from "./Routes/auth.routes.js";
import productRoutes from "./Routes/product.routes.js";
import cors from "cors";

//GoogleAuthentication
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {config} from "./config/config.js";




const app = express();

// app.use(cors({
//     origin:"http://localhost:5173",
//     methods:["GET","POST","PUT","DELETE"],
//     credentials:true,
// }));



app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID:config.google_client_id,
    clientSecret:config.google_client_secret,
    callbackURL:"/api/auth/google/callback",
    // scope:["profile","email"],
},
(accessToken,refreshToken,profile,done)=>{
    return done(null,profile);
}))




app.get("/", (req, res) => {
    res.send("Hello World!");
})

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);





export default app;
