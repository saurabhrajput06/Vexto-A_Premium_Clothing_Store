import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import authRoutes from "./Routes/auth.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())





app.get("/", (req, res) => {
    res.send("Hello World!");
})
app.use("/api/auth",authRoutes);





export default app;
