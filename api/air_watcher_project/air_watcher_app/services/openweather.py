import os
import requests


def fetch_air_pollution_aqi(lat: float, lon: float) -> int:
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENWEATHER_API_KEY is not set")
    url = "https://api.openweathermap.org/data/2.5/air_pollution"
    params = {"lat": lat, "lon": lon, "appid": api_key}

    response = requests.get(url, params=params, verify=False, timeout=10)
    response.raise_for_status()
    payload = response.json()

    data_list = payload.get("list", [])
    if not data_list:
        raise RuntimeError("Air pollution data not found")

    return data_list[0]["main"]["aqi"]
