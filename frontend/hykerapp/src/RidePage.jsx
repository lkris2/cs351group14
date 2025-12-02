// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import MapView from "./components/mapView";
// import Navbar from "./components/navbar";

// export default function RidePage() {
//   const [route, setRoute] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get data passed from RequestCard’s navigate("/ride", { state: { ... } })
//   const {
//     pickupLat,
//     pickupLong,
//     dropLat,
//     dropLong,
//   } = location.state || {};

//   useEffect(() => {
//     // If someone opens /ride directly without state, send them back
//     if (
//       pickupLat == null ||
//       pickupLong == null ||
//       dropLat == null ||
//       dropLong == null
//     ) {
//       console.error("Missing coordinates in route state, redirecting...");
//       navigate("/request-rides");
//       return;
//     }

//     async function fetchRoute() {
//       // calling find_route
//       try {
//         const params = new URLSearchParams({
//           pickup_lat: pickupLat,
//           pickup_long: pickupLong,
//           drop_lat: dropLat,
//           drop_long: dropLong,
//         });
//         const res = await fetch(`http://127.0.0.1:8000/api/find_route/?${params}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         console.log("HTTP status:", res.status);

//         if (!res.ok) {
//           const text = await res.text();
//           console.error("Server returned non-OK status", res.status, text);
//           setRoute([]);
//           return;
//         }

//         let data;
//         try {
//           data = await res.json();
//         } catch (parseErr) {
//           const text = await res.text();
//           console.error(
//             "Failed to parse JSON from backend:",
//             parseErr,
//             "body:",
//             text
//           );
//           return;
//         }

//         console.log("Backend response:", data);
//         console.log("Route from backend:", data.route);

//         if (data.route && Array.isArray(data.route)) {
//           // This keeps the same shape you already had working
//           setRoute(data.route);
//         } else {
//           console.warn("No route in response, got:", data);
//           setRoute([]);
//         }
//       } catch (err) {
//         console.error("Error calling backend:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchRoute();
//   }, [pickupLat, pickupLong, dropLat, dropLong, navigate]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar at the top */}
//       <Navbar />

//       <main className="flex-1">
//         {loading && (
//           <div className="p-4 text-sm text-gray-600">Loading route...</div>
//         )}

//         <div style={{ height: "90vh" }}>
//           <MapView path={route} />
//         </div>
//       </main>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MapView from "./components/mapView";
import Navbar from "./components/navbar";

export default function RidePage() {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState([]);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) {
      navigate("/");
      return;
    }

    async function loadRideAndRoute() {
      try {
        // 1) Fetch ride details
        const res = await fetch(
          `http://127.0.0.1:8000/api/rides/${rideId}/`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching ride:", data.error);
          navigate("/");
          return;
        }

        setRide(data);

        // 2) If we have pickup/dropoff coords, fetch the route
        if (data.pickup && data.dropoff) {
          const params = new URLSearchParams({
            pickup_lat: data.pickup.lat,
            pickup_long: data.pickup.long,
            drop_lat: data.dropoff.lat,
            drop_long: data.dropoff.long,
          });

          const routeRes = await fetch(
            `http://127.0.0.1:8000/api/find_route/?${params}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!routeRes.ok) {
            const text = await routeRes.text();
            console.error(
              "Server returned non-OK for route:",
              routeRes.status,
              text
            );
            setRoute([]);
          } else {
            const routeData = await routeRes.json();
            if (routeData.route && Array.isArray(routeData.route)) {
              setRoute(routeData.route);
            } else {
              console.warn("No route in response:", routeData);
              setRoute([]);
            }
          }
        } else {
          console.warn("Ride is missing pickup/dropoff coords");
        }
      } catch (err) {
        console.error("Error loading ride/route:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRideAndRoute();
  }, [rideId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#58062F]">Loading ride details…</p>
        </main>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-600">Ride not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: confirmation / ride details */}
          <div className="bg-white/90 rounded-3xl shadow-xl px-8 py-8 border border-pink-100 flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ff3ba7] mb-2">
              Ride confirmed
            </p>
            <h1 className="text-3xl font-semibold text-[#58062F] mb-3">
              You’re all set for your trip 🚗
            </h1>

            <p className="text-sm text-[#58062F]/80 mb-6">
              Here are your ride details. Share this screen with your rider /
              driver if needed.
            </p>

            <div className="bg-[#fdf4fa] rounded-2xl px-4 py-3 mb-6 flex flex-col gap-2">
              <div className="flex justify-between text-xs uppercase tracking-wide text-[#58062F]/70">
                <span>Pickup</span>
                <span>Drop-off</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#58062F] truncate">
                    {ride.pickup?.label || "Pickup location"}
                  </p>
                </div>
                <div className="h-px flex-1 border-t border-dashed border-[#ff8ac7]" />
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-[#58062F] truncate">
                    {ride.dropoff?.label || "Drop-off location"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#58062F] mb-4">
              <p>
                <strong>Rider:</strong>{" "}
                {ride.rider?.name || "Unknown rider"}
              </p>
              <p>
                <strong>Driver:</strong>{" "}
                {ride.driver?.name || "Waiting for driver"}
              </p>
              <p>
                <strong>Status:</strong> {ride.status}
              </p>
            </div>

            <p className="text-xs text-[#58062F]/60 mt-auto">
              Make sure you both agree on a safe meeting point and check your
              route before starting the trip.
            </p>
          </div>

          {/* RIGHT: Map */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[70vh]">
            <MapView path={route} />
          </div>
        </div>
      </main>
    </div>
  );
}
 
