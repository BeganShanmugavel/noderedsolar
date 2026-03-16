CREATE DATABASE IF NOT EXISTS solar_monitoring;
USE solar_monitoring;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator') DEFAULT 'operator'
);

CREATE TABLE plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) UNIQUE NOT NULL,
  location VARCHAR(100) NOT NULL,
  capacity_kw FLOAT NOT NULL,
  panel_count INT NOT NULL,
  weather_location VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry_logs (
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

CREATE TABLE ai_analysis_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  timestamp DATETIME NOT NULL,
  predicted_generation FLOAT,
  efficiency FLOAT,
  diagnosis VARCHAR(80),
  anomaly_detected BOOLEAN,
  fault_prediction VARCHAR(120)
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  date DATE NOT NULL,
  maintenance_cost FLOAT NOT NULL,
  note VARCHAR(255)
);

CREATE TABLE alerts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  site_identifier VARCHAR(30) NOT NULL,
  timestamp DATETIME NOT NULL,
  alert_type VARCHAR(80) NOT NULL,
  severity ENUM('Low', 'Medium', 'Critical') NOT NULL,
  message VARCHAR(255) NOT NULL
);
