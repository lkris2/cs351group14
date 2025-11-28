import Navbar from "./components/navbar";
import RequestCard from "./components/requestCard";
import Map from "./components/map";
import { useNavigate, useNavigation } from "react-router-dom";


export default function RequestRides({requests}){

    const navigate = useNavigate()
    function handleOfferRide(request) {
        navigate("/ride", {
        state: {
            riderId: 1, // placeholder
            pickupLat: request.pickupLocation.lat,
            pickupLong: request.pickupLocation.lng,
            dropLat: request.dropoffLocation.lat,
            dropLong: request.dropoffLocation.lng,
        },
        });
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
            <Navbar />

            <main className="flex-1 flex justify-center px-4 py-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-4 md:px-16">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-semibold text-[#58062F]">
                                    Ride Requests Near You
                                </h1>
                                <p className="text-sm text-[#58062F]/80 mt-1">
                                    Choose a request and offer a ride as a driver
                                </p>
                            </div>
                        </div>
                    

                        {/* <div className="flex gap-4 text-sm">
                            <select className="px-3 py-2 rounded-full bg-white shadow-sm border border-pink-100 text-[#58062F]">
                                <option>Any day</option>
                                <option>Today</option>
                                <option>Tomorrow</option>
                                <option>This Weeky</option>
                            </select>
                            <select className="px-3 py-2 rounded-full bg-white shadow-sm border border-pink-100 text-[#58062F]">
                                <option>Any distance</option>
                                <option>Within 5 miles</option>
                                <option>Within 2 miles</option>
                            </select>
                        </div> */}
                        <div className="flex flex-col gap-5">
                            {requests.map((req) => (
                                <RequestCard key={req.id} request={req} />
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[85vh]">
                            <Map requests={requests} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}