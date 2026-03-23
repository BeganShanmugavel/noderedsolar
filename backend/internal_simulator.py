import threading
import time
from datetime import datetime
from random import randint, uniform

from config import Config
from telemetry_store import persist_telemetry


def _simulate_once(site_identifier):
    irradiation = randint(520, 910)
    temperature = round(uniform(26, 41), 2)
    voltage = round(uniform(390, 460), 2)
    panel_count = Config.INTERNAL_SIM_PANEL_COUNT
    actual_generation = round(max(20, irradiation * 0.075 - temperature * 0.22), 2)
    payload = {
        'site_identifier': site_identifier,
        'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        'irradiation': irradiation,
        'temperature': temperature,
        'voltage': voltage,
        'panel_count': panel_count,
        'actual_generation': actual_generation,
    }
    persist_telemetry(payload)


def start_internal_simulator():
    site_identifier = Config.INTERNAL_SIM_SITE
    interval = max(2, Config.INTERNAL_SIM_INTERVAL_SECONDS)

    def run():
        print(f'Internal telemetry simulator started for {site_identifier} (every {interval}s)')
        while True:
            try:
                _simulate_once(site_identifier)
            except Exception as exc:
                print(f'Internal simulator error: {exc}')
            time.sleep(interval)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread
