import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Default Leaflet marker icons reference files that don't bundle correctly
// under Vite — rebuild them from CDN URLs instead.
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView({ center, zoom = 12, markers = [], height = 420 }) {
  if (!center) return null;
  return (
    <div className="ticket overflow-hidden" style={{ height }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]} icon={icon}>
            <Popup>
              <span className="font-medium">{m.name}</span>
              {m.subtitle && <><br /><span className="text-xs">{m.subtitle}</span></>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
