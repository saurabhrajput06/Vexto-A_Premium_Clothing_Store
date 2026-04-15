import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined");
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");
}





export const config = {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret:process.env.JWT_SECRET,
    google_client_id:process.env.GOOGLE_CLIENT_ID,
    google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV:process.env.NODE_ENV||"development",
    imagekit_private_key:process.env.IMAGEKIT_PRIVATE_KEY,
};