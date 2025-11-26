import React from "react";
import "../styles/ChartDisplay.css";

export default function ChartDisplay({ chartData }) {
  if (!chartData) return null;

  // log all keys in chartData
  console.log("ChartData keys:", Object.keys(chartData));

  // Zodiac signs order and icons
  const ZODIAC_ICONS = {
    "Aries": "fas fa-ram",
    "Taurus": "fas fa-cow",
    "Gemini": "fas fa-gemini",
    "Cancer": "fas fa-crab",
    "Leo": "fas fa-lion",
    "Virgo": "fas fa-maiden",
    "Libra": "fas fa-scales",
    "Scorpio": "fas fa-scorpion",
    "Sagittarius": "fas fa-arrow",
    "Capricorn": "fas fa-fish-fins",
    "Aquarius": "fas fa-water",
    "Pisces": "fas fa-fish"
  };

  // Planet icons mapping
  const PLANET_ICONS = {
    "Sun": "fas fa-sun",
    "Moon": "fas fa-moon",
    "Mercury": "fas fa-mercury",
    "Venus": "fas fa-venus",
    "Mars": "fas fa-mars",
    "Jupiter": "fas fa-gavel",
    "Saturn": "fas fa-ring",
    "Uranus": "fas fa-planet",
    "Neptune": "fas fa-water-wave",
    "Pluto": "fas fa-circle",
    "Ascendant": "fas fa-arrow-up"
  };

  // Create SVG zodiac wheel
  const renderZodiacWheel = () => {
    const size = 400;
    const center = size / 2;
    const outerRadius = 150;
    const innerRadius = 90;

    return (
      <svg width={size} height={size} className="chart-canvas" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={center} cy={center} r={outerRadius} fill="#f9f9f9" stroke="#667eea" strokeWidth="2" />
        
        {/* Inner circle for planet area */}
        <circle cx={center} cy={center} r={innerRadius} fill="white" stroke="#e0e0e0" strokeWidth="1" />
        
        {/* Zodiac signs around the OUTER wheel (360 degrees) */}
        {Object.entries(ZODIAC_ICONS).map((entry, index) => {
          const [sign, icon] = entry;
          // Each zodiac sign takes up 30 degrees (360/12)
          const angle = (index * 30 - 90) * (Math.PI / 180);
          // Place zodiac signs in the outer ring
          const x = center + outerRadius * 0.85 * Math.cos(angle);
          const y = center + outerRadius * 0.85 * Math.sin(angle);
          
          return (
            <g key={`zodiac-${sign}`}>
              {/* Zodiac line dividers */}
              <line
                x1={center + innerRadius * Math.cos(angle)}
                y1={center + innerRadius * Math.sin(angle)}
                x2={center + outerRadius * Math.cos(angle)}
                y2={center + outerRadius * Math.sin(angle)}
                stroke="#ddd"
                strokeWidth="1"
              />
              {/* Zodiac icon and label */}
              <foreignObject
                x={x - 12}
                y={y - 12}
                width="24"
                height="24"
              >
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "10px"
                }}>
                  <i className={icon} style={{ fontSize: "14px", color: "#667eea" }}></i>
                </div>
              </foreignObject>
              {/* Zodiac label */}
              <text
                x={x}
                y={y + 15}
                textAnchor="middle"
                fontSize="9"
                fill="#999"
              >
                {sign.substring(0, 3)}
              </text>
            </g>
          );
        })}

        {/* Plot planets INSIDE the wheel */}
        {Object.entries(chartData)
          .filter(([planetName]) => {
            // Only show actual planets, not zodiac signs
            const validPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
            const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            return validPlanets.includes(planetName) && !zodiacSigns.includes(planetName);
          })
          .map(([planetName, data]) => {
            if (!data || !data.longitude) return null;
            
            // Position planet inside the inner circle based on longitude
            const angle = (data.longitude - 90) * (Math.PI / 180);
            const x = center + innerRadius * 0.7 * Math.cos(angle);
            const y = center + innerRadius * 0.7 * Math.sin(angle);
            
            const icon = PLANET_ICONS[planetName] || "fas fa-circle";
            const color = planetName === "Sun" ? "#FFD700" : planetName === "Moon" ? "#E0E0E0" : "#764ba2";
            
            return (
              <g key={`planet-${planetName}`}>
                {/* Planet circle background */}
                <circle cx={x} cy={y} r="14" fill="white" stroke={color} strokeWidth="2" />
                
                {/* Planet icon inside circle */}
                <foreignObject x={x - 10} y={y - 10} width="20" height="20">
                  <i className={icon} style={{ fontSize: "12px", color: color, display: "flex", alignItems: "center", justifyContent: "center" }}></i>
                </foreignObject>
              </g>
            );
          })}

        {/* Center point */}
        <circle cx={center} cy={center} r="3" fill="#667eea" />
      </svg>
    );
  };

  return (
    <div className="chart-display">
      <h2>Your Birth Chart</h2>
      
      <div className="chart-container">
        {/* Zodiac wheel on the left */}
        <div className="zodiac-wheel">
          {renderZodiacWheel()}
        </div>

        {/* Planet details on the right */}
        <div className="planets-list">
          <div className="chart-grid">
            {Object.entries(chartData).map(([planetName, data]) => {
              const iconClass = PLANET_ICONS[planetName] || "fas fa-circle";
              
              return (
                <div key={planetName} className="planet-card">
                  <div className="planet-header">
                    <h3>{planetName}</h3>
                    <i className={`${iconClass} planet-icon`}></i>
                  </div>
                  
                  <div className="planet-details">
                    <div className="zodiac-info">
                      <p className="zodiac-sign">{data.sign}</p>
                      <p className="degree">{data.degree}° {data.sign}</p>
                    </div>

                    {data.astrology_details && (
                      <div className="astrology-box">
                        <div className="property">
                          <strong>Element:</strong> 
                          <span className={`element ${data.astrology_details.element.toLowerCase()}`}>
                            {data.astrology_details.element}
                          </span>
                        </div>
                        <div className="property">
                          <strong>Mode:</strong>
                          <span>{data.astrology_details.modality}</span>
                        </div>
                        <div className="property">
                          <strong>Ruler:</strong>
                          <span>{data.astrology_details.ruling_planet}</span>
                        </div>
                      </div>
                    )}

                    {data.planet_meaning && (
                      <div className="meaning-box">
                        <p className="meaning">{data.planet_meaning.meaning}</p>
                      </div>
                    )}

                    <div className="longitude">
                      <small>{data.longitude.toFixed(2)}°</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
