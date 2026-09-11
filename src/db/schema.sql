-- ==========================================================
-- FARMER ASSISTANCE WEB SERVICE - COMPLETE MYSQL SCHEMA
-- Database: agroassist_db
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS agroassist_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agroassist_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('farmer', 'officer', 'admin') NOT NULL DEFAULT 'farmer',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  avatar VARCHAR(255) NULL,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  village VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_district (district)
) ENGINE=InnoDB;

-- 2. FARMERS PROFILE TABLE (1:1 with users where role = 'farmer')
CREATE TABLE IF NOT EXISTS farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  village VARCHAR(100) NOT NULL,
  land_area_total DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT 'Area in acres',
  primary_soil_type VARCHAR(50) NOT NULL DEFAULT 'Alluvial Soil',
  water_source VARCHAR(50) NOT NULL DEFAULT 'Tube Well',
  aadhaar_number_masked VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_farmers_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. AGRICULTURE OFFICERS TABLE (1:1 with users where role = 'officer')
CREATE TABLE IF NOT EXISTS officers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL DEFAULT 'Department of Agriculture & Farmers Welfare',
  designation VARCHAR(100) NOT NULL DEFAULT 'Block Agricultural Officer',
  assigned_district VARCHAR(100) NOT NULL,
  office_contact VARCHAR(20) NOT NULL,
  specialization VARCHAR(100) NOT NULL DEFAULT 'Agronomy & Plant Pathology',
  badge_number VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_officers_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. CROPS TABLE
CREATE TABLE IF NOT EXISTS crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('Cereals', 'Pulses', 'Cash Crops', 'Vegetables', 'Oilseeds', 'Horticulture') NOT NULL,
  sowing_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  land_area DECIMAL(6,2) NOT NULL COMMENT 'Cultivated area in acres',
  irrigation_type ENUM('Drip Irrigation', 'Sprinkler', 'Canal Flood', 'Tube Well', 'Rainfed') NOT NULL,
  crop_status ENUM('planted', 'vegetative', 'flowering', 'harvesting', 'completed') NOT NULL DEFAULT 'planted',
  soil_type VARCHAR(50) NULL,
  estimated_yield_quintals DECIMAL(8,2) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_crops_farmer FOREIGN KEY (farmer_id) 
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_crops_farmer (farmer_id),
  INDEX idx_crops_status (crop_status),
  INDEX idx_crops_harvest (expected_harvest_date)
) ENGINE=InnoDB;

-- 5. ASSISTANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS assistance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  district VARCHAR(100) NOT NULL,
  crop_id INT NULL,
  crop_name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  category ENUM('Pest Attack', 'Disease', 'Irrigation Issue', 'Fertilizer Issue', 'Soil Issue', 'Other') NOT NULL,
  description TEXT NOT NULL,
  photo_url VARCHAR(500) NULL,
  urgency ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Pending',
  assigned_officer_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_requests_farmer FOREIGN KEY (farmer_id) 
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_requests_crop FOREIGN KEY (crop_id) 
    REFERENCES crops(id) ON DELETE SET NULL,
  CONSTRAINT fk_requests_officer FOREIGN KEY (assigned_officer_id) 
    REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_requests_status (status),
  INDEX idx_requests_category (category),
  INDEX idx_requests_district (district)
) ENGINE=InnoDB;

-- 6. ASSISTANCE RESPONSES TABLE
CREATE TABLE IF NOT EXISTS assistance_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  responder_id INT NOT NULL,
  responder_name VARCHAR(100) NOT NULL,
  responder_role ENUM('officer', 'admin', 'farmer') NOT NULL,
  message TEXT NOT NULL,
  recommended_actions JSON NULL,
  chemical_biological_advice TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_responses_request FOREIGN KEY (request_id) 
    REFERENCES assistance_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_responses_user FOREIGN KEY (responder_id) 
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_responses_request (request_id)
) ENGINE=InnoDB;

-- 7. MARKET PRICES TABLE
CREATE TABLE IF NOT EXISTS market_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  market_name VARCHAR(150) NOT NULL,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,
  modal_price DECIMAL(10,2) NOT NULL COMMENT 'Average / Modal trade rate per quintal',
  unit VARCHAR(20) NOT NULL DEFAULT '₹/Quintal',
  price_change_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_market_crop (crop_name),
  INDEX idx_market_district (district),
  INDEX idx_market_date (date)
) ENGINE=InnoDB;

-- 8. WEATHER LOGS TABLE
CREATE TABLE IF NOT EXISTS weather_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  humidity INT NOT NULL,
  wind_speed DECIMAL(4,1) NOT NULL,
  rain_prediction INT NOT NULL COMMENT 'Rain probability in %',
  condition_text VARCHAR(100) NOT NULL,
  uv_index DECIMAL(3,1) NOT NULL,
  agri_advisory TEXT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_weather_district (district),
  INDEX idx_weather_recorded (recorded_at)
) ENGINE=InnoDB;

-- 9. GOVERNMENT SCHEMES TABLE
CREATE TABLE IF NOT EXISTS schemes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category ENUM('Financial Assistance', 'Crop Insurance', 'Equipment & Solar', 'Seed & Organic', 'Irrigation Support') NOT NULL,
  description TEXT NOT NULL,
  sponsor ENUM('Central Government', 'State Government', 'NABARD') NOT NULL,
  subsidy_amount_or_percent VARCHAR(150) NOT NULL,
  eligibility_criteria JSON NOT NULL,
  benefits JSON NOT NULL,
  application_guide JSON NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  required_documents JSON NOT NULL,
  status ENUM('open', 'closing_soon', 'closed') NOT NULL DEFAULT 'open',
  link_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_schemes_category (category),
  INDEX idx_schemes_status (status)
) ENGINE=InnoDB;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('weather', 'market', 'scheme', 'assistance', 'system') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_link VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_unread (user_id, is_read)
) ENGINE=InnoDB;
