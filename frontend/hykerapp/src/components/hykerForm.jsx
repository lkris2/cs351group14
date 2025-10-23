import { useState } from "react";
import { AiTwotoneEnvironment } from "react-icons/ai";
import { AiFillCar } from "react-icons/ai";
import { AiFillClockCircle } from "react-icons/ai";

import InputField from "./inputField.jsx";
import RiderCircle from "./riderCircle.jsx";
import { Input } from "postcss";
import trie from "../../backend/wordsearch.js";

export default function HykerForm(){
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [time, setTime] = useState("");
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const[dropDown, setDropDown] = useState(false); 

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
                    icon = {<AiFillCar/>}
                    placeholder="Pickup Location"
                    value={pickupLocation}
                    onChange={(e) => {
                        const value = e.target.value;
                        setInput(value);
                        setSuggestions(trie.getSuggestions(value));
                        console.log(suggestions);
                        setDropDown(true)
                        setPickupLocation(e.target.value)
                    }}
                    options={suggestions} 
                    />
                    {suggestions.length > 0 && dropDown && (
                        <ul className="mt-10 ml-0 absolute bg-white border w-50 rounded shadow">
                        {suggestions.map((s, i) => (
                            <li
                            key={i}
                            onClick={() => {
                                setPickupLocation(s)
                                setDropDown(false);
                            }}
                            className="p-2 text-black cursor-pointer"
                            >
                            {s}
                            </li>
                        ))}
                        </ul>
                    )}
                <InputField
                    icon = {<AiTwotoneEnvironment/>}
                    placeholder="Drop-off Location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)} />
                <InputField
                    icon = {<AiFillClockCircle/>}
                    isSelect
                    value = {time}
                    onChange={(e) => setTime(e.target.value)}
                    options={["Pickup Now", "Schedule for Later"]} />
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md py-2 font-semibold">Search</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {riders.map((rider, index) => (
                    <RiderCircle key = {index} drivername={rider.drivername} numMiles={rider.numMiles} />
                ))}
            </div>

        </div>
    );
}