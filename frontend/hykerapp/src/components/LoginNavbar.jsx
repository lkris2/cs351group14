import hykerLogo from "../assets/hykerLogo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../Authcontext";
import { useContext } from "react";


export default function Navbar(){

    const { isLoggedIn } = useContext(AuthContext);
    // const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

    return(
        <nav className = "bg-[#58062F] text-white flex justify-between items-center px-10 py-4">
             <div className="flex items-center gap-3">
                <img className="w-24 h-24" src={hykerLogo}></img>
            </div>

            <div className="flex gap-10">
                <Link
                    to="/about"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    About
                </Link>

                {!isLoggedIn && (
                    <Link to="/login" className="hover:underline underline-offset-4 text-lg">
                        Login
                    </Link>
                )}

                {isLoggedIn && (
                    <Link to="/logout" className="hover:underline underline-offset-4 text-lg">
                        Logout
                    </Link>
                )}
            </div>
        </nav>
    )
}