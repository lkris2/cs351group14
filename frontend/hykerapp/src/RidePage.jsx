import {useState} from "react"
import MapView from "./components/mapView"

export default function RidePage() {
  const [route, setRoute] = useState([]);

  const requestRide = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/request_ride/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rider_id: 1,
        pickup_lat: 41.87,
        pickup_long: -87.65,
        drop_lat: 41.8787,
        drop_long: -87.6403,
      })
    });

    const data = await res.json();
    console.log(data);
    setRoute(data.route); 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={requestRide} style={{ padding: "10px", margin: "10px" }}>
        Request Ride
      </button>

      <div style={{ height: "90vh" }}>
        <MapView route={route} />
      </div>
    </div>
  );
}
