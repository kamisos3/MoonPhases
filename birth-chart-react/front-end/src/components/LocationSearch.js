import React, { useState } from "react";
import "../styles/LocationSearch.css";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&limit=5`
      );
      const data = await res.json();
      setResults(
        data.map((place) => ({
          name: place.display_name,
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
        }))
      );
    } catch (err) {
      console.error("Location search error:", err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setResults([]);
    onSelect({ 
      latitude: place.latitude, 
      longitude: place.longitude,
      name: place.name
    });
  };

  return (
    <div className="location-search">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search location (city, country)..."
        className="location-input"
      />
      {searching && <p className="searching">Searching...</p>}
      {results.length > 0 && (
        <ul className="suggestions">
          {results.map((place, index) => (
            <li key={index} onClick={() => handleSelect(place)}>
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
