import axios from "axios";

const authApiInstance=axios.create({
    baseURL:"https://vexto-backend.onrender.com/api/auth",
    withCredentials:true,
    
})



export async function register({email , fullname ,contact , password,isSeller}){
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

export async function login({ email , password}){
    /**
     * http://localhost:5173/api/auth/login
     */
    const response= await authApiInstance.post("/login",{
        email,
        password
    })
    return response.data;

}

export async function getMe(){
    const response = await authApiInstance.get("/me")
    return response.data;
}

export async function logout(){
    const response = await authApiInstance.get("/logout")
    return response.data;
}
