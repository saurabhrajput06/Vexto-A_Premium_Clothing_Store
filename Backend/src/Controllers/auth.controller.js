import userModel from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


//function to send the token response
async function sendTokenResponse(user , res , message){
    const token = jwt.sign({id:user._id },
        config.jwt_secret,{expiresIn:"7d"}
    );
    const isDev = config.NODE_ENV.startsWith("dev");
   
    // sendTokenResponse aur baki jagah par aap direct ye bhi likh sakte hain production ke liye:
res.cookie("token", token, {
    secure: true, // Render explicitly HTTPS deta hai
    sameSite: "none", // Cross-domain request ke liye zaroori hai
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
});
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
        
        // ❌ Is puraane res.status(201) ko hata kar direct token bhejo:
        await sendTokenResponse(user, res, "User registered successfully"); 
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

    const isDev = config.NODE_ENV.startsWith("dev");
    res.cookie("token", token, {
        secure: !isDev,
        sameSite: !isDev ? "none" : "lax",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.redirect(config.frontend_url);
}

export const getMe = async (req , res)=>{
    const user = req.user;
    res.status(200).json({
        message:"User fetched successfully",
        success:true , 
        user:{
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role
        }
    })
}

export const logout = async (req, res) => {
    const isDev = config.NODE_ENV.startsWith("dev");
    res.clearCookie("token", {
        secure: !isDev,
        sameSite: !isDev ? "none" : "lax",
        httpOnly: true
    });
    res.status(200).json({
        message: "User logged out successfully",
        success: true
    });
};