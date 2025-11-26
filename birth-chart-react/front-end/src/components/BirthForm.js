import React, { useState } from "react";
import LocationSearch from "./LocationSearch";
import "../styles/BirthForm.css";

export default function BirthForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    timezone: 0,
    latitude: 0,
    longitude: 0,
    locationName: ''
  });

  const handleLocationSelect = ({ latitude, longitude, name }) => {
    setFormData(prev => ({ 
      ...prev, 
      latitude, 
      longitude,
      locationName: name 
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timezone' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="birth-form">
      <h2>Enter Your Birth Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Birth Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Birth Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timezone">Timezone Offset (hours):</label>
          <input
            type="number"
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            min="-12"
            max="14"
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label>Birth Location:</label>
          <LocationSearch onSelect={handleLocationSelect} />
        </div>

        <div className="coordinates">
          <p><strong>Location:</strong> {formData.locationName || 'Not selected'}</p>
          <p><strong>Latitude:</strong> {formData.latitude.toFixed(4)}</p>
          <p><strong>Longitude:</strong> {formData.longitude.toFixed(4)}</p>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
}
