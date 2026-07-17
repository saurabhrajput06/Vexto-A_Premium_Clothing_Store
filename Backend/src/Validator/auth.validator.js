import {body , validationResult} from "express-validator";


//handle the validation errors
function validateRequest(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}



//validate the all input information

export const validateRegister=[
    body("email")
    .isEmail().withMessage("Invalid email"),
    
    body("password")
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long"),
    
    body("fullname")
    .notEmpty().withMessage("Full name is required")
    .isLength({min:3}).withMessage("Full name must be at least 3 characters long"),
    
    body("contact")
    .notEmpty().withMessage("Contact is required")
    .matches(/^\+?\d{10,13}$/).withMessage("Contact must be a valid 10 to 13 digit number"),
    
    
    body("isSeller")
    .isBoolean().withMessage("isSeller must be a boolean value"),

//handle the validation errors
   validateRequest
]   

export const validateLogin=[
    body("email")
    .isEmail().withMessage("Invalid email"),
    
    body("password")
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long"),
    
    validateRequest
]