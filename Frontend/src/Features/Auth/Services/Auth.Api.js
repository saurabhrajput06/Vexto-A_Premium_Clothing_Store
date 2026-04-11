import axios from "axios";

const authApiInstance=axios.create({
    baseUrl:"http://localhost:3000/api/auth",
    withCredentials:true,
    
})

export async function register({email , fullname , contact , password}){
    try{
        const response=await authApiInstance.post("/register",{
            email ,
            contact,
            password,
            fullname,
            isSeller
        }) 
        return response.data;
    }catch(error){
        throw error;
    }
}

