import json

from db import cursor


def persist_telemetry(data):
    site = data['site_identifier']
    with cursor(commit=True) as cur:
        cur.execute(
            '''INSERT INTO telemetry_logs
               (site_identifier, timestamp, irradiation, temperature, voltage, panel_count, actual_generation, raw_payload)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s)''',
            (
                site,
                data.get('timestamp'),
                data.get('irradiation'),
                data.get('temperature'),
                data.get('voltage'),
                data.get('panel_count'),
                data.get('actual_generation'),
                json.dumps(data),
            ),
        )
        cur.execute(
            '''DELETE FROM telemetry_logs
               WHERE site_identifier=%s
               AND id NOT IN (
                 SELECT id FROM (
                   SELECT id FROM telemetry_logs WHERE site_identifier=%s ORDER BY timestamp DESC LIMIT 25
                 ) t
               )''',
            (site, site),
        )
