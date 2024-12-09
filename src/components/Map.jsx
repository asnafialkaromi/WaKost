import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../api/supabaseClient";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Map() {
  const [locations, setLocations] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState("");

  // Fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) console.error("Error fetching locations:", error);
      else setLocations(data);
    };

    fetchLocations();
  }, []);

  // Save new location to Supabase
  const saveLocation = async () => {
    if (!newLocationName || !clickedLocation) return;

    const { data, error } = await supabase.from("location").insert([
      {
        name: newLocationName,
        latitude: clickedLocation.latitude,
        longitude: clickedLocation.longitude,
      },
    ]);

    if (error) {
      console.error("Error saving location:", error);
    } else {
      setLocations([...locations, data[1]]);
      setClickedLocation(null); // Clear clicked location after saving
      setNewLocationName(""); // Clear the input field
    }
  };

  // Custom component to handle map click events
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickedLocation({ latitude: lat, longitude: lng });
      },
    });
    return clickedLocation ? (
      <Marker position={[clickedLocation.latitude, clickedLocation.longitude]}>
        <Popup>
          <div>
            <h4>Add New Location</h4>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
            <button onClick={saveLocation}>Save Location</button>
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <MapContainer
      center={[-7.4000599, 109.2316062]}
      zoom={20}
      style={{ height: "86vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            Latitude: {location.latitude}
            <br />
            Longitude: {location.longitude}
          </Popup>
        </Marker>
      ))}
      <LocationMarker />
    </MapContainer>
  );
}

export default Map;
