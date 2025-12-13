import React, { useState } from "react";
import LocationSearch from "./LocationSearch";
import "../styles/BirthForm.css";

export default function BirthForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    timezone: '',
    timezoneOffset: 0,
    latitude: 0,
    longitude: 0,
    locationName: ''
  });

  const timezones = [
    { label: "UTC-12:00 (Baker Island)", offset: -12 },
    { label: "UTC-11:00 (Samoa)", offset: -11 },
    { label: "UTC-10:00 (Hawaii)", offset: -10 },
    { label: "UTC-09:30 (Marquesas)", offset: -9.5 },
    { label: "UTC-09:00 (Alaska)", offset: -9 },
    { label: "UTC-08:00 (Pacific Time)", offset: -8 },
    { label: "UTC-07:00 (Mountain Time)", offset: -7 },
    { label: "UTC-06:00 (Central Time)", offset: -6 },
    { label: "UTC-05:00 (Eastern Time)", offset: -5 },
    { label: "UTC-04:00 (Atlantic Time)", offset: -4 },
    { label: "UTC-03:30 (Newfoundland)", offset: -3.5 },
    { label: "UTC-03:00 (Argentina, Brazil)", offset: -3 },
    { label: "UTC-02:00 (Mid-Atlantic)", offset: -2 },
    { label: "UTC-01:00 (Azores)", offset: -1 },
    { label: "UTC+00:00 (London, GMT)", offset: 0 },
    { label: "UTC+01:00 (Paris, Berlin)", offset: 1 },
    { label: "UTC+02:00 (Cairo, Athens)", offset: 2 },
    { label: "UTC+03:00 (Moscow, Baghdad)", offset: 3 },
    { label: "UTC+03:30 (Tehran)", offset: 3.5 },
    { label: "UTC+04:00 (Dubai, Baku)", offset: 4 },
    { label: "UTC+04:30 (Kabul)", offset: 4.5 },
    { label: "UTC+05:00 (Pakistan, Kazakhstan)", offset: 5 },
    { label: "UTC+05:30 (India, Sri Lanka)", offset: 5.5 },
    { label: "UTC+05:45 (Nepal)", offset: 5.75 },
    { label: "UTC+06:00 (Bangladesh, Bhutan)", offset: 6 },
    { label: "UTC+06:30 (Myanmar)", offset: 6.5 },
    { label: "UTC+07:00 (Thailand, Vietnam)", offset: 7 },
    { label: "UTC+08:00 (China, Singapore)", offset: 8 },
    { label: "UTC+08:45 (Australia Central Western)", offset: 8.75 },
    { label: "UTC+09:00 (Japan, Korea)", offset: 9 },
    { label: "UTC+09:30 (Australia Central)", offset: 9.5 },
    { label: "UTC+10:00 (Australia Eastern)", offset: 10 },
    { label: "UTC+10:30 (Lord Howe Island)", offset: 10.5 },
    { label: "UTC+11:00 (New Caledonia)", offset: 11 },
    { label: "UTC+12:00 (New Zealand)", offset: 12 },
    { label: "UTC+12:45 (Chatham Islands)", offset: 12.75 },
    { label: "UTC+13:00 (Samoa, Tonga)", offset: 13 },
    { label: "UTC+14:00 (Line Islands)", offset: 14 }
  ];

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
    if (name === 'timezone') {
      const selected = timezones.find(tz => tz.label === value);
      setFormData(prev => ({
        ...prev,
        timezone: value,
        timezoneOffset: selected ? selected.offset : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      timezone: formData.timezoneOffset
    };
    onSubmit(submitData);
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              id="hour"
              name="hour"
              value={formData.time.split(':')[0] || '00'}
              onChange={(e) => {
                const hour = e.target.value;
                const minute = formData.time.split(':')[1] || '00';
                setFormData(prev => ({
                  ...prev,
                  time: `${hour}:${minute}`
                }));
              }}
              required
            >
              <option value="">Hour</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, '0')}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span style={{ color: "#c2ea66", fontSize: "1.2rem" }}>:</span>
            <select
              id="minute"
              name="minute"
              value={formData.time.split(':')[1] || '00'}
              onChange={(e) => {
                const minute = e.target.value;
                const hour = formData.time.split(':')[0] || '00';
                setFormData(prev => ({
                  ...prev,
                  time: `${hour}:${minute}`
                }));
              }}
              required
            >
              <option value="">Minute</option>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, '0')}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
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
            {timezones.map((tz, index) => (
              <option key={index} value={tz.label}>{tz.label}</option>
            ))}
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
