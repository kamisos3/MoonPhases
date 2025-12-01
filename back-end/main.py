"""FastAPI connection to React WebApp front-end"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import swisseph as swe
from datetime import datetime, timedelta
from dateutil import parser
from kerykeion import settings

app = FastAPI(title="Birth Chart")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
swe.set_ephe_path("/ephe")

# Load Kerykeion astrology data
_EN_SETTINGS = settings.LANGUAGE_SETTINGS.get('EN', {})
_CELESTIAL_POINTS = _EN_SETTINGS.get('celestial_points', {})

# Zodiac signs order
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Zodiac elements and modalities mapping
ZODIAC_PROPERTIES = {
    "Aries": {"element": "Fire", "modality": "Cardinal"},
    "Taurus": {"element": "Earth", "modality": "Fixed"},
    "Gemini": {"element": "Air", "modality": "Mutable"},
    "Cancer": {"element": "Water", "modality": "Cardinal"},
    "Leo": {"element": "Fire", "modality": "Fixed"},
    "Virgo": {"element": "Earth", "modality": "Mutable"},
    "Libra": {"element": "Air", "modality": "Cardinal"},
    "Scorpio": {"element": "Water", "modality": "Fixed"},
    "Sagittarius": {"element": "Fire", "modality": "Mutable"},
    "Capricorn": {"element": "Earth", "modality": "Cardinal"},
    "Aquarius": {"element": "Air", "modality": "Fixed"},
    "Pisces": {"element": "Water", "modality": "Mutable"}
}

# Ruling planets per zodiac sign
RULING_PLANETS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Pluto",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Uranus", "Pisces": "Neptune"
}

# Planet meanings, Kerykeion's celestial points naming
PLANET_MEANINGS = {
    "Sun": {"symbol": "☉", "meaning": "Core identity, ego, willpower"},
    "Moon": {"symbol": "☽", "meaning": "Emotions, subconscious, instincts"},
    "Mercury": {"symbol": "☿", "meaning": "Communication, intellect, logic"},
    "Venus": {"symbol": "♀", "meaning": "Love, beauty, values, pleasure"},
    "Mars": {"symbol": "♂", "meaning": "Action, aggression, energy, passion"},
    "Jupiter": {"symbol": "♃", "meaning": "Expansion, luck, abundance, growth"},
    "Saturn": {"symbol": "♄", "meaning": "Limitation, structure, discipline, karma"},
    "Uranus": {"symbol": "♅", "meaning": "Innovation, revolution, uniqueness"},
    "Neptune": {"symbol": "♆", "meaning": "Dreams, intuition, spirituality, illusion"},
    "Pluto": {"symbol": "♇", "meaning": "Transformation, power, rebirth, hidden forces"},
    "Ascendant": {"symbol": "AC", "meaning": "How you appear to others, first impression"}
}


def get_zodiac_sign(longitude, planet_name=None):
    """Convert ecliptic longitude to zodiac sign and degree with astrology details from Kerykeion"""
    lon = longitude % 360
    sign_index = int(lon / 30)
    degree_in_sign = lon % 30
    sign = ZODIAC_SIGNS[sign_index]
    
    # Build zodiac info with Kerykeion properties
    zodiac_info = ZODIAC_PROPERTIES.get(sign, {})
    result = {
        "sign": sign,
        "degree": round(degree_in_sign, 2),
        "longitude": round(longitude, 2),
        "astrology_details": {
            "element": zodiac_info.get("element", ""),
            "modality": zodiac_info.get("modality", ""),
            "ruling_planet": RULING_PLANETS.get(sign, "")
        }
    }
    
    # Add planet meaning if provided
    if planet_name and planet_name in PLANET_MEANINGS:
        result["planet_meaning"] = PLANET_MEANINGS[planet_name]
    
    return result

class ChartRequest(BaseModel):
    datetimeISO: str
    tzOffsetMinutes: int
    latitude: float
    longitude: float

@app.post("/chart")
def generate_chart(req: ChartRequest):
    dt = parser.isoparse(req.datetimeISO)
    # Convert to UTC by subtracting the timezone offset 
    dt_utc = dt - timedelta(minutes=req.tzOffsetMinutes)

    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day,  # Julian Day continuous day count to compute positions
                    dt_utc.hour + dt_utc.minute/60 + dt_utc.second/3600)   # Gets universal time

    planets = {}   # Computes ecliptic longitude of each planet
    for name, idx in [("Sun", swe.SUN), ("Moon", swe.MOON),
                      ("Mercury", swe.MERCURY), ("Venus", swe.VENUS),
                      ("Mars", swe.MARS), ("Jupiter", swe.JUPITER),
                      ("Saturn", swe.SATURN), ("Uranus", swe.URANUS),
                      ("Neptune", swe.NEPTUNE), ("Pluto", swe.PLUTO)]:
        result = swe.calc_ut(jd, idx)
        lon = result[0][0] if isinstance(result[0], tuple) else result[0]
        planets[name] = get_zodiac_sign(lon, name)

    # Get Ascendant and Houses
    houses, ascmc = swe.houses(jd, req.latitude, req.longitude)
    asc_lon = ascmc[0][0] if isinstance(ascmc[0], tuple) else ascmc[0]
    planets["Ascendant"] = get_zodiac_sign(asc_lon, "Ascendant")
    
    # Extract house cusps (12 houses)
    house_cusps = [h[0] if isinstance(h, tuple) else h for h in houses[:12]]
    
    return {"chart": planets, "houses": house_cusps}
