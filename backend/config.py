import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
    DB_ENGINE = os.getenv('DB_ENGINE', 'auto')  # auto | mysql | sqlite
    SQLITE_PATH = os.getenv('SQLITE_PATH', 'solar_monitoring.db')
    INTERNAL_SIM_SITE = os.getenv('INTERNAL_SIM_SITE', 'SOFT-1001')
    INTERNAL_SIM_INTERVAL_SECONDS = int(os.getenv('INTERNAL_SIM_INTERVAL_SECONDS', '5'))
    INTERNAL_SIM_PANEL_COUNT = int(os.getenv('INTERNAL_SIM_PANEL_COUNT', '120'))

    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = int(os.getenv('DB_PORT', '3306'))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'solar_monitoring')

    ELECTRICITY_RATE = float(os.getenv('ELECTRICITY_RATE', '0.14'))
    DEFAULT_MAINTENANCE_COST = float(os.getenv('DEFAULT_MAINTENANCE_COST', '15.0'))
