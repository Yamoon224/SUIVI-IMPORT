import React, { FunctionComponent, useEffect, useState } from "react";
import ReactProps from "../../../types/ReactProps";
import { Navigate } from "react-router-dom";


const ProtectedRoute: FunctionComponent<ReactProps> = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if(token == null){
            setIsAuthenticated(false);
        }
    }, [])

    if(isAuthenticated == false){
        return <Navigate to={"/"} />
    }
    
    
    return(
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};
export default ProtectedRoute;