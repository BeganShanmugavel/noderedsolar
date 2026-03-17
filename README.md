# Industrial Solar AI Monitoring Platform

A full-stack solar monitoring application with:
- Flask backend APIs
- MQTT telemetry ingestion from Node-RED simulator
- AI modules (LSTM-style prediction, anomaly/fault utilities)
- MySQL schema (XAMPP/phpMyAdmin compatible)
- React frontend dashboard with role-based access

---

## 1) Prerequisites

Install the following before running:

- **Python 3.10+**
- **Node.js 18+ / npm**
- **MySQL** (or XAMPP MySQL/phpMyAdmin)
- **Mosquitto MQTT broker**
- **Node-RED**

---

## 2) Project Structure

```text
backend/
frontend/
database/
node-red/
README.md
```

---

## 3) Database Setup (MySQL / XAMPP)

1. Start MySQL (XAMPP control panel or local service).
2. Create schema/tables:

```bash
mysql -u root -p < database/schema.sql
```

This creates database: `solar_monitoring` and required tables.

---

## 4) Backend Setup (Flask)

From repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows PowerShell
pip install flask flask-cors paho-mqtt mysql-connector-python tensorflow scikit-learn pyjwt werkzeug numpy
```

### Environment variables (optional defaults)

Backend reads from `backend/config.py` and `backend/auth.py` defaults, but you can set:

```bash
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=
export DB_NAME=solar_monitoring
export MQTT_BROKER=localhost
export MQTT_PORT=1883
export MQTT_TOPIC='solar/+/telemetry'
export JWT_SECRET='solar-secret'
```

Run backend:

```bash
python app.py
```

Backend starts on `http://localhost:5000`.

---

## 5) MQTT Broker Setup (Mosquitto)

Start Mosquitto broker (example):

```bash
mosquitto -p 1883
```

---

## 6) Node-RED Simulator Setup

1. Start Node-RED:

```bash
node-red
```

2. Open Node-RED UI: `http://localhost:1880`
3. Import flow file:
   - `node-red/solar_simulator_flow.json`
4. Configure MQTT node to point to your broker (`localhost:1883`).
5. Deploy flow.

Flow publishes telemetry every 5 seconds to topic like:
`solar/SOFT-1001/telemetry`

---

## 7) Frontend Setup (React)

In a new terminal from repo root:

```bash
cd frontend
npm install
```

Set API base URL if needed:

```bash
export VITE_API_URL='http://localhost:5000/api'
```

Run frontend dev server:

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

---

## 8) First-time Auth Flow

Because registration is admin-only:

1. **Bootstrap admin once**:

```bash
curl -X POST http://localhost:5000/api/auth/bootstrap-admin \
  -H 'Content-Type: application/json' \
  -d '{
    "bootstrap_key":"SOLAR_ADMIN_SETUP",
    "name":"Admin",
    "email":"admin@solar.local",
    "password":"Admin@123"
  }'
```

2. Login from UI with admin credentials.
3. Use **Admin Panel** to create user accounts.
4. Users then login only (no open self-registration).

---

## 9) Quick Run Order (Recommended)

Start services in this order:

1. MySQL
2. Mosquitto
3. Flask backend (`python app.py`)
4. Node-RED flow deployed
5. React frontend (`npm run dev`)

Then login and open dashboard.

---

## 10) Common Troubleshooting

- **No dashboard data**
  - Verify Node-RED flow is deployed.
  - Verify Mosquitto is running.
  - Verify backend subscribed to `solar/+/telemetry`.

- **DB connection errors**
  - Confirm MySQL credentials/env vars.
  - Ensure `solar_monitoring` database exists.

- **401 unauthorized**
  - Login first and ensure token is stored in browser local storage.

- **Admin actions failing**
  - Ensure logged-in user role is `admin`.

---

## 11) API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{"ok": true}
```

---

## 12) Current Status

This repository is a functional prototype with production-style layout. Some AI/weather parts are stubs/simplified and can be replaced by trained models and real weather providers in production.
