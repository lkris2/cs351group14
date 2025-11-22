import hykerLogo from "../assets/hykerLogo.png";
import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className = "bg-[#58062F] text-white flex justify-between items-center px-10 py-4">
             <div className="flex items-center gap-3">
                <img className="w-24 h-24" src={hykerLogo}></img>
            </div>

            <div className="flex gap-10">
                <a className="hover:underline underline-offset-4 text-lg">See Requests</a>
                <a className="hover:underline underline-offset-4 text-lg" ><Link to="/RidePage">Ride</Link></a>
                <a className="hover:underline underline-offset-4 text-lg"><Link to="/ride">About</Link></a>
                <a className="hover:underline underline-offset-4 text-lg">Login</a>
            </div>
        </nav>
    )
}