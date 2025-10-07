import React, { useState } from "react";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&addressdetails=1&limit=5`
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
      console.error("Nominatim error:", err);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setResults([]);
    onSelect({ latitude: place.latitude, longitude: place.longitude });
  };

  return (
    <div className="location-search">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Enter birth location"
      />
      {results.length > 0 && (
        <ul className="suggestions">
          {results.map((place, idx) => (
            <li key={idx} onClick={() => handleSelect(place)}>
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
