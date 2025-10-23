import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom";

const Disconnect = () => {
    localStorage.clear();
    return <Navigate to={"/"} />
}
export default Disconnect