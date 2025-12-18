import React, { useState, useEffect } from "react";
import './App.css';
import MoonPhaseDisplay from './components/MoonPhaseDisplay';
import { WiMoonAltWaningCrescent4 } from 'react-icons/wi';

function App() {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoonPhase = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/moon-phase');
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
    fetchMoonPhase();
    // Refresh every minute
    const interval = setInterval(fetchMoonPhase, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1><WiMoonAltWaningCrescent4 size={50} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Lunar Tracker</h1>
        <p>Current Moon Phase & Zodiac Sign</p>
      </header>
      
      <main className="container">
        {loading && <div className="loading-message">Loading moon data...</div>}
        {error && <div className="error-message">{error}</div>}
        {moonData && !loading && (
          <div className="moon-section">
            <MoonPhaseDisplay moonData={moonData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
