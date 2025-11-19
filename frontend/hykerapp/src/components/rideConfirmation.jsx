import {useLocation, useNavigate} from "react-router-dom"
import Navbar from "./navbar"

export default function rideConfirmation(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const request = state?.request;

    if(!request){
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
                <Navbar/>
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                        <h1 className="text-2xl font-semibold text-[#58062F] mb-3">
                            Sorry ride confimation failed
                        </h1>
                        <p className="text-sm text-[#58062F]/80 mb-6">
                            We couldn&apos;t find the ride details. Please go back to the see request page accept a rider
                        </p>
                        <button
                            onclick = {() => navigate("/requests")}
                            className = "px-6 py-2 rounded-full bg-[#ff3ba7] text-white text-sm font-semibold shadow-sm hover:bg-[#ff5fb6] active:scale-[0.97] transition"
                        >
                            Back to Ride Requests
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const {name, from , to, time, note} = request;
    return(
        <div className = "min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
            <Navbar/>
            <main className="flex-1 flex justify-center px-4 py-10">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
                    <section className="flex-1 bg-[#58062F] rounded-3xl shadow-2xl text-white px-8 py-8 flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                            Ride Accepted
                        </h2>
                        <div className="bg-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center text-lg font-semibold text-[#58062F]">
                                {name?.[0] ?? "R"}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-wide text-pink-200">
                                    You&apos;re giving a ride to
                                </p>
                                <p className="text-lg font-semibold">{name}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl text-[#58062F] p-5 mb-6 text-sm space-y-2">
                            <p className="font-semibold text-base mb-2">
                                Trip Details
                            </p>
                            <p>
                                <span className="font-medium">From:</span> {from}
                            </p>
                            <p>
                                <span className="font-medium">To:</span> {to}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span> {time}
                            </p>
                            {note && (
                                <p className="text-xs text-[#58062F]/80 mt-2">
                                    <span className="font-medium">Note:</span> {note}
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-pink-100/90 mb-4">
                            We&apos;ll share your ride details with {name} so you can coordinate pickup.
                        </p>
                        <div className="mt-auto flex flex-wrap gap-3">
                            <button
                                onclick = {() => navigate("/requests")}
                                className = "px-6 py-2 rounded-full bg-[#ff3ba7] text-white text-sm font-semibold shadow-sm hover:bg-[#ff5fb6] active:scale-[0.97] transition"
                            >
                                Back to Ride Requests
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}