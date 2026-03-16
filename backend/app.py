from flask import Flask, jsonify, request
from flask_cors import CORS

from auth import token_required
from db import cursor
from mqtt_listener import start_listener
from ai_engine import make_prediction, diagnose_efficiency
from anomaly_detection import detect_anomaly
from fault_prediction import predict_fault
from maintenance_alerts import create_alert
from panel_health import analyze_panel_health
from financials import calculate_financials
from weather_service import get_weather_snapshot

app = Flask(__name__)
CORS(app)


def telemetry_window(site_identifier):
    with cursor() as cur:
        cur.execute(
            '''SELECT * FROM telemetry_logs
               WHERE site_identifier=%s
               ORDER BY timestamp DESC
               LIMIT 25''',
            (site_identifier,),
        )
        rows = cur.fetchall()
    return list(reversed(rows))


@app.route('/api/health')
def health():
    return jsonify({'ok': True})


@app.post('/api/plants')
@token_required
def register_plant():
    body = request.json
    with cursor(commit=True) as cur:
        cur.execute(
            '''INSERT INTO plants(site_identifier, location, capacity_kw, panel_count, weather_location)
               VALUES (%s,%s,%s,%s,%s)''',
            (
                body['site_identifier'],
                body['location'],
                body['capacity_kw'],
                body['panel_count'],
                body['weather_location'],
            ),
        )
    return jsonify({'status': 'registered'}), 201


@app.get('/api/dashboard/<site_identifier>')
def dashboard(site_identifier):
    window = telemetry_window(site_identifier)
    if not window:
        return jsonify({'error': 'No telemetry found'}), 404

    predicted = make_prediction(window) or window[-1]['actual_generation']
    diagnosis = diagnose_efficiency(window[-1]['actual_generation'], predicted)
    anomaly = detect_anomaly(window)

    efficiencies = []
    for row in window:
        local_pred = max(row['actual_generation'], 1)
        efficiencies.append((row['actual_generation'] / local_pred) * 100)

    fault = predict_fault(efficiencies)
    health = analyze_panel_health(window[-1])
    financial = calculate_financials(window[-1]['actual_generation'])

    alerts = []
    if anomaly['is_anomaly']:
        alerts.append(create_alert(site_identifier, 'Anomaly', 'Abnormal telemetry detected', 'Critical'))
    if fault:
        alerts.append(create_alert(site_identifier, 'Fault Prediction', fault, 'High'))
    if diagnosis['diagnosis'] == 'Panel Soiling':
        alerts.append(create_alert(site_identifier, 'Maintenance', 'Panel cleaning required', 'Medium'))

    with cursor() as cur:
        cur.execute('SELECT weather_location FROM plants WHERE site_identifier=%s', (site_identifier,))
        plant = cur.fetchone() or {'weather_location': 'Unknown'}

    return jsonify(
        {
            'latest': window[-1],
            'window': window,
            'predicted_generation': predicted,
            'efficiency': diagnosis,
            'anomaly': anomaly,
            'fault_prediction': fault,
            'panel_health': health,
            'financials': financial,
            'weather': get_weather_snapshot(plant['weather_location']),
            'alerts': alerts,
            'carbon_offset_kg': round(window[-1]['actual_generation'] * 0.7, 2),
        }
    )


@app.get('/api/alerts/<site_identifier>')
def get_alerts(site_identifier):
    with cursor() as cur:
        cur.execute('SELECT * FROM alerts WHERE site_identifier=%s ORDER BY timestamp DESC LIMIT 50', (site_identifier,))
        rows = cur.fetchall()
    return jsonify(rows)


if __name__ == '__main__':
    start_listener()
    app.run(host='0.0.0.0', port=5000, debug=True)
