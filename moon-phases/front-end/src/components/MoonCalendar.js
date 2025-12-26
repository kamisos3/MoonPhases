import React, { useState, useEffect } from "react";
import "../styles/MoonCalendar.css";
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

const MOON_PHASE_INFO = {
  "New Moon": {
    description: "A time for new beginnings and setting intentions. The Moon is hidden from view.",
    energy: "Planting seeds, fresh starts, introspection"
  },
  "Waxing Crescent": {
    description: "The Moon is growing. Time to take action on your intentions.",
    energy: "Taking action, building momentum, hope"
  },
  "First Quarter": {
    description: "Half of the Moon is illuminated. Time to overcome challenges.",
    energy: "Decision making, taking action, commitment"
  },
  "Waxing Gibbous": {
    description: "The Moon is almost full. Refine and adjust your plans.",
    energy: "Refinement, patience, preparation"
  },
  "Full Moon": {
    description: "The Moon is fully illuminated. Peak energy for manifestation and completion.",
    energy: "Culmination, celebration, heightened emotions"
  },
  "Waning Gibbous": {
    description: "The Moon begins to wane. Time for gratitude and sharing.",
    energy: "Gratitude, sharing wisdom, reflection"
  },
  "Last Quarter": {
    description: "Half the Moon is illuminated. Time to release and let go.",
    energy: "Release, forgiveness, letting go"
  },
  "Waning Crescent": {
    description: "The Moon is almost gone. Time for rest and recuperation.",
    energy: "Rest, surrender, spiritual connection"
  }
};

const ZODIAC_PROPERTIES = {
  "Aries": { element: "Fire", modality: "Cardinal" },
  "Taurus": { element: "Earth", modality: "Fixed" },
  "Gemini": { element: "Air", modality: "Mutable" },
  "Cancer": { element: "Water", modality: "Cardinal" },
  "Leo": { element: "Fire", modality: "Fixed" },
  "Virgo": { element: "Earth", modality: "Mutable" },
  "Libra": { element: "Air", modality: "Cardinal" },
  "Scorpio": { element: "Water", modality: "Fixed" },
  "Sagittarius": { element: "Fire", modality: "Mutable" },
  "Capricorn": { element: "Earth", modality: "Cardinal" },
  "Aquarius": { element: "Air", modality: "Fixed" },
  "Pisces": { element: "Water", modality: "Mutable" }
};

