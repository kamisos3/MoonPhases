"""FastAPI connection to React WebApp front-end - Moon Phase Tracker"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import swisseph as swe
from datetime import datetime
import math

app = FastAPI(title="Moon Phase Tracker")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
swe.set_ephe_path("/ephe")

# Zodiac signs order
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Zodiac properties
ZODIAC_PROPERTIES = {
    "Aries": {"element": "Fire", "modality": "Cardinal", "symbol": "♈"},
    "Taurus": {"element": "Earth", "modality": "Fixed", "symbol": "♉"},
    "Gemini": {"element": "Air", "modality": "Mutable", "symbol": "♊"},
    "Cancer": {"element": "Water", "modality": "Cardinal", "symbol": "♋"},
    "Leo": {"element": "Fire", "modality": "Fixed", "symbol": "♌"},
    "Virgo": {"element": "Earth", "modality": "Mutable", "symbol": "♍"},
    "Libra": {"element": "Air", "modality": "Cardinal", "symbol": "♎"},
    "Scorpio": {"element": "Water", "modality": "Fixed", "symbol": "♏"},
    "Sagittarius": {"element": "Fire", "modality": "Mutable", "symbol": "♐"},
    "Capricorn": {"element": "Earth", "modality": "Cardinal", "symbol": "♑"},
    "Aquarius": {"element": "Air", "modality": "Fixed", "symbol": "♒"},
    "Pisces": {"element": "Water", "modality": "Mutable", "symbol": "♓"}
}

# Moon phase descriptions
MOON_PHASE_INFO = {
    "New Moon": {
        "emoji": "🌑",
        "description": "A time for new beginnings and setting intentions. The Moon is hidden from view.",
        "energy": "Planting seeds, fresh starts, introspection"
    },
    "Waxing Crescent": {
        "emoji": "🌒",
        "description": "The Moon is growing. Time to take action on your intentions.",
        "energy": "Taking action, building momentum, hope"
    },
    "First Quarter": {
        "emoji": "🌓",
        "description": "Half of the Moon is illuminated. Time to overcome challenges.",
        "energy": "Decision making, taking action, commitment"
    },
    "Waxing Gibbous": {
        "emoji": "🌔",
        "description": "The Moon is almost full. Refine and adjust your plans.",
        "energy": "Refinement, patience, preparation"
    },
    "Full Moon": {
        "emoji": "🌕",
        "description": "The Moon is fully illuminated. Peak energy for manifestation and completion.",
        "energy": "Culmination, celebration, heightened emotions"
    },
    "Waning Gibbous": {
        "emoji": "🌖",
        "description": "The Moon begins to wane. Time for gratitude and sharing.",
        "energy": "Gratitude, sharing wisdom, reflection"
    },
    "Last Quarter": {
        "emoji": "🌗",
        "description": "Half the Moon is illuminated. Time to release and let go.",
        "energy": "Release, forgiveness, letting go"
    },
    "Waning Crescent": {
        "emoji": "🌘",
        "description": "The Moon is almost gone. Time for rest and recuperation.",
        "energy": "Rest, surrender, spiritual connection"
    }
}


def get_zodiac_sign(longitude):
    """Convert ecliptic longitude to zodiac sign"""
    lon = longitude % 360
    sign_index = int(lon / 30)
    degree_in_sign = lon % 30
    sign = ZODIAC_SIGNS[sign_index]
    
    zodiac_info = ZODIAC_PROPERTIES.get(sign, {})
    return {
        "sign": sign,
        "degree": round(degree_in_sign, 2),
        "symbol": zodiac_info.get("symbol", ""),
        "element": zodiac_info.get("element", ""),
        "modality": zodiac_info.get("modality", "")
    }


def get_moon_phase(sun_lon, moon_lon):
    """Calculate moon phase from Sun and Moon longitudes"""
    # Calculate the angle between Sun and Moon
    phase_angle = (moon_lon - sun_lon) % 360
    
    # Determine phase name based on angle
    if phase_angle < 22.5 or phase_angle >= 337.5:
        phase_name = "New Moon"
    elif 22.5 <= phase_angle < 67.5:
        phase_name = "Waxing Crescent"
    elif 67.5 <= phase_angle < 112.5:
        phase_name = "First Quarter"
    elif 112.5 <= phase_angle < 157.5:
        phase_name = "Waxing Gibbous"
    elif 157.5 <= phase_angle < 202.5:
        phase_name = "Full Moon"
    elif 202.5 <= phase_angle < 247.5:
        phase_name = "Waning Gibbous"
    elif 247.5 <= phase_angle < 292.5:
        phase_name = "Last Quarter"
    else:  # 292.5 <= phase_angle < 337.5
        phase_name = "Waning Crescent"
    
    # Calculate illumination percentage
    illumination = (1 - math.cos(math.radians(phase_angle))) / 2 * 100
    
    phase_info = MOON_PHASE_INFO.get(phase_name, {})
    
    return {
        "phase_name": phase_name,
        "phase_angle": round(phase_angle, 2),
        "illumination": round(illumination, 2),
        "emoji": phase_info.get("emoji", "🌙"),
        "description": phase_info.get("description", ""),
        "energy": phase_info.get("energy", "")
    }


@app.get("/moon-phase")
def get_current_moon_phase():
    """Get the current moon phase and zodiac sign"""
    # Get current UTC time
    now = datetime.utcnow()
    
    # Calculate Julian Day
    jd = swe.julday(now.year, now.month, now.day, 
                    now.hour + now.minute/60 + now.second/3600)
    
    # Get Sun position
    sun_result = swe.calc_ut(jd, swe.SUN, swe.FLG_SPEED)
    sun_lon = sun_result[0][0] if isinstance(sun_result[0], tuple) else sun_result[0]
    
    # Get Moon position
    moon_result = swe.calc_ut(jd, swe.MOON, swe.FLG_SPEED)
    moon_lon = moon_result[0][0] if isinstance(moon_result[0], tuple) else moon_result[0]
    
    # Get zodiac sign for Moon
    moon_zodiac = get_zodiac_sign(moon_lon)
    
    # Calculate moon phase
    moon_phase = get_moon_phase(sun_lon, moon_lon)
    
    return {
        "datetime": now.isoformat(),
        "moon_zodiac": moon_zodiac,
        "moon_phase": moon_phase
    }
