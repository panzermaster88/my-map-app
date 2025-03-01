import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "./App.css"; // Add this to apply CSS styles

const places = {
  restaurants: [
    { name: "Best Pizza", lat: 40.7128, lng: -74.006 },
    { name: "Fancy Sushi", lat: 40.7138, lng: -74.008 },
  ],
  hotels: [
    { name: "Luxury Stay", lat: 40.715, lng: -74.005 },
  ],
};

function SearchField() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Enter a location...",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

export default function DynamicMap() {
  const [selectedTypes, setSelectedTypes] = useState({ restaurants: true, hotels: true });

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="container"> {/* Apply full-page styling */}
      <div className="controls">
        {Object.keys(places).map((type) => (
          <label key={type} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedTypes[type]}
              onChange={() => toggleType(type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>
      <MapContainer center={[40.7128, -74.006]} zoom={13} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchField />
        {Object.entries(places).map(([type, locations]) =>
          selectedTypes[type]
            ? locations.map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                  <Popup>{loc.name}</Popup>
                </Marker>
              ))
            : null
        )}
      </MapContainer>
    </div>
  );
}
