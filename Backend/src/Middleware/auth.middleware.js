import jwt from "jsonwebtoken";
import {config} from "../config/config.js";
import userModel from "../Models/user.model.js";

export const AuthenticateSeller = async (req , res , next)=>{
const token = req.cookies.token
if(!token){
    return res.status(401).json({message:"Unauthorized"})
}
//verify token
try{

    const decodedToken= jwt.verify(token,config.jwt_secret)
   
    const user = await userModel.findById(decodedToken.id)
    
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

 if (user.role !== "seller"){
    return res.status(403).json({message:"Forbidden"})
 }

    //attach user to request
    req.user = user
    //call next middleware
    next()
}
catch(error){
    return res.status(401).json({message:"Unauthorized"})
}
}