import hykerLogo from "../assets/hykerLogo.png";
export default function Navbar(){
    return(
        <>
        <nav className="bg-[#58062F] text-white flex justify-between items-center px-10 border-b-4 border-b-(0xd02e7fff)">
            <div className="flex items-center gap-3">
                <img className="w-24 h-24" src={hykerLogo}></img>
                {/* <h1 className="text-xl font-bold">Hyker</h1> */}
            </div>
            <div className="flex gap-10">
                <a className="hover:underline underline-offset-4 text-lg">See Requests</a>
                <a className="hover:underline underline-offset-4 text-lg">Ride</a>
                <a className="hover:underline underline-offset-4 text-lg">About</a>
                <a className="hover:underline underline-offset-4 text-lg">Login</a>
            </div>
        </nav>
        
        </>
    )
}