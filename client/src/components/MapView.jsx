import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

// Fix default marker icons not loading with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// India's geographic center as a sensible default
const DEFAULT_CENTER = [22.9734, 78.6569];
const DEFAULT_ZOOM = 5;

function Recenter({ center, zoom }) {
  const map = useMap();
  if (center) {
    map.setView(center, zoom ?? map.getZoom());
  }
  return null;
}

export default function MapView({ donors = [], center, zoom, height = "500px" }) {
  return (
    <MapContainer
      center={center || DEFAULT_CENTER}
      zoom={zoom || DEFAULT_ZOOM}
      style={{ height, width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && <Recenter center={center} zoom={zoom} />}
      {donors.map((donor) => {
        const [lng, lat] = donor.location.coordinates;
        return (
          <Marker key={donor._id} position={[lat, lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">
                  {donor.user?.name || donor.userId?.name || "Donor"}
                </p>
                <p>Blood Group: {donor.bloodGroup}</p>
                <p>{donor.hospitalOrBank}</p>
                {donor.distanceMeters !== undefined && (
                  <p>{(donor.distanceMeters / 1000).toFixed(2)} km away</p>
                )}
                <Link to={`/donors/${donor._id}`} className="text-brand font-medium">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
