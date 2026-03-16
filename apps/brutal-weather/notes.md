# Brutal Weather

Weather stripped to the bone. No colors. No icons. Just data.

## log
- 2026-03-16: Initial build. Strictly black and white brutalist weather app. Real weather data from Open-Meteo API (free, no key needed). Geocoding search by city name. Giant temperature display (up to 160px), bold weather description, coordinates. 6-cell data grid: feels like, humidity, wind speed+direction, pressure, visibility, cloud cover. Humidity level bar (inverted fill). 7-day forecast with day/condition/hi-lo temps. Sunrise/sunset/daylight hours. WMO weather code descriptions. Wind direction from degrees to compass. Archivo Black (display) + IBM Plex Mono (data) typography. Zero color — pure black on white, thick borders, heavy type.

## issues
- Visibility is estimated from cloud cover since Open-Meteo current doesn't provide it directly
- Open-Meteo geocoding may not find very small towns

## todos
- Unit toggle (C/F, km/mph)
- Geolocation button (navigator.geolocation)
- Hourly breakdown chart (pure black bars)
- Recent search history in localStorage

## notes
- No database — pure frontend
- API: Open-Meteo (free, no API key, no registration)
- Geocoding: geocoding-api.open-meteo.com/v1/search
- Weather: api.open-meteo.com/v1/forecast with current + daily params
- WMO codes mapped to plain English descriptions (0-99)
- Wind direction: 16-point compass from degrees (22.5° segments)
- Visibility estimated: max(1, 20 - cloudCover * 0.15) km
- Daylight calculated from sunrise/sunset difference
- Input field inverts to white-on-black on focus
- Forecast rows: TODAY then day abbreviations
