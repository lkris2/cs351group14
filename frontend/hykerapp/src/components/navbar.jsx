import hykerLogo from "../assets/hykerLogo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../Authcontext";
import { useContext, useEffect, useState } from "react";


export default function Navbar(){

    const { isLoggedIn } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(() => {
        try { return sessionStorage.getItem('profileAvatar') || null; } catch (err) { return null; }
    });

    useEffect(() => {
        // update when login state changes
        try { setAvatar(sessionStorage.getItem('profileAvatar') || null); } catch (err) { /* ignore */ }

        const handler = () => {
            try { setAvatar(sessionStorage.getItem('profileAvatar') || null); } catch (err) { /* ignore */ }
        };
        window.addEventListener('profileAvatarChanged', handler);
        return () => window.removeEventListener('profileAvatarChanged', handler);
    }, [isLoggedIn]);
    // const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

    return(
        <nav className = "bg-[#58062F] text-white flex justify-between items-center px-10 py-4">
             <div className="flex items-center gap-3">
                <img className="w-24 h-24" src={hykerLogo}></img>
            </div>

            <div className="flex gap-10">
                {isLoggedIn && (
                    <Link
                        to="/request-rides"
                        className="hover:underline underline-offset-4 text-lg"
                    >
                        See Requests
                    </Link>
                )}
                {isLoggedIn && (
                    <Link
                        to="/find-ride"
                        className="hover:underline underline-offset-4 text-lg"
                    >
                        Ride
                    </Link>
                )}
                <Link
                    to="/about"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    About
                </Link>
                {/* <Link
                    to="/login"
                    className="hover:underline underline-offset-4 text-lg"
                >
                    Login
                </Link>
                {/* <button onClick={handleLogout} className="hover:underline underline-offset-4 text-lg">
                    Log Out
                </button> */}

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

                {isLoggedIn && (
                    <Link to="/profile" aria-label="Profile" title="Profile" className="hover:opacity-90 text-lg flex items-center">
                        {avatar ? (
                            <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a3 3 0 110 6 3 3 0 010-6zm0 11c-3.866 0-7-3.134-7-7h14c0 3.866-3.134 7-7 7z" />
                            </svg>
                        )}
                        <span className="sr-only">Profile</span>
                    </Link>
                )}
            </div>
        </nav>
    )
}