import mongoose from "mongoose";
import { config } from "./config.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.mongodb_uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
