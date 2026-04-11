//manage state and services in this file

import {setError , setLoading,setUser} from "../State/auth.slice"
import {register} from "../Services/Auth.Api"
import {useDispatch} from "react-redux"

export const useAuth=()=>{
const dispatch=useDispatch();

async function handleRegister({email , contact,password,fullname , isSeller=false}){

    const data=await register({email , contact,password,fullname ,isSeller})

    dispatch(setUser(data.user))

}
return   
{
    handleRegister
}  
}