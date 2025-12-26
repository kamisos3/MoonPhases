"""FastAPI connection to React WebApp front-end - Moon Phase Tracker"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import swisseph as swe
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import math
import pytz

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
def get_current_moon_phase(
    latitude: float = Query(None, description="Latitude for timezone calculation"),
    longitude: float = Query(None, description="Longitude for timezone calculation"),
    timezone_name: str = Query(None, description="Timezone name (e.g., 'America/Puerto_Rico')")
):
    """Get the current moon phase and zodiac sign with proper timezone handling"""
    # Get current UTC time
    utc_now = datetime.now(timezone.utc)
    
    # Determine local time based on provided parameters
    if timezone_name:
        try:
            local_tz = pytz.timezone(timezone_name)
            local_time = utc_now.astimezone(local_tz)
        except:
            local_time = utc_now  # fallback to UTC
    elif latitude is not None and longitude is not None:
        # Use geocoding to find timezone
        try:
            from timezonefinder import TimezoneFinder
            tf = TimezoneFinder()
            timezone_str = tf.timezone_at(lat=latitude, lng=longitude)
            if timezone_str:
                local_tz = pytz.timezone(timezone_str)
                local_time = utc_now.astimezone(local_tz)
            else:
                local_time = utc_now
        except:
            local_time = utc_now  # fallback to UTC
    else:
        local_time = utc_now  # No location provided, use UTC
    
    # Calculate Julian Day using UTC for astronomical calculations
    jd = swe.julday(utc_now.year, utc_now.month, utc_now.day, 
                    utc_now.hour + utc_now.minute/60 + utc_now.second/3600)
    
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
        "datetime": local_time.isoformat(),
        "timezone": str(local_time.tzinfo),
        "utc_datetime": utc_now.isoformat(),
        "moon_zodiac": moon_zodiac,
        "moon_phase": moon_phase
    }
