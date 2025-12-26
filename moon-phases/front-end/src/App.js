import React, { useState, useEffect } from "react";
import './App.css';
import MoonPhaseDisplay from './components/MoonPhaseDisplay';
import MoonCalendar from './components/MoonCalendar';
import { WiMoonAltWaningCrescent4 } from 'react-icons/wi';
import { FaCalendarAlt } from 'react-icons/fa';

function App() {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      setLocationPermission('not_supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setLocationPermission('granted');
        console.log('Location obtained:', location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
        // Still fetch moon data without location (will use UTC)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  const fetchMoonPhase = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = 'http://localhost:8000/moon-phase';
      
      // Add location parameters if available
      if (userLocation) {
        const params = new URLSearchParams({
          latitude: userLocation.latitude.toString(),
          longitude: userLocation.longitude.toString()
        });
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch moon phase data');
      }
      const data = await response.json();
      setMoonData(data);
    } catch (err) {
      setError(`Error fetching moon phase: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First get user location
    getUserLocation();
  }, []);

  useEffect(() => {
    // Fetch moon phase data when location is available or denied
    if (locationPermission !== null) {
      fetchMoonPhase();
      // Refresh every minute
      const interval = setInterval(fetchMoonPhase, 60000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, locationPermission]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="App">
      <header className="App-header" style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowCalendar(true)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid white',
            borderRadius: '50%',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          title="View Moon Phase Calendar"
        >
          <FaCalendarAlt />
        </button>
        <h1><WiMoonAltWaningCrescent4 size={50} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Lunar Tracker</h1>
        <hr style={{ 
          width: '80%', 
          border: 'none', 
          borderTop: '1px solid white', 
          margin: '20px auto' 
        }} />
      </header>
      
      {moonData && (
        <div style={{ 
          color: 'white', 
          textAlign: 'center',
          marginTop: '0.5px',
          marginBottom: '1px',
          fontSize: '16px'
        }}>
          <div>Current Local Time: {formatDate(moonData.datetime)}</div>
          {moonData.timezone && <div style={{ fontSize: '14px', opacity: '0.8', marginTop: '5px' }}>({moonData.timezone})</div>}
        </div>
      )}
      
      <main className="container">
        {loading && <div className="loading-message">Loading moon data...</div>}
        {error && <div className="error-message">{error}</div>}
        {moonData && !loading && (
          <div className="moon-section">
            <MoonPhaseDisplay moonData={moonData} />
          </div>
        )}
      </main>
      
      {showCalendar && <MoonCalendar onClose={() => setShowCalendar(false)} />}
    </div>
  );
}

export default App;
