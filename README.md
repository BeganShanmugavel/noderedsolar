# Industrial Solar AI Monitoring Platform

A full-stack solar monitoring application with:
- Flask backend APIs
- Built-in simulated telemetry ingestion
- AI modules (LSTM-style prediction, anomaly/fault utilities)
- MySQL schema (XAMPP/phpMyAdmin compatible)
- React frontend dashboard with role-based access

---

## 1) Prerequisites

Install the following before running:

- **Python 3.10+**
- **Node.js 18+ / npm**
- **XAMPP** (MySQL + phpMyAdmin)

> This project is configured to use **XAMPP MySQL/phpMyAdmin** for database management (instead of MySQL Workbench).

---

## 2) Project Structure

```text
backend/
frontend/
database/
README.md
```

---

## 3) Database Setup (XAMPP MySQL / phpMyAdmin)

1. Open **XAMPP Control Panel**.
2. Start **Apache** and **MySQL**.
3. Open phpMyAdmin: `http://localhost/phpmyadmin`.
4. Click **Import** and upload: `database/schema.sql`.
5. Import the file from the phpMyAdmin server home (no manual DB selection required).

This creates database: `solar_monitoring` and required tables. The schema uses fully-qualified table names (`solar_monitoring.<table>`) so it works even when phpMyAdmin shows "No database selected" for `CREATE DATABASE`/`USE` statements.

### Optional CLI import (also using XAMPP MySQL)

```bash
mysql -h 127.0.0.1 -P 3306 -u root < database/schema.sql
```

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
export JWT_SECRET='solar-secret'
export INTERNAL_SIM_SITE='SOFT-1001'
export INTERNAL_SIM_INTERVAL_SECONDS='5'
```

Run backend:

```bash
python app.py
```

Backend starts on `http://localhost:5000`.

---

## 4.1) How to take weather data

Weather is now fetched automatically from **Open-Meteo** using the plant's `weather_location` value saved during plant registration.

### How it works

1. Backend resolves the city/location text to latitude/longitude via Open-Meteo geocoding API.
2. Backend fetches current:
   - `temperature_2m`
   - `cloud_cover`
   - `shortwave_radiation`
3. Dashboard API (`/api/dashboard/<site_identifier>`) includes this in:
   - `weather`
   - `weather_analysis`

### Required input

When creating a plant, set a real location string in `weather_location` (example: `Ahmedabad`, `Phoenix`, `Riyadh`).

### Optional environment flags

```bash
export WEATHER_PROVIDER='open-meteo'     # default
export WEATHER_HTTP_TIMEOUT='4'
```

For offline/demo mode:

```bash
export WEATHER_PROVIDER='stub'
```

In `stub` mode, backend returns generated weather values so the dashboard continues to operate without internet.

---

## 5) Built-in Telemetry Simulator

This project now uses an internal simulator (no Node-RED or MQTT required).

When backend starts, it continuously writes simulated telemetry into DB for `INTERNAL_SIM_SITE`.

---

## 6) Frontend Setup (React)

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

## 7) First-time Auth Flow

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

If login says **Invalid credentials**, reset admin password:

```bash
curl -X POST http://localhost:5000/api/auth/reset-admin \
  -H 'Content-Type: application/json' \
  -d '{
    "bootstrap_key":"SOLAR_ADMIN_SETUP",
    "email":"admin@solar.local",
    "new_password":"Admin@123"
  }'
```

2. Login from UI with admin credentials.
3. Use **Admin Panel** to create user accounts.
   - Admin registration now captures both user and plant essentials:
     - user: name, email, password, phone, role
     - plant: site identifier, location, weather location, capacity (kW), panel count, panel type
   - On registration, backend also seeds recent telemetry points for the new site so dashboards are immediately usable.
   - Admin can also upload sensor telemetry CSV (`timestamp, irradiation, temperature, voltage, panel_count, actual_generation, site_identifier`) for analysis ingestion.
4. Users then login only (no open self-registration).

---


### Optional: prepare both Admin + User demo logins

```bash
curl -X POST http://localhost:5000/api/auth/bootstrap-demo-users \
  -H 'Content-Type: application/json' \
  -d '{
    "bootstrap_key":"SOLAR_ADMIN_SETUP",
    "admin_email":"admin@solar.local",
    "admin_password":"Admin@123",
    "user_email":"user@solar.local",
    "user_password":"User@123"
  }'
```

Then you can login quickly as:
- Admin: `admin@solar.local` / `Admin@123`
- User: `user@solar.local` / `User@123`

The backend also auto-ensures these standby accounts and a standby plant (`STBY-1001`) on startup for uninterrupted demo use.

Default seeded admin from schema import:
- `admin@solar.local` / `Admin@123`

## 8) Quick Run Order (Recommended)

Start services in this order:

1. XAMPP (**Apache + MySQL**)
2. Flask backend (`python app.py`)
3. React frontend (`npm run dev`)

Then login and open dashboard.

---

## 9) Common Troubleshooting

- **No dashboard data**
  - Ensure backend is running (`python app.py`).
  - Confirm `INTERNAL_SIM_SITE` is set (or default `SOFT-1001`).
  - Wait ~5–10 seconds for simulator inserts.

- **DB connection errors**
  - Confirm XAMPP MySQL is running (Control Panel).
  - Confirm DB env vars (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`).
  - Ensure `solar_monitoring` database exists in phpMyAdmin.

- **401 unauthorized**
  - Login first and ensure token is stored in browser local storage.

- **Admin actions failing**
  - Ensure logged-in user role is `admin`.

---

## 10) API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{"ok": true}
```

---

## 11) Current Status

This repository is a functional prototype with production-style layout. Telemetry is generated by an internal simulator, and the LSTM predictor performs lightweight on-window fitting for live next-step generation estimates.
