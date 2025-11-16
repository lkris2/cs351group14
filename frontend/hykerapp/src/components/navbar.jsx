import hykerLogo from "../assets/hykerLogo.png";
import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className = "bg-[#58062F] text-white flex justify-between items-center px-10 py-4">
             <div className="flex items-center gap-3">
                {/* Wrap the logo in a Link to go home */}
                <Link to="/"> 
                    <img className="w-24 h-24" src={hykerLogo} alt="Hyker Logo"></img>
                </Link>
            </div>

            <div className="flex gap-10">
                {/* 1. Corrected: Use only <Link> */}
                <Link to="/requests" className="hover:underline underline-offset-4 text-lg">See Requests</Link>
                
                {/* 2. Corrected: Use only <Link>, and let's assume the path is /find-ride */}
                <Link to="/find-ride" className="hover:underline underline-offset-4 text-lg">Ride</Link>
                
                {/* 3. Corrected: Use only <Link> */}
                <Link to="/about" className="hover:underline underline-offset-4 text-lg">About</Link>
                
                {/* 4. Corrected: Use only <Link> */}
                <Link to="/login" className="hover:underline underline-offset-4 text-lg">Login</Link>
            </div>
        </nav>
    )
}