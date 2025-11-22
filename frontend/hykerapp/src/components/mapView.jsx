import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) return;
    map.fitBounds(positions);
  }, [positions, map]);

  return null;
}

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
    </MapContainer>
  );
}