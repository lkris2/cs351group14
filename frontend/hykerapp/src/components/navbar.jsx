import hykerLogo from "../assets/hykerLogo.png";
import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className = "bg-[#58062F] text-white flex justify-between items-center px-10 py-4">
             <div className="flex items-center gap-3">
                <img className="w-24 h-24" src={hykerLogo}></img>
            </div>

            <div className="flex gap-10">
                <Link
                    to="/requests"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    See Requests
                </Link>
                <Link
                    to="/RidePage"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    Ride
                </Link>
                <Link
                    to="/about"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    About
                </Link>
                <Link
                    to="/login"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    Login
                </Link>
            </div>
        </nav>
    )
}