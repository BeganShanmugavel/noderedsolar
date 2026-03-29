from contextlib import contextmanager
import sqlite3
import mysql.connector

from config import Config


SQLITE_SCHEMA = '''
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  designation TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_identifier TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  capacity_kw REAL NOT NULL,
  panel_count INTEGER NOT NULL,
  panel_type TEXT DEFAULT 'Standard',
  weather_location TEXT NOT NULL,
  owner_user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemetry_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_identifier TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  irradiation REAL,
  temperature REAL,
  voltage REAL,
  panel_count INTEGER,
  actual_generation REAL,
  raw_payload TEXT
);

CREATE TABLE IF NOT EXISTS ai_analysis_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_identifier TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  predicted_generation REAL,
  efficiency REAL,
  diagnosis TEXT,
  anomaly_detected INTEGER,
  fault_prediction TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_identifier TEXT NOT NULL,
  date TEXT NOT NULL,
  maintenance_cost REAL NOT NULL,
  note TEXT
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_identifier TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL
);
'''


class CursorProxy:
    def __init__(self, cur, engine):
        self.cur = cur
        self.engine = engine

    def execute(self, query, params=None):
        if params is None:
            params = ()
        if self.engine == 'sqlite':
            q = query.replace('%s', '?')
            self.cur.execute(q, params)
        else:
            self.cur.execute(query, params)
        return self

    def fetchone(self):
        row = self.cur.fetchone()
        if row is None:
            return None
        if self.engine == 'sqlite':
            return dict(row)
        return row

    def fetchall(self):
        rows = self.cur.fetchall()
        if self.engine == 'sqlite':
            return [dict(r) for r in rows]
        return rows

    @property
    def rowcount(self):
        return self.cur.rowcount

    @property
    def lastrowid(self):
        return self.cur.lastrowid

    def close(self):
        self.cur.close()


def _sqlite_connection():
    conn = sqlite3.connect(Config.SQLITE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.executescript(SQLITE_SCHEMA)
    return conn


def get_connection():
    engine = (Config.DB_ENGINE or 'auto').lower()
    if engine in ('mysql', 'auto'):
        try:
            conn = mysql.connector.connect(
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
            )
            return conn, 'mysql'
        except Exception:
            if engine == 'mysql':
                raise
    return _sqlite_connection(), 'sqlite'


@contextmanager
def cursor(commit=False):
    conn, engine = get_connection()
    cur = conn.cursor(dictionary=True) if engine == 'mysql' else conn.cursor()
    proxy = CursorProxy(cur, engine)
    try:
        yield proxy
        if commit:
            conn.commit()
    finally:
        proxy.close()
        conn.close()
