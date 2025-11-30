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

  // Zodiac glyphs/symbols
  const ZODIAC_GLYPHS = {
    "Aries": "♈",
    "Taurus": "♉",
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
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
    const size = 500;
    const center = size / 2;
    const zodiacRadius = 80;
    const planetsRing1 = 130;
    const planetsRing2 = 170;
    const planetsRing3 = 210;

    return (
      <svg width={size} height={size} className="chart-canvas" viewBox={`0 0 ${size} ${size}`}>
        {/* Center circle */}
        <circle cx={center} cy={center} r="30" fill="rgba(194, 234, 102, 0.1)" stroke="#c2ea66" strokeWidth="1.5" />
        
        {/* Zodiac ring - innermost */}
        <circle cx={center} cy={center} r={zodiacRadius} fill="rgba(255, 255, 255, 0.02)" stroke="#c2ea66" strokeWidth="2" />
        
        {/* Planet rings - outer rings */}
        <circle cx={center} cy={center} r={planetsRing1} fill="none" stroke="rgba(194, 234, 102, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
        <circle cx={center} cy={center} r={planetsRing2} fill="none" stroke="rgba(194, 234, 102, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
        <circle cx={center} cy={center} r={planetsRing3} fill="none" stroke="rgba(194, 234, 102, 0.1)" strokeWidth="1" strokeDasharray="5,5" />
        
        {/* Zodiac signs - 12 segments */}
        {Object.entries(ZODIAC_ICONS).map((entry, index) => {
          const [sign, icon] = entry;
          const angle = (index * 30 - 90) * (Math.PI / 180);
          
          return (
            <g key={`zodiac-${sign}`}>
              {/* Divider lines from center through all rings */}
              <line
                x1={center}
                y1={center}
                x2={center + planetsRing3 * Math.cos(angle)}
                y2={center + planetsRing3 * Math.sin(angle)}
                stroke="rgba(194, 234, 102, 0.2)"
                strokeWidth="1"
              />
              {/* Zodiac glyph/symbol - far outside */}
              <text
                x={center + (planetsRing3 + 55) * Math.cos(angle)}
                y={center + (planetsRing3 + 55) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
                fontWeight="bold"
                fill="#c2ea66"
                style={{ pointerEvents: "none" }}
              >
                {ZODIAC_GLYPHS[sign]}
              </text>
              <text
                x={center + (planetsRing3 + 24) * Math.cos(angle)}
                y={center + (planetsRing3 + 24) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#c2ea66"
                style={{ pointerEvents: "none" }}
              >
                {sign.substring(0, 3)}
              </text>
            </g>
          );
        })}

        {/* Plot planets on outer rings based on longitude */}
        {Object.entries(chartData)
          .filter(([planetName]) => {
            const validPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
            const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
            return validPlanets.includes(planetName) && !zodiacSigns.includes(planetName);
          })
          .map(([planetName, data], index) => {
            if (!data || data.longitude === undefined) return null;
            
            // Calculate angle from longitude
            const angle = (data.longitude - 90) * (Math.PI / 180);
            
            // Distribute planets across the three rings
            let radius;
            if (index % 3 === 0) radius = planetsRing1;
            else if (index % 3 === 1) radius = planetsRing2;
            else radius = planetsRing3;
            
            const px = center + radius * Math.cos(angle);
            const py = center + radius * Math.sin(angle);
            
            // Store planet positions for aspect lines
            data._x = px;
            data._y = py;
            
            const icon = PLANET_ICONS[planetName] || "fas fa-circle";
            const color = planetName === "Sun" ? "#FFD700" : planetName === "Moon" ? "#E0E0E0" : "#c2ea66";
            
            return (
              <g key={`planet-${planetName}`}>
                {/* Planet symbol circle */}
                <circle cx={px} cy={py} r="10" fill="rgba(194, 234, 102, 0.2)" stroke={color} strokeWidth="2" />
                
                {/* Planet icon */}
                <foreignObject x={px - 6} y={py - 6} width="12" height="12">
                  <i className={icon} style={{ fontSize: "8px", color: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}></i>
                </foreignObject>
              </g>
            );
          })}

        {/* Aspect lines connecting planets */}
        {(() => {
          const validPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
          const entries = Object.entries(chartData)
            .filter(([planetName]) => validPlanets.includes(planetName))
            .map(([planetName, data], index) => {
              if (!data || data.longitude === undefined) return null;
              const angle = (data.longitude - 90) * (Math.PI / 180);
              let radius;
              if (index % 3 === 0) radius = planetsRing1;
              else if (index % 3 === 1) radius = planetsRing2;
              else radius = planetsRing3;
              const px = center + radius * Math.cos(angle);
              const py = center + radius * Math.sin(angle);
              return { name: planetName, x: px, y: py, longitude: data.longitude };
            })
            .filter(p => p);

          const lines = [];
          for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
              lines.push(
                <line
                  key={`aspect-${entries[i].name}-${entries[j].name}`}
                  x1={entries[i].x}
                  y1={entries[i].y}
                  x2={entries[j].x}
                  y2={entries[j].y}
                  stroke="#c2ea66"
                  strokeWidth="1"
                  opacity="0.35"
                />
              );
            }
          }
          return lines;
        })()}

        {/* Center point */}
        <circle cx={center} cy={center} r="2.5" fill="#c2ea66" />
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
