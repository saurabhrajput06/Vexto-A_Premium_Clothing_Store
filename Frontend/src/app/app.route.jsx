import {createBrowserRouter} from "react-router";
import Register from "../Features/Auth/pages/register";
import Login from "../Features/Auth/pages/Login";
import CreateProduct from "../Features/Products/Pages/CreateProduct";


export const router=createBrowserRouter([
    {
        path:"/",
        element:<h1>hello world</h1>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/seller/products/create",
        element:<CreateProduct/>
    }
])