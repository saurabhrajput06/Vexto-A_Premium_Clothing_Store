import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}


export const config = {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret:process.env.JWT_SECRET,
    
};