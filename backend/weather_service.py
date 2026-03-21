import json
import os
from random import randint
from urllib.parse import urlencode
from urllib.request import urlopen


GEOCODE_URL = os.getenv('WEATHER_GEOCODE_URL', 'https://geocoding-api.open-meteo.com/v1/search')
FORECAST_URL = os.getenv('WEATHER_FORECAST_URL', 'https://api.open-meteo.com/v1/forecast')
WEATHER_PROVIDER = os.getenv('WEATHER_PROVIDER', 'open-meteo')
HTTP_TIMEOUT_SECONDS = float(os.getenv('WEATHER_HTTP_TIMEOUT', '4'))


def _stub_weather(location):
    cloud_cover = randint(10, 90)
    return {
        'location': location,
        'temperature': randint(22, 40),
        'cloud_cover': cloud_cover,
        'solar_radiation_estimation': max(100, 1000 - cloud_cover * 8),
        'source': 'stub',
    }


def _http_get_json(url, params):
    query = urlencode(params)
    with urlopen(f'{url}?{query}', timeout=HTTP_TIMEOUT_SECONDS) as response:
        return json.loads(response.read().decode('utf-8'))


def _resolve_coordinates(location):
    geocode = _http_get_json(
        GEOCODE_URL,
        {
            'name': location,
            'count': 1,
            'language': 'en',
            'format': 'json',
        },
    )
    first = (geocode.get('results') or [None])[0]
    if not first:
        raise ValueError('Could not resolve location for weather lookup')
    return first['latitude'], first['longitude'], first.get('name', location)


def get_weather_snapshot(location):
    if WEATHER_PROVIDER == 'stub':
        return _stub_weather(location)

    try:
        latitude, longitude, resolved_name = _resolve_coordinates(location)
        weather = _http_get_json(
            FORECAST_URL,
            {
                'latitude': latitude,
                'longitude': longitude,
                'current': 'temperature_2m,cloud_cover,shortwave_radiation',
                'timezone': 'auto',
            },
        )
        current = weather.get('current') or {}
        cloud_cover = int(current.get('cloud_cover', 0))
        shortwave = current.get('shortwave_radiation')
        radiation = int(shortwave if shortwave is not None else max(100, 1000 - cloud_cover * 8))
        return {
            'location': resolved_name,
            'temperature': float(current.get('temperature_2m', 0)),
            'cloud_cover': cloud_cover,
            'solar_radiation_estimation': radiation,
            'source': 'open-meteo',
        }
    except Exception:
        # Reliability-first fallback so dashboard endpoints still work offline.
        return _stub_weather(location)
