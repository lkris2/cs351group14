// src/components/FindRideMap.jsx
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const uicCenter = {
  lat: 41.8708,
  lng: -87.6505,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

// 🗺️ Popular destinations within ~10 miles of UIC
const popularDestinations = [
  {
    id: 1,
    name: "UIC Campus",
    position: { lat: 41.8708, lng: -87.6505 },
  },
  {
    id: 2,
    name: "Union Station",
    position: { lat: 41.8786, lng: -87.6405 },
  },
  {
    id: 3,
    name: "Willis Tower",
    position: { lat: 41.8789, lng: -87.6359 },
  },
  {
    id: 4,
    name: "Millennium Park",
    position: { lat: 41.8826, lng: -87.6226 },
  },
  {
    id: 5,
    name: "Navy Pier",
    position: { lat: 41.8917, lng: -87.6078 },
  },
  {
    id: 6,
    name: "Field Museum / Museum Campus",
    position: { lat: 41.8663, lng: -87.6079 },
  },
  {
    id: 7,
    name: "McCormick Place",
    position: { lat: 41.8513, lng: -87.6167 },
  },
  {
    id: 8,
    name: "Chinatown",
    position: { lat: 41.8539, lng: -87.6323 },
  },
  {
    id: 9,
    name: "Wrigley Field",
    position: { lat: 41.9484, lng: -87.6553 },
  },
];

export default function FindRideMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return <div className="p-4 text-sm text-red-500">Map didn't load properly</div>;
  }

  if (!isLoaded) {
    return <div className="p-4 text-sm text-[#58062F]">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={uicCenter}
      zoom={13}
      options={mapOptions}
    >
      {popularDestinations.map((place) => (
        <Marker
          key={place.id}
          position={place.position}
          label={{
            text: place.name,
            fontSize: "10px",
            fontWeight: "600",
          }}
        />
      ))}
    </GoogleMap>
  );
}
