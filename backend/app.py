from statistics import mean
from flask import Flask, jsonify, request
from flask_cors import CORS

from auth import admin_required, token_required, generate_token, hash_password, verify_password
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


def compute_advanced_metrics(window, predicted):
    latest = window[-1]
    generation = [r['actual_generation'] for r in window]
    voltage = [r['voltage'] for r in window]
    temperature = [r['temperature'] for r in window]
    irradiation = [r['irradiation'] for r in window]

    utilization = round((latest['actual_generation'] / max(predicted, 1)) * 100, 2)
    volatility = round((max(generation) - min(generation)) / max(mean(generation), 1), 3)
    stability_score = max(0, round(100 - volatility * 100, 2))

    return {
        'utilization_percent': utilization,
        'stability_score': stability_score,
        'peak_generation': max(generation),
        'avg_voltage': round(mean(voltage), 2),
        'avg_temperature': round(mean(temperature), 2),
        'irradiation_index': round(mean(irradiation), 2),
        'forecast_next_hour_generation': round(mean(generation[-5:]) * 12, 2),
    }


@app.route('/api/health')
def health():
    return jsonify({'ok': True})


@app.post('/api/auth/bootstrap-admin')
def bootstrap_admin():
    body = request.json or {}
    key = body.get('bootstrap_key')
    if key != 'SOLAR_ADMIN_SETUP':
        return jsonify({'error': 'Invalid bootstrap key'}), 403

    with cursor(commit=True) as cur:
        cur.execute('SELECT id FROM users WHERE role=%s LIMIT 1', ('admin',))
        if cur.fetchone():
            return jsonify({'error': 'Admin already exists'}), 409
        cur.execute(
            'INSERT INTO users(name,email,password_hash,role) VALUES (%s,%s,%s,%s)',
            (
                body.get('name', 'Platform Admin'),
                body['email'],
                hash_password(body['password']),
                'admin',
            ),
        )
    return jsonify({'status': 'admin_created'}), 201


@app.post('/api/auth/login')
def login():
    body = request.json or {}
    email = body.get('email')
    password = body.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    with cursor() as cur:
        cur.execute('SELECT id, name, email, password_hash, role FROM users WHERE email=%s', (email,))
        user = cur.fetchone()

    if not user or not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({'token': token, 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'role': user['role']}})


@app.post('/api/auth/register')
@admin_required
def register_user():
    body = request.json or {}
    required = ['name', 'email', 'password']
    if not all(body.get(k) for k in required):
        return jsonify({'error': 'name, email, password required'}), 400

    with cursor(commit=True) as cur:
        cur.execute('SELECT id FROM users WHERE email=%s', (body['email'],))
        if cur.fetchone():
            return jsonify({'error': 'User already exists'}), 409
        cur.execute(
            'INSERT INTO users(name,email,password_hash,role) VALUES (%s,%s,%s,%s)',
            (body['name'], body['email'], hash_password(body['password']), body.get('role', 'user')),
        )
    return jsonify({'status': 'user_created'}), 201


@app.post('/api/plants')
@admin_required
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
@token_required
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
    advanced_metrics = compute_advanced_metrics(window, predicted)

    alerts = []
    if anomaly['is_anomaly']:
        alerts.append(create_alert(site_identifier, 'Anomaly', 'Abnormal telemetry detected', 'Critical'))
    if fault:
        alerts.append(create_alert(site_identifier, 'Fault Prediction', fault, 'Critical'))
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
            'advanced_metrics': advanced_metrics,
            'weather': get_weather_snapshot(plant['weather_location']),
            'alerts': alerts,
            'carbon_offset_kg': round(window[-1]['actual_generation'] * 0.7, 2),
        }
    )


@app.get('/api/alerts/<site_identifier>')
@token_required
def get_alerts(site_identifier):
    with cursor() as cur:
        cur.execute('SELECT * FROM alerts WHERE site_identifier=%s ORDER BY timestamp DESC LIMIT 50', (site_identifier,))
        rows = cur.fetchall()
    return jsonify(rows)


if __name__ == '__main__':
    start_listener()
    app.run(host='0.0.0.0', port=5000, debug=True)
