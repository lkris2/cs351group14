import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();   

export function AuthProvider({ children }) {  
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem("loggedIn") === "true"
    );

    useEffect(() => {
        sessionStorage.setItem("loggedIn", isLoggedIn ? "true" : "false");
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}
