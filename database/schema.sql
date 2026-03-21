CREATE DATABASE IF NOT EXISTS solar_monitoring;

CREATE TABLE IF NOT EXISTS solar_monitoring.users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(25),
  designation VARCHAR(80),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solar_monitoring.plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) UNIQUE NOT NULL,
  location VARCHAR(100) NOT NULL,
  capacity_kw FLOAT NOT NULL,
  panel_count INT NOT NULL,
  weather_location VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solar_monitoring.telemetry_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  timestamp DATETIME NOT NULL,
  irradiation FLOAT,
  temperature FLOAT,
  voltage FLOAT,
  panel_count INT,
  actual_generation FLOAT,
  raw_payload JSON,
  INDEX idx_site_time (site_identifier, timestamp)
);

CREATE TABLE IF NOT EXISTS solar_monitoring.ai_analysis_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  timestamp DATETIME NOT NULL,
  predicted_generation FLOAT,
  efficiency FLOAT,
  diagnosis VARCHAR(80),
  anomaly_detected BOOLEAN,
  fault_prediction VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS solar_monitoring.expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  date DATE NOT NULL,
  maintenance_cost FLOAT NOT NULL,
  note VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS solar_monitoring.alerts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  timestamp DATETIME NOT NULL,
  alert_type VARCHAR(80) NOT NULL,
  severity ENUM('Low', 'Medium', 'Critical') NOT NULL,
  message VARCHAR(255) NOT NULL
);

INSERT INTO solar_monitoring.users (name, email, password_hash, role)
VALUES ('Default Admin', 'admin@solar.local', 'Admin@123', 'admin')
ON DUPLICATE KEY UPDATE role='admin';
