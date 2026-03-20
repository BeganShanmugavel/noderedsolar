from random import randint


def get_weather_snapshot(location):
    # Stub for production weather API integration
    cloud_cover = randint(10, 90)
    return {
        'location': location,
        'temperature': randint(22, 40),
        'cloud_cover': cloud_cover,
        'solar_radiation_estimation': max(100, 1000 - cloud_cover * 8),
    }