export default function MoonCalendar({ onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [moonPhases, setMoonPhases] = useState({});
  const [zodiacSigns, setZodiacSigns] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    calculateMoonPhases();
  }, [currentMonth]);

  const calculateMoonPhases = () => {
    const phases = {};
    const zodiacSigns = {};
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get all days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Reference date for new moon (known new moon date)
    const referenceNewMoon = new Date(2000, 0, 6, 18, 14); // Jan 6, 2000
    const lunarCycle = 29.53058867; // days
    
    // Zodiac signs
    const zodiacList = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const daysSinceReference = (currentDate - referenceNewMoon) / (1000 * 60 * 60 * 24);
      const phasePosition = (daysSinceReference % lunarCycle) / lunarCycle;
      
      let phaseName = "";
      if (phasePosition < 0.03 || phasePosition > 0.97) {
        phaseName = "New Moon";
      } else if (phasePosition < 0.22) {
        phaseName = "Waxing Crescent";
      } else if (phasePosition < 0.28) {
        phaseName = "First Quarter";
      } else if (phasePosition < 0.47) {
        phaseName = "Waxing Gibbous";
      } else if (phasePosition < 0.53) {
        phaseName = "Full Moon";
      } else if (phasePosition < 0.72) {
        phaseName = "Waning Gibbous";
      } else if (phasePosition < 0.78) {
        phaseName = "Last Quarter";
      } else {
        phaseName = "Waning Crescent";
      }
      
      // Calculate approximate zodiac sign (simplified calculation)
      // Moon moves through zodiac in ~27.3 days
      const zodiacCycle = 27.321661;
      const zodiacPosition = (daysSinceReference % zodiacCycle) / zodiacCycle;
      const zodiacIndex = Math.floor(zodiacPosition * 12);
      const zodiacSign = zodiacList[zodiacIndex];
      const degreeInSign = ((zodiacPosition * 12) % 1) * 30;
      
      phases[day] = phaseName;
      zodiacSigns[day] = {
        sign: zodiacSign,
        degree: degreeInSign.toFixed(1),
        element: ZODIAC_PROPERTIES[zodiacSign].element,
        modality: ZODIAC_PROPERTIES[zodiacSign].modality
      };
    }
    
    setMoonPhases(phases);
    setZodiacSigns(zodiacSigns);
  };

  const getMoonIcon = (phase, size = 30) => {
    const iconProps = { size, className: "calendar-moon-icon" };
    switch(phase) {
      case "New Moon": return <WiMoonNew {...iconProps} />;
      case "Waxing Crescent": return <WiMoonWaxingCrescent3 {...iconProps} />;
      case "First Quarter": return <WiMoonFirstQuarter {...iconProps} />;
      case "Waxing Gibbous": return <WiMoonWaxingGibbous3 {...iconProps} />;
      case "Full Moon": return <WiMoonFull {...iconProps} />;
      case "Waning Gibbous": return <WiMoonWaningGibbous3 {...iconProps} />;
      case "Last Quarter": return <WiMoonThirdQuarter {...iconProps} />;
      case "Waning Crescent": return <WiMoonWaningCrescent3 {...iconProps} />;
      default: return null;
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
    setSelectedDay(null); // Clear selection when changing months
  };

  const handleDayClick = (day) => {
    if (day) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const date = new Date(year, month, day);
      setSelectedDay({
        day,
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        phase: moonPhases[day],
        zodiac: zodiacSigns[day]
      });
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth();

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <h2>Calendar</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="calendar-content">
          <div className="month-navigation">
            <button onClick={() => changeMonth(-1)} className="nav-button">‹</button>
            <h3>{monthName}</h3>
            <button onClick={() => changeMonth(1)} className="nav-button">›</button>
          </div>
          
          <div className="calendar-grid">
            <div className="weekday-header">Sun</div>
            <div className="weekday-header">Mon</div>
            <div className="weekday-header">Tue</div>
            <div className="weekday-header">Wed</div>
            <div className="weekday-header">Thu</div>
            <div className="weekday-header">Fri</div>
            <div className="weekday-header">Sat</div>
            
            {days.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${day ? 'has-day' : 'empty'}`}
                onClick={() => handleDayClick(day)}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    {moonPhases[day] && (
                      <div className="moon-phase-indicator" title={moonPhases[day]}>
                        {getMoonIcon(moonPhases[day])}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {selectedDay && (
          <div className="day-detail-popup" onClick={(e) => e.stopPropagation()}>
            <div className="day-detail-content">
              <div className="detail-date">{selectedDay.date}</div>
              
              <div className="detail-section moon-phase-section">
                <div className="detail-moon-icon">
                  {getMoonIcon(selectedDay.phase, 60)}
                </div>
                <div className="detail-phase-name">{selectedDay.phase}</div>
                {MOON_PHASE_INFO[selectedDay.phase] && (
                  <>
                    <div className="detail-phase-description">
                      {MOON_PHASE_INFO[selectedDay.phase].description}
                    </div>
                    <div className="detail-energy-box">
                      <h3>Energy</h3>
                      <p>{MOON_PHASE_INFO[selectedDay.phase].energy}</p>
                    </div>
                  </>
                )}
              </div>
              
              {selectedDay.zodiac && (
                <div className="detail-section zodiac-section">
                  <div className="zodiac-sign-title">Moon in {selectedDay.zodiac.sign}</div>
                  <div className="zodiac-details">
                    <div className="detail-item">
                      <strong>Element:</strong>
                      <span className="element-badge">{selectedDay.zodiac.element}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Modality:</strong>
                      <span>{selectedDay.zodiac.modality}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              className="detail-close-button" 
              onClick={() => setSelectedDay(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
