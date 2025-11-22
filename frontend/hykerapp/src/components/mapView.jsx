import {MapContainer, TileLayer, Polyline, Marker, Popup} from "react-leaflet"
import L from "leaflet"

export default function MapView({ route }){
    const polyline = route.map(p => {p.lat, p.lon});
    return(
        <MapContainer
            center = {[41.87, -87.65]}
            zoom = {14}
            style = {{height: "100vh", width: "100%"}}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {route.length > 0 && (
                <Polyline positions={polyline}/>
            )}

        </MapContainer>
    );
}