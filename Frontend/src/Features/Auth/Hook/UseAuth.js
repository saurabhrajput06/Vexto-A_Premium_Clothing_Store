//manage state and services in this file

import {setError , setLoading,setUser} from "../State/auth.slice"
import {register,login,getMe, logout} from "../Services/auth.api"
import {useDispatch} from "react-redux"

export const useAuth=()=>{
const dispatch=useDispatch();

async function handleRegister({email , contact,password,fullname , isSeller=false}){

    const data=await register({email , contact,password,fullname ,isSeller})

    dispatch(setUser(data.user))
    return data.user


}

//handle login
async function handleLogin({email , password}){

    const data=await login({email , password})
    //set user in state
    dispatch(setUser(data.user))
    return data.user
}


async function handleGetMe(){
    try{
    dispatch(setLoading(true))
    const data=await getMe();
    dispatch(setUser(data.user))
    dispatch(setLoading(false))
    }
    catch(error){
        dispatch(setError(error.message || "Something went wrong"))
    }
    finally{
        dispatch(setLoading(false))
    }
}

async function handleLogout() {
    try {
        await logout();
        dispatch(setUser(null));
    } catch (error) {
        console.log("Error logging out", error);
    }
}

return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout
}  
}