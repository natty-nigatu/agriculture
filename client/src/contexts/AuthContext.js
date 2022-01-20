import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [get, set] = useState({});

    return (
        <AuthContext.Provider value={{get, set}}>
            {children}
        </AuthContext.Provider>
    );
}
