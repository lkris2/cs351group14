import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapView from "./components/mapView";
import Navbar from "./components/navbar";

export default function RidePage() {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from RequestCard’s navigate("/ride", { state: { ... } })
  const {
    pickupLat,
    pickupLong,
    dropLat,
    dropLong,
  } = location.state || {};

  useEffect(() => {
    // If someone opens /ride directly without state, send them back
    if (
      pickupLat == null ||
      pickupLong == null ||
      dropLat == null ||
      dropLong == null
    ) {
      console.error("Missing coordinates in route state, redirecting...");
      navigate("/request-rides");
      return;
    }

    async function fetchRoute() {
      // calling find_route
      try {
        const params = new URLSearchParams({
          pickup_lat: pickupLat,
          pickup_long: pickupLong,
          drop_lat: dropLat,
          drop_long: dropLong,
        });
        const res = await fetch(`http://127.0.0.1:8000/api/find_route/?${params}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        console.log("HTTP status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Server returned non-OK status", res.status, text);
          setRoute([]);
          return;
        }

        let data;
        try {
          data = await res.json();
        } catch (parseErr) {
          const text = await res.text();
          console.error(
            "Failed to parse JSON from backend:",
            parseErr,
            "body:",
            text
          );
          return;
        }

        console.log("Backend response:", data);
        console.log("Route from backend:", data.route);

        if (data.route && Array.isArray(data.route)) {
          // This keeps the same shape you already had working
          setRoute(data.route);
        } else {
          console.warn("No route in response, got:", data);
          setRoute([]);
        }
      } catch (err) {
        console.error("Error calling backend:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoute();
  }, [pickupLat, pickupLong, dropLat, dropLong, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      <main className="flex-1">
        {loading && (
          <div className="p-4 text-sm text-gray-600">Loading route...</div>
        )}

        <div style={{ height: "90vh" }}>
          <MapView path={route} />
        </div>
      </main>
    </div>
  );
}
