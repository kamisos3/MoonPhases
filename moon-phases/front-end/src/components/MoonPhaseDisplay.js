import React from "react";
import "../styles/MoonPhaseDisplay.css";
import { 
  WiMoonNew, 
  WiMoonWaxingCrescent3, 
  WiMoonFirstQuarter, 
  WiMoonWaxingGibbous3,
  WiMoonFull,
  WiMoonWaningGibbous3,
  WiMoonThirdQuarter,
  WiMoonWaningCrescent3
} from 'react-icons/wi';
import { GiRam, GiBull, GiGemini, GiCancer, GiLion, GiVirgo, GiScales, GiScorpion, GiSagittarius, GiCapricorn, GiAquarius, GiFishEscape } from 'react-icons/gi';
import { IoFlame, IoWater } from 'react-icons/io5';
import { GiEarthAmerica } from 'react-icons/gi';
import { FaWind } from 'react-icons/fa';

export default function MoonPhaseDisplay({ moonData }) {
  if (!moonData) return null;

  const { moon_zodiac, moon_phase, datetime } = moonData;

  // Map moon phases to icons
  const getMoonPhaseIcon = (phaseName) => {
    const iconProps = { size: 120, className: "moon-phase-icon" };
    switch(phaseName) {
      case "New Moon": return <WiMoonNew {...iconProps} />;
      case "Waxing Crescent": return <WiMoonWaxingCrescent3 {...iconProps} />;
      case "First Quarter": return <WiMoonFirstQuarter {...iconProps} />;
      case "Waxing Gibbous": return <WiMoonWaxingGibbous3 {...iconProps} />;
      case "Full Moon": return <WiMoonFull {...iconProps} />;
      case "Waning Gibbous": return <WiMoonWaningGibbous3 {...iconProps} />;
      case "Last Quarter": return <WiMoonThirdQuarter {...iconProps} />;
      case "Waning Crescent": return <WiMoonWaningCrescent3 {...iconProps} />;
      default: return <WiMoonFull {...iconProps} />;
    }
  };

  // Map zodiac signs to icons
  const getZodiacIcon = (sign) => {
    const iconProps = { size: 100, className: "zodiac-icon" };
    switch(sign) {
      case "Aries": return <GiRam {...iconProps} />;
      case "Taurus": return <GiBull {...iconProps} />;
      case "Gemini": return <GiGemini {...iconProps} />;
      case "Cancer": return <GiCancer {...iconProps} />;
      case "Leo": return <GiLion {...iconProps} />;
      case "Virgo": return <GiVirgo {...iconProps} />;
      case "Libra": return <GiScales {...iconProps} />;
      case "Scorpio": return <GiScorpion {...iconProps} />;
      case "Sagittarius": return <GiSagittarius {...iconProps} />;
      case "Capricorn": return <GiCapricorn {...iconProps} />;
      case "Aquarius": return <GiAquarius {...iconProps} />;
      case "Pisces": return <GiFishEscape {...iconProps} />;
      default: return null;
    }
  };

  // Map element to icon
  const getElementIcon = (element) => {
    const iconProps = { size: 20, style: { marginRight: '8px' } };
    switch(element) {
      case "Fire": return <IoFlame {...iconProps} />;
      case "Earth": return <GiEarthAmerica {...iconProps} />;
      case "Air": return <FaWind {...iconProps} />;
      case "Water": return <IoWater {...iconProps} />;
      default: return null;
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: 'America/Halifax'
    });
  };

  return (
    <div className="moon-phase-display">
      
      <div className="moon-info-container">
        {/* Moon Phase Section */}
        <div className="moon-phase-card">
          <div className="moon-icon-container">{getMoonPhaseIcon(moon_phase.phase_name)}</div>
          <h2 className="phase-name">{moon_phase.phase_name}</h2>
          <p className="phase-description">{moon_phase.description}</p>
          
          <div className="phase-details">
            <div className="detail-item">
              <strong>Illumination:</strong>
              <span>{moon_phase.illumination}%</span>
            </div>
            <div className="detail-item">
              <strong>Phase Angle:</strong>
              <span>{moon_phase.phase_angle}°</span>
            </div>
          </div>
          
          <div className="energy-box">
            <h3>Energy</h3>
            <p>{moon_phase.energy}</p>
          </div>
        </div>

        {/* Moon Zodiac Section */}
        <div className="moon-zodiac-card">
          <div className="zodiac-icon-container">{getZodiacIcon(moon_zodiac.sign)}</div>
          <h2>Moon is in {moon_zodiac.sign}</h2>
          
          <div className="zodiac-details">
            <div className="detail-item">
              <strong>Degree:</strong>
              <span>{moon_zodiac.degree}° {moon_zodiac.sign}</span>
            </div>
            <div className="detail-item">
              <strong>Element:</strong>
              <span className={`element-badge ${moon_zodiac.element.toLowerCase()}`}>
                {moon_zodiac.element}
              </span>
            </div>
            <div className="detail-item">
              <strong>Modality:</strong>
              <span>{moon_zodiac.modality}</span>
            </div>
          </div>

          {/* Element meanings */}
          <div className="element-meaning">
            <h3>{getElementIcon(moon_zodiac.element)} {moon_zodiac.element} Moon</h3>
            {moon_zodiac.element === "Fire" && (
              <p>Passionate, spontaneous, and action-oriented energy</p>
            )}
            {moon_zodiac.element === "Earth" && (
              <p>Practical, grounded, and sensory-focused energy</p>
            )}
            {moon_zodiac.element === "Air" && (
              <p>Intellectual, social, and communication-oriented energy</p>
            )}
            {moon_zodiac.element === "Water" && (
              <p>Emotional, intuitive, and feeling-focused energy</p>
            )}
          </div>
        </div>
      </div>

      <div className="timestamp">
        <small>Current Atlantic Time: {formatDate(datetime)}</small>
      </div>
    </div>
  );
}
