import { useState } from "react";
import MapView from "./components/mapView";

export default function RidePage() {
  const [route, setRoute] = useState([]);

  const requestRide = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/request_ride/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider_id: 1,
          pickup_lat: 41.87,
          pickup_long: -87.65,
          drop_lat: 41.8787,
          drop_long: -87.6403,
        }),
      });

      console.log("HTTP status:", res.status);

      const data = await res.json();
      console.log("This is the backend response", data);
      console.log("This is the route array", data.route);

      if (data.route && Array.isArray(data.route)) {
        setRoute(data.route);
      } else {
        console.warn("No route in response, got:", data);
        setRoute([]);
      }
    } catch (err) {
      console.error("Error calling backend:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={requestRide} style={{ padding: "10px", margin: "10px" }}>
        Request Ride
      </button>

      <div style={{ height: "90vh" }}>
        <MapView path={route} />
      </div>
    </div>
  );
}
