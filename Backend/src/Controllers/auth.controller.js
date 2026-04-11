import userModel from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


//function to send the token response
async function sendTokenResponse(user , res){
    const token = jwt.sign({id:user._id },
        config.jwt_secret,{expiresIn:"7d"}
    );
res.cookie("token",token)

    res.status(200).json({
        message:"User registered successfully",
        success:true,
        token,
        user:{
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role
        }
    })
    
    await sendTokenResponse(user,res , "User registered successfully");

}



export const register=async (req , res)=>{
    const {email , contact , password , fullname,isSeller}=req.body;
    try{
        const ExistingUser=await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(ExistingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const user=await userModel.create({
            email,
            contact,
            password,
            fullname,
            role:isSeller?"seller":"buyer",
            
        })



    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
