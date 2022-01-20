import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function UserHome() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let loggedInUser;
        if (Object.keys(auth.get).length === 0) {
            try {
                const loggedString = localStorage.getItem("loggedInUser");
                if (loggedString.trim().length === 0) return navigate("/login");
                loggedInUser = JSON.parse(loggedString);
            } catch {
                return navigate("/login");
            }

            auth.set((prev) => loggedInUser);
        }
    }, []);

    return <div>{JSON.stringify(auth.get)}</div>;
}

export default UserHome;
