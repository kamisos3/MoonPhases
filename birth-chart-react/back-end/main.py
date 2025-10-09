"""FastAPI connection to React WebApp front-end"""

from fastapi import FastAPI
from pydantic import BaseModel
import swisseph as swe
from datetime import datetime, timedelta
from dateutil import parser

app = FastAPI("Birth Chart")
swe.set_ephe_path("/ephe")

class ChartRequest(BaseModel):
    datetimeISO: str
    tzOffsetMinutes: int
    latitude: float
    longitude: float

@app.post("/chart")
def generate_chart(req: ChartRequest):
    dt = parser.isoparse(req.datetimeISO)
    dt_utc = dt + timedelta(minutes=req.tzOffsetMinutes)

    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day,  # Julian Day continuous day count to compute positions
                    dt_utc.hour + dt_utc.minute/60 + dt_utc.second/3600)   # Gets universal time

    planets = {}   # Computes ecliptic longitude of each planet
    for name, idx in [("Sun", swe.SUN), ("Moon", swe.MOON),
                      ("Mercury", swe.MERCURY), ("Venus", swe.VENUS),
                      ("Mars", swe.MARS), ("Jupiter", swe.JUPITER),
                      ("Saturn", swe.SATURN), ("Uranus", swe.URANUS),
                      ("Neptune", swe.NEPTUNE), ("Pluto", swe.PLUTO)]:
        lon, _, _ = swe.calc_ut(jd, idx)
        planets[name] = lon

    houses, ascmc = swe.houses(jd, req.latitude, req.longitude)
    planets["Ascendant"] = ascmc[0]

    return {"chart": planets}
