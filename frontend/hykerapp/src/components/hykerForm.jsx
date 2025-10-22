import { useState } from "react";
import InputField from "./inputField.jsx";
import riderCircle from "./riderCircle.jsx";
import { Input } from "postcss";

export default function HykerForm(){
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [time, setTime] = useState("");

    const riders = [
        { drivername: "Fernando", numMiles: "0.2 miles" },
        { drivername: "Nelly", numMiles: "0.2 miles" },
        { drivername: "Tiana", numMiles: "0.4 miles"},
        { drivername: "Rivera", numMiles: "0.6 miles" },
        { drivername: "Lesliana", numMiles: "0.8 miles" },
        { drivername: "Pressley", numMiles: "0.8 miles" },
    ];

    return(
        <div className="bg-[#4B002A] text-white w-[380px] p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Hitch a Ride</h2>
            </div>
            <div className="flex flex-col gap-3">
                <InputField
                    icon = ":)"
                    placeholder="Pickup Location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)} />
                <InputField
                    icon = ":)"
                    placeholder="Drop-off Location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)} />
                <InputField
                    icon = ":)"
                    isSelect={true}
                    value = {time}
                    onChange={(e) => setTime(e.target.value)} />
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md py-2 font-semibold">Search</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {riders.map((rider, index) => (
                    <riderCircle key = {index} drivername={rider.drivername} numMiles={rider.numMiles} />
                ))}
            </div>

        </div>
    );
}