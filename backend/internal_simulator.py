import threading
import time
from datetime import datetime
from random import randint, uniform

from config import Config
from db import cursor
from telemetry_store import persist_telemetry


def _simulate_once(site_identifier, panel_count):
    irradiation = randint(520, 910)
    temperature = round(uniform(26, 41), 2)
    voltage = round(uniform(390, 460), 2)
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


def _active_sites():
    with cursor() as cur:
        cur.execute('SELECT site_identifier, panel_count FROM plants')
        rows = cur.fetchall() or []
    sites = []
    for row in rows:
        site = row.get('site_identifier')
        if not site:
            continue
        sites.append((site, int(row.get('panel_count') or Config.INTERNAL_SIM_PANEL_COUNT)))
    if not sites:
        sites = [(Config.INTERNAL_SIM_SITE, Config.INTERNAL_SIM_PANEL_COUNT)]
    return sites


def start_internal_simulator():
    interval = max(2, Config.INTERNAL_SIM_INTERVAL_SECONDS)

    def run():
        print(f'Internal telemetry simulator started (every {interval}s)')
        while True:
            try:
                for site_identifier, panel_count in _active_sites():
                    _simulate_once(site_identifier, panel_count)
            except Exception as exc:
                print(f'Internal simulator error: {exc}')
            time.sleep(interval)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread
