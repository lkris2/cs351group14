import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";

const mapContainerStyle={
    width: "100%",
    height: "100%"
};

const defaultLocation={
    lat: 41.8708,
    lng: -87.6505,
};

const mapOptions={
    disableDefaultUI: true,
    zoomControl: true
};

export default function map({requests}){
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    if (loadError) {
        return <div className="p-4 text-sm text-red-500">Map didn't load properly</div>;
    }

    if (!isLoaded){
        return <div className="p-4 text-sm text-red-500">Loading Map...</div>;
    }

    return(
        <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            center={defaultLocation}
            zoom = {13}
            options = {mapOptions}
        >
            {requests.map((r) => 
                r.pickupLocation ? (
                    <Marker
                        key={r.id}
                        position={r.pickupLocation}
                        label={{
                        text: r.initials ?? r.name[0],
                        fontSize: "12px",
                        fontWeight: "600",
                        }}
                    />
                ) : null
            )}
        </GoogleMap>
    );
}