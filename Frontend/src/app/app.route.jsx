import { createBrowserRouter, Outlet } from "react-router";
import Register from "../Features/Auth/pages/Register";
import Login from "../Features/Auth/pages/Login";
import RootPage from "./RootPage";
import CreateProduct from "../Features/Products/Pages/CreateProduct";
import Dashboard from "../Features/Products/Pages/Dashboard";
import Cart from "../Features/Cart/pages/Cart";
import MyAccount from "../Features/Account/pages/MyAccount";

import Protected from "../Features/Auth/components/Protected";
import Home from "../Features/Products/Pages/Home";
import ProductDetails from "../Features/Products/Pages/ProductDetails";
import SellerProductDetails from "../Features/Products/Pages/SellerProductDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage />
    },
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/cart",
        element : <Protected>
            <Cart />
        </Protected>
    },
    {
        path: "/account",
        element: <Protected>
            <MyAccount />
        </Protected>
    },
    {
        path: "/product/:id",
        element: <ProductDetails />
    },
    {
        path: "/seller",
        element: <Outlet />,
        children: [
            {
                path: "products/create",
                element: <Protected role={"seller"}><CreateProduct /></Protected>
            },
            {
                path: "dashboard",
                element: <Protected role={"seller"}><Dashboard /></Protected>
            },
            {
                path: "products/:id",
                element: <Protected role={"seller"}><SellerProductDetails /></Protected>
            }
        ]
    }
])