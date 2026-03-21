import json
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
from advanced_ai import derive_ai_insights

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




def hydrate_latest_telemetry(row):
    if not row:
        return row
    payload = row.get('raw_payload')
    if not payload:
        return row
    try:
        parsed = json.loads(payload) if isinstance(payload, str) else payload
        if isinstance(parsed, dict):
            row = {**row, **parsed}
    except Exception:
        pass
    return row




def build_weather_analysis(weather):
    cloud = weather.get('cloud_cover', 0)
    temp = weather.get('temperature', 0)
    radiation = weather.get('solar_radiation_estimation', 0)

    if cloud > 70:
        impact = 'High cloud cover likely reducing generation output.'
    elif cloud > 40:
        impact = 'Moderate cloud cover causing partial generation loss.'
    else:
        impact = 'Weather is favorable for strong generation performance.'

    if temp > 38:
        thermal = 'High temperature may cause thermal derating.'
    elif temp < 18:
        thermal = 'Cooler temperature supports stable panel efficiency.'
    else:
        thermal = 'Temperature is in normal operating range.'

    return {
        'weather_impact_summary': impact,
        'thermal_note': thermal,
        'radiation_level': radiation,
    }


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
            'INSERT INTO users(name,email,password_hash,phone,designation,role) VALUES (%s,%s,%s,%s,%s,%s)',
            (
                body.get('name', 'Platform Admin'),
                body['email'],
                hash_password(body['password']),
                'admin',
            ),
        )
    return jsonify({'status': 'admin_created'}), 201




@app.post('/api/auth/reset-admin')
def reset_admin():
    body = request.json or {}
    key = body.get('bootstrap_key')
    email = body.get('email', 'admin@solar.local')
    new_password = body.get('new_password')

    if key != 'SOLAR_ADMIN_SETUP':
        return jsonify({'error': 'Invalid bootstrap key'}), 403
    if not new_password:
        return jsonify({'error': 'new_password required'}), 400

    with cursor(commit=True) as cur:
        cur.execute('SELECT id FROM users WHERE email=%s AND role=%s', (email, 'admin'))
        existing = cur.fetchone()
        if existing:
            cur.execute('UPDATE users SET password_hash=%s WHERE id=%s', (hash_password(new_password), existing['id']))
            return jsonify({'status': 'admin_password_reset', 'email': email})

        cur.execute(
            'INSERT INTO users(name,email,password_hash,phone,designation,role) VALUES (%s,%s,%s,%s,%s,%s)',
            ('Platform Admin', email, hash_password(new_password), 'admin'),
        )

    return jsonify({'status': 'admin_created', 'email': email}), 201

@app.post('/api/auth/login')
def login():
    body = request.json or {}
    email = body.get('email')
    password = body.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    with cursor() as cur:
        cur.execute('SELECT id, name, email, password_hash, phone, designation, role FROM users WHERE email=%s', (email,))
        user = cur.fetchone()

    if not user or not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({'token': token, 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'phone': user.get('phone'), 'designation': user.get('designation'), 'role': user['role']}})




@app.post('/api/auth/bootstrap-demo-users')
def bootstrap_demo_users():
    body = request.json or {}
    if body.get('bootstrap_key') != 'SOLAR_ADMIN_SETUP':
        return jsonify({'error': 'Invalid bootstrap key'}), 403

    admin_email = body.get('admin_email', 'admin@solar.local')
    user_email = body.get('user_email', 'user@solar.local')
    admin_password = body.get('admin_password', 'Admin@123')
    user_password = body.get('user_password', 'User@123')

    with cursor(commit=True) as cur:
        cur.execute('SELECT id FROM users WHERE email=%s', (admin_email,))
        existing_admin = cur.fetchone()
        if existing_admin:
            cur.execute('UPDATE users SET password_hash=%s, role=%s WHERE id=%s', (hash_password(admin_password), 'admin', existing_admin['id']))
        else:
            cur.execute('INSERT INTO users(name,email,password_hash,phone,designation,role) VALUES (%s,%s,%s,%s,%s,%s)', ('Demo Admin', admin_email, hash_password(admin_password), 'admin'))

        cur.execute('SELECT id FROM users WHERE email=%s', (user_email,))
        existing_user = cur.fetchone()
        if existing_user:
            cur.execute('UPDATE users SET password_hash=%s, role=%s WHERE id=%s', (hash_password(user_password), 'user', existing_user['id']))
        else:
            cur.execute('INSERT INTO users(name,email,password_hash,phone,designation,role) VALUES (%s,%s,%s,%s,%s,%s)', ('Demo User', user_email, hash_password(user_password), 'user'))

    return jsonify({'status': 'demo_users_ready', 'admin_email': admin_email, 'user_email': user_email})


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
            'INSERT INTO users(name,email,password_hash,phone,designation,role) VALUES (%s,%s,%s,%s,%s,%s)',
            (body['name'], body['email'], hash_password(body['password']), body.get('phone'), body.get('designation'), body.get('role', 'user')),
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
    latest_hydrated = hydrate_latest_telemetry(window[-1])
    health = analyze_panel_health(latest_hydrated)
    financial = calculate_financials(window[-1]['actual_generation'])
    advanced_metrics = compute_advanced_metrics(window, predicted)
    ai_insights = derive_ai_insights(window)

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

    weather_data = get_weather_snapshot(plant['weather_location'])

    return jsonify(
        {
            'latest': latest_hydrated,
            'window': window,
            'predicted_generation': predicted,
            'efficiency': diagnosis,
            'anomaly': anomaly,
            'fault_prediction': fault,
            'panel_health': health,
            'financials': financial,
            'advanced_metrics': advanced_metrics,
            'ai_insights': ai_insights,
            'weather': weather_data,
            'weather_analysis': build_weather_analysis(weather_data),
            'alerts': alerts,
            'carbon_offset_kg': round(window[-1]['actual_generation'] * 0.7, 2),
        }
    )




@app.get('/api/ai-insights/<site_identifier>')
@token_required
def ai_insights(site_identifier):
    window = telemetry_window(site_identifier)
    if not window:
        return jsonify({'error': 'No telemetry found'}), 404
    return jsonify(derive_ai_insights(window))


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
