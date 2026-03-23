import json
import paho.mqtt.client as mqtt
from config import Config
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


def on_connect(client, userdata, flags, rc):
    client.subscribe(Config.MQTT_TOPIC)


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        persist_telemetry(payload)
    except Exception as exc:
        print(f'MQTT message handling error: {exc}')


def start_listener():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    try:
        client.connect(Config.MQTT_BROKER, Config.MQTT_PORT, 60)
        client.loop_start()
        return client
    except Exception as exc:
        print(f'MQTT listener unavailable: {exc}')
        return None
