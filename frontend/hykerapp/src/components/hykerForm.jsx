import { useState } from "react";
import { AiTwotoneEnvironment } from "react-icons/ai";
import { AiFillCar } from "react-icons/ai";
import { AiFillClockCircle } from "react-icons/ai";

import InputField from "./inputField.jsx";
import RiderCircle from "./riderCircle.jsx";
import trie from "../../backend_py/backend/wordsearch.js";
import { useNavigate } from "react-router-dom";
import getRides from "../App.jsx";

export default function HykerForm({ addRequest }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [time, setTime] = useState("");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestions1, setSuggestions1] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [dropDown1, setDropDown1] = useState(false);

  const navigate = useNavigate();

  // 🔹 Call OpenStreetMap Nominatim to get lat/lon for an address string
  async function geocodeAddress(query) {
    if (!query || query.trim() === "") return null;

    // Add "Chicago, IL" to bias results to your area
    const fullQuery = `${query}, Chicago, IL`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      fullQuery
    )}&limit=1`;

    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Geocoding error status:", res.status);
        return null;
      }

      const data = await res.json();
      if (!data || data.length === 0) {
        console.warn("No geocoding result for:", fullQuery);
        return null;
      }

      const first = data[0];
      return {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
      };
    } catch (err) {
      console.error("Geocoding fetch failed:", err);
      return null;
    }
  }

    async function handleSearch(){
      const pickupCoords = await geocodeAddress(pickupLocation);
      const dropoffCoords = await geocodeAddress(dropoffLocation);
      console.log(pickupLocation, dropoffLocation)
      console.log(pickupCoords, dropoffCoords)
      if (!pickupCoords || !dropoffCoords) {
          alert("Could not find those locations. Try a more specific name.");
          return;
      }

      // ensure user is logged in and we have the backend user id
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert('Please sign in before creating a ride request.');
        navigate('/login');
        return;
      }

      // let respBody = {};
      try {
        const res = await fetch("http://127.0.0.1:8000/api/request_ride/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rider_id: userId,
            pickup_lat: pickupCoords.lat,
            pickup_long: pickupCoords.lng,
            drop_lat: dropoffCoords.lat,
            drop_long: dropoffCoords.lng,
            pickup_s: pickupLocation,
            dropoff_s: dropoffLocation,
          }),
        });

        console.log("HTTP status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Server returned non-OK status", res.status, text);
          return;
        }

        // read response json to get created ride id (if backend returns it)
        let respBody = {};
        try {
          respBody = await res.json();
        } catch (e) {
          // ignore parse errors
        }
        console.log("resp: ", respBody)
        if (respBody.ride_id){
          localStorage.setItem("currentRideId", respBody.ride_id)
          localStorage.setItem("currentPickupSpot", pickupLocation)
          localStorage.setItem("currentDropoffSpot", dropoffLocation)
        }
        else{
          console.warn("Backend did not return ride_id")
        }

        // try {
        //   respBody = await res.json();
        // } catch (e) {
        //   // ignore parse errors
        // }
        navigate("/ride-match");
        // Persist a lightweight trip summary to the rider's profile trips so
        // the Profile page can show the newly created ride immediately.
        try {
          const uid = userId || 'anon';
          const key = `profileTrips:${uid}`;
          const stored = sessionStorage.getItem(key);
          const trips = stored ? JSON.parse(stored) : [];
          const newTrip = {
            id: respBody.ride_id || `ride-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            from: pickupLocation,
            to: dropoffLocation,
            notes: '',
            status: 'requested'
          };
          trips.unshift(newTrip);
          sessionStorage.setItem(key, JSON.stringify(trips));
          window.dispatchEvent(new Event('tripsUpdated'));
        } catch (err) {
          console.warn('Could not persist trip to sessionStorage', err);
        }
      } catch (err) {
        console.error("Error calling backend:", err);
      }
      // const handleRideCreated = async () => {
      //   await getRides(); // refetch list
      // };
      
    }

  return (
    <div className="bg-[#4B002A] text-white w-[380px] p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hitch a Ride</h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Pickup */}
        <InputField
          icon={<AiFillCar />}
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            const suggs = trie.getSuggestions(value);
            setSuggestions(suggs);
            setDropDown(true);

            setPickupLocation(value);
          }}
          options={suggestions}
        />

        {suggestions.length > 0 && dropDown && (
          <ul className="mt-10 ml-0 absolute bg-white border w-50 rounded shadow">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setPickupLocation(s);
                  setDropDown(false);
                }}
                className="p-2 text-black cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        {/* Dropoff */}
        <InputField
          icon={<AiTwotoneEnvironment />}
          placeholder="Drop-off Location"
          value={dropoffLocation}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            const suggs = trie.getSuggestions(value);
            setSuggestions1(suggs);
            setDropDown1(true);

            setDropoffLocation(value);
          }}
          options={suggestions1}  // ✅ correct
        />

        {suggestions1.length > 0 && dropDown1 && (
          <ul className="mt-23 ml-0 absolute bg-white border w-50 rounded shadow">
            {suggestions1.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setDropoffLocation(s);
                  setDropDown1(false);
                }}
                className="p-2 text-black cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        {/* Time */}
        <InputField
          icon={<AiFillClockCircle />}
          isSelect
          value={time}
          onChange={(e) => setTime(e.target.value)}
          options={["Pickup Now"]}
        />

        {/* Submit */}
        <button
          className="bg-pink-500 hover:bg-pink-600 rounded-md py-2 font-semibold"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}