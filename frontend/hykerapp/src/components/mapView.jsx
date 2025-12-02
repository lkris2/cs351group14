import React, { useEffect, useState} from "react";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import pinkdot from "../assets/pink-dot.png";

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) return;
    map.fitBounds(positions);
  }, [positions, map]);

  return null;
}

// adding geolocation
// updates position w long and lat


const indicatorIcon = L.icon({
  iconUrl: "../assets/pink-dot.png",  
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);

    useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current position:", latitude, longitude);
      },
      (error) => {
        console.error("Error getting position:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

      return () => { navigator.geolocation.clearWatch(watchId); }; 
  }, []);

  if (!position) { return null; }
  
  return (
    <>
      {position && (
        <Marker
          position={position}
          icon={indicatorIcon}
        />
      )}
    </>
  );
};

export default function MapView({ path }) {
  const hasPath = Array.isArray(path) && path.length > 0;
  const defaultCenter = [41.87, -87.65];  
  const positions = hasPath ? path : [defaultCenter];

  return (
    <MapContainer
      center={positions[0]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hasPath && (
        <>
          <Polyline positions={positions} pathOptions={{ color: "purple", weight: 5 }} />
          <FitBounds positions={positions} />
        </>
      )}

      <LocationMarker />
    </MapContainer>
  );
}