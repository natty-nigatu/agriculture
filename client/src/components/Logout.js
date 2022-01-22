import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Logout() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.set({});
        localStorage.removeItem("loggedInUser");
        navigate("/");
    });

    return <div></div>;
}

export default Logout;
