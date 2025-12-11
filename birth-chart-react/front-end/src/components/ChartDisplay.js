import React from "react";
import "../styles/ChartDisplay.css";

export default function ChartDisplay({ chartData }) {
  if (!chartData) return null;

  console.log("ChartData keys:", Object.keys(chartData));
  console.log("Full chartData:", chartData);

  // Get houses if available
  const houses = chartData.houses || [];
  const chart = chartData.chart || chartData;

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
    const size = 500;
    const center = size / 2;
    const centerRadius = 30;
    const zodiacInner = 70;
    const zodiacOuter = 95;
    const house1Inner = 105;
    const house1Outer = 135;
    const house2Inner = 145;
    const house2Outer = 175;
    const house3Inner = 185;
    const house3Outer = 215;

    return (
      <svg width={size} height={size} className="chart-canvas" viewBox={`0 0 ${size} ${size}`}>
        {/* Center circle */}
        <circle cx={center} cy={center} r={centerRadius} fill="rgba(194, 234, 102, 0.1)" stroke="#c2ea66" strokeWidth="1.5" />
        
        {/* Zodiac ring band */}
        <circle cx={center} cy={center} r={zodiacInner} fill="none" stroke="#c2ea66" strokeWidth="1" opacity="0.5" />
        <circle cx={center} cy={center} r={zodiacOuter} fill="none" stroke="#c2ea66" strokeWidth="1" opacity="0.5" />
        
        {/* House rings - multiple concentric bands like a real birth chart */}
        {/* Ring 1 */}
        <circle cx={center} cy={center} r={house1Inner} fill="none" stroke="rgba(194, 234, 102, 0.2)" strokeWidth="0.5" />
        <circle cx={center} cy={center} r={house1Outer} fill="none" stroke="rgba(194, 234, 102, 0.2)" strokeWidth="0.5" />
        
        {/* Ring 2 */}
        <circle cx={center} cy={center} r={house2Inner} fill="none" stroke="rgba(194, 234, 102, 0.15)" strokeWidth="0.5" />
        <circle cx={center} cy={center} r={house2Outer} fill="none" stroke="rgba(194, 234, 102, 0.15)" strokeWidth="0.5" />
        
        {/* Ring 3 */}
        <circle cx={center} cy={center} r={house3Inner} fill="none" stroke="rgba(194, 234, 102, 0.1)" strokeWidth="0.5" />
        <circle cx={center} cy={center} r={house3Outer} fill="none" stroke="rgba(194, 234, 102, 0.1)" strokeWidth="0.5" />
        
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
                x2={center + house3Outer * Math.cos(angle)}
                y2={center + house3Outer * Math.sin(angle)}
                stroke="rgba(194, 234, 102, 0.25)"
                strokeWidth="1"
              />
              {/* Zodiac icon from Font Awesome */}
              <foreignObject 
                x={center + (house3Outer + 35) * Math.cos(angle) - 12}
                y={center + (house3Outer + 35) * Math.sin(angle) - 12}
                width="24"
                height="24"
              >
                <i className={icon} style={{ fontSize: "20px", color: "#c2ea66", display: "flex", alignItems: "center", justifyContent: "center" }}></i>
              </foreignObject>
            </g>
          );
        })}
        
        {/* House angles - AC, DSC, IC, MC */}
        {houses && houses.length > 0 && (() => {
          const houseLabels = [
            { label: "AC", index: 0 },  // Ascendant
            { label: "DSC", index: 6 }, // Descendant  
            { label: "IC", index: 9 },  // Imum Coeli
            { label: "MC", index: 2 }   // Midheaven
          ];
          
          return houseLabels.map(({ label, index }) => {
            if (!houses[index]) return null;
            const houseAngle = (houses[index] - 90) * (Math.PI / 180);
            const labelRadius = house3Outer + 50;
            const lx = center + labelRadius * Math.cos(houseAngle);
            const ly = center + labelRadius * Math.sin(houseAngle);
            
            return (
              <g key={`house-${label}`}>
                {/* House angle line */}
                <line
                  x1={center}
                  y1={center}
                  x2={center + house3Outer * Math.cos(houseAngle)}
                  y2={center + house3Outer * Math.sin(houseAngle)}
                  stroke="rgba(194, 234, 102, 0.4)"
                  strokeWidth="1.5"
                />
                {/* House label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#c2ea66"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              </g>
            );
          });
        })()}

        {/* Plot planets on different rings based on longitude */}
        {Object.entries(chart)
          .filter(([planetName]) => {
            const validPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
            return validPlanets.includes(planetName) && chart[planetName] && chart[planetName].longitude !== undefined;
          })
          .map(([planetName, data], index) => {
            if (!data || data.longitude === undefined) return null;
            
            // Calculate angle from longitude (0° Aries = 0°, increases counterclockwise)
            const angle = (data.longitude - 90) * (Math.PI / 180);
            
            // Distribute planets across rings based on their index
            let radius;
            const mid1 = (house1Inner + house1Outer) / 2;
            const mid2 = (house2Inner + house2Outer) / 2;
            const mid3 = (house3Inner + house3Outer) / 2;
            
            if (index % 3 === 0) radius = mid1;
            else if (index % 3 === 1) radius = mid2;
            else radius = mid3;
            
            const px = center + radius * Math.cos(angle);
            const py = center + radius * Math.sin(angle);
            
            const icon = PLANET_ICONS[planetName] || "fas fa-circle";
            const color = planetName === "Sun" ? "#FFD700" : planetName === "Moon" ? "#E0E0E0" : "#c2ea66";
            
            return (
              <g key={`planet-${planetName}`}>
                {/* Planet symbol circle */}
                <circle cx={px} cy={py} r="9" fill="rgba(194, 234, 102, 0.2)" stroke={color} strokeWidth="2" />
                
                {/* Planet icon */}
                <foreignObject x={px - 5} y={py - 5} width="10" height="10">
                  <i className={icon} style={{ fontSize: "7px", color: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}></i>
                </foreignObject>
              </g>
            );
          })}

        {/* Aspect lines connecting planets */}
        {(() => {
          const validPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
          const entries = Object.entries(chart)
            .filter(([planetName]) => validPlanets.includes(planetName) && chart[planetName] && chart[planetName].longitude !== undefined)
            .map(([planetName, data], index) => {
              if (!data || data.longitude === undefined) return null;
              const angle = (data.longitude - 90) * (Math.PI / 180);
              const mid1 = (house1Inner + house1Outer) / 2;
              const mid2 = (house2Inner + house2Outer) / 2;
              const mid3 = (house3Inner + house3Outer) / 2;
              let radius;
              if (index % 3 === 0) radius = mid1;
              else if (index % 3 === 1) radius = mid2;
              else radius = mid3;
              const px = center + radius * Math.cos(angle);
              const py = center + radius * Math.sin(angle);
              return { name: planetName, x: px, y: py, longitude: data.longitude };
            })
            .filter(p => p);

          const lines = [];
          const aspectOrbs = {
            0: { orb: 10, color: "rgba(194, 234, 102, 0.5)", width: 1.5, name: "Conjunction" }, // Green
            60: { orb: 8, color: "rgba(100, 150, 255, 0.5)", width: 1.2, name: "Sextile" }, // Blue
            90: { orb: 10, color: "rgba(255, 100, 100, 0.5)", width: 1.5, name: "Square" }, // Red
            120: { orb: 10, color: "rgba(100, 150, 255, 0.5)", width: 1.2, name: "Trine" }, // Blue
            180: { orb: 10, color: "rgba(255, 150, 0, 0.5)", width: 1.2, name: "Opposition" }, // Orange
          };
          
          for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
              let diff = Math.abs(entries[i].longitude - entries[j].longitude);
              if (diff > 180) diff = 360 - diff;
              
              // Check if this is a valid aspect
              for (const [aspectAngle, aspectData] of Object.entries(aspectOrbs)) {
                const angle = parseInt(aspectAngle);
                if (Math.abs(diff - angle) < aspectData.orb) {
                  lines.push(
                    <line
                      key={`aspect-${entries[i].name}-${entries[j].name}-${angle}`}
                      x1={entries[i].x}
                      y1={entries[i].y}
                      x2={entries[j].x}
                      y2={entries[j].y}
                      stroke={aspectData.color}
                      strokeWidth={aspectData.width}
                      opacity="0.8"
                    />
                  );
                  break; // Only one aspect per planet pair
                }
              }
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
            {Object.entries(chart).map(([planetName, data]) => {
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
