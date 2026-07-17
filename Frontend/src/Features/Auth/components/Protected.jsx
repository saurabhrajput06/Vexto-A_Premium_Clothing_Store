import {useSelector} from "react-redux";
import {Navigate} from "react-router";
import Loader from "../../shared/Loader";


function Protected({children , role = "buyer"}){
    const {user , loading} = useSelector(state => state.auth)

    if(loading){
        return <Loader />
    }
    if(!user){
        return <Navigate to="/login" />
    }
    if(user.role !== role){
        return <Navigate to="/" />
    }
    return children
}

export default Protected