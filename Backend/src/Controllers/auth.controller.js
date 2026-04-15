import userModel from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


//function to send the token response
async function sendTokenResponse(user , res , message){
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
            console.log("User already exists");
            return res.status(400).json({message:"User already exists"});
        }
        const user=await userModel.create({
            email,
            contact,
            password,
            fullname,
            role:isSeller?"seller":"buyer",
            
        })
        console.log("User registered successfully");
        res.status(201).json({
            message:"User registered successfully",
            success:true,
            
        })



    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const login=async (req , res)=>{
    const {email , password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            console.log("User not found");
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid=await user.comparePassword(password);
        if(!isPasswordValid){
            console.log("Invalid password");
            return res.status(401).json({message:"Invalid password"});
        }
        await sendTokenResponse(user,res , "User logged in successfully");
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:`${error.message}`});
    }
}

export const googleCallback=async(req, res)=>{
 
 const email= req.user.emails[0].value;
 const profilePic=req.user.photos[0].value;
 const displayName=req.user.displayName;
 const id=req.user.id;

let user = await userModel.findOne({
    email
})
if(!user){
 user=await userModel.create({
    email,
    googleId:id,
    fullname:displayName,


 })



}

console.log(req.user);

const token = jwt.sign({id:user._id },
    config.jwt_secret,{expiresIn:"7d"}
)

res.cookie("token",token)


    res.redirect("http://localhost:5173/");
}