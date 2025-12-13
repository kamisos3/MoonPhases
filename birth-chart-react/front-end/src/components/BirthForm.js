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
          <label htmlFor="timezone">Timezone:</label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Timezone</option>
            <option value="-12">UTC-12:00 (Baker Island)</option>
            <option value="-11">UTC-11:00 (Samoa)</option>
            <option value="-10">UTC-10:00 (Hawaii)</option>
            <option value="-9.5">UTC-09:30 (Marquesas)</option>
            <option value="-9">UTC-09:00 (Alaska)</option>
            <option value="-8">UTC-08:00 (Pacific Time)</option>
            <option value="-7">UTC-07:00 (Mountain Time)</option>
            <option value="-6">UTC-06:00 (Central Time)</option>
            <option value="-5">UTC-05:00 (Eastern Time)</option>
            <option value="-4">UTC-04:00 (Atlantic Time)</option>
            <option value="-3.5">UTC-03:30 (Newfoundland)</option>
            <option value="-3">UTC-03:00 (Argentina, Brazil)</option>
            <option value="-2">UTC-02:00 (Mid-Atlantic)</option>
            <option value="-1">UTC-01:00 (Azores)</option>
            <option value="0">UTC+00:00 (London, GMT)</option>
            <option value="1">UTC+01:00 (Paris, Berlin)</option>
            <option value="2">UTC+02:00 (Cairo, Athens)</option>
            <option value="3">UTC+03:00 (Moscow, Baghdad)</option>
            <option value="3.5">UTC+03:30 (Tehran)</option>
            <option value="4">UTC+04:00 (Dubai, Baku)</option>
            <option value="4.5">UTC+04:30 (Kabul)</option>
            <option value="5">UTC+05:00 (Pakistan, Kazakhstan)</option>
            <option value="5.5">UTC+05:30 (India, Sri Lanka)</option>
            <option value="5.75">UTC+05:45 (Nepal)</option>
            <option value="6">UTC+06:00 (Bangladesh, Bhutan)</option>
            <option value="6.5">UTC+06:30 (Myanmar)</option>
            <option value="7">UTC+07:00 (Thailand, Vietnam)</option>
            <option value="8">UTC+08:00 (China, Singapore)</option>
            <option value="8.75">UTC+08:45 (Australia Central Western)</option>
            <option value="9">UTC+09:00 (Japan, Korea)</option>
            <option value="9.5">UTC+09:30 (Australia Central)</option>
            <option value="10">UTC+10:00 (Australia Eastern)</option>
            <option value="10.5">UTC+10:30 (Lord Howe Island)</option>
            <option value="11">UTC+11:00 (New Caledonia)</option>
            <option value="12">UTC+12:00 (New Zealand)</option>
            <option value="12.75">UTC+12:45 (Chatham Islands)</option>
            <option value="13">UTC+13:00 (Samoa, Tonga)</option>
            <option value="14">UTC+14:00 (Line Islands)</option>
          </select>
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
