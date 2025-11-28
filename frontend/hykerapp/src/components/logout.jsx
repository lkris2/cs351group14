import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authcontext";

import HomePage from "../HomePage";

export default function Logout() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext); 


  useEffect(() => {
    // sessionStorage.removeItem("loggedIn")

    localStorage.setItem("isLoggedIn", false);  
    setIsLoggedIn(false); 

    navigate("/login");
  }, [navigate]);

  return HomePage;
}
