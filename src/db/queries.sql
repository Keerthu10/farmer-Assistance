-- ==========================================================
-- FARMER ASSISTANCE WEB SERVICE - PRODUCTION MYSQL QUERIES
-- ==========================================================

-- 1. AUTHENTICATION & PROFILE QUERIES
-- Register new user
INSERT INTO users (name, email, phone, password_hash, role, status, district, state, village)
VALUES ('Ramesh Kumar', 'farmer@agroassist.gov.in', '+91 98765 43210', '$2a$10$YourHashedPasswordHere', 'farmer', 'active', 'Ludhiana', 'Punjab', 'Samrala');

-- Farmer Profile Insertion
INSERT INTO farmers (user_id, district, state, village, land_area_total, primary_soil_type, water_source)
VALUES (LAST_INSERT_ID(), 'Ludhiana', 'Punjab', 'Samrala', 12.5, 'Alluvial Loam', 'Canal + Tube Well');

-- User Login query with role verification
SELECT u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.status, u.district, u.state, u.village
FROM users u
WHERE u.email = 'farmer@agroassist.gov.in' AND u.status = 'active'
LIMIT 1;

-- 2. CROP MANAGEMENT QUERIES
-- List crops for farmer with harvest countdown
SELECT 
    c.id, c.name, c.type, c.sowing_date, c.expected_harvest_date,
    c.land_area, c.irrigation_type, c.crop_status, c.estimated_yield_quintals,
    DATEDIFF(c.expected_harvest_date, CURDATE()) AS days_until_harvest
FROM crops c
WHERE c.farmer_id = ?
ORDER BY c.sowing_date DESC;

-- Add new crop entry
INSERT INTO crops (farmer_id, name, type, sowing_date, expected_harvest_date, land_area, irrigation_type, crop_status, notes)
VALUES (?, 'Sharbati Wheat', 'Cereals', '2026-11-10', '2027-04-15', 5.5, 'Drip Irrigation', 'planted', 'High-protein durum variety');

-- Update crop stage & details
UPDATE crops 
SET crop_status = 'flowering', irrigation_type = 'Drip Irrigation', notes = 'Top dressing with urea completed'
WHERE id = ? AND farmer_id = ?;

-- 3. AGRICULTURAL ASSISTANCE & EXPERT TICKETING
-- Create assistance request
INSERT INTO assistance_requests (farmer_id, district, crop_id, crop_name, title, category, description, photo_url, urgency, status)
VALUES (?, 'Ludhiana', ?, 'Paddy (Basmati)', 'Yellowing of leaf tips and stem borer signs', 'Pest Attack', 'Noticed yellow stems with small bore holes near water line.', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80', 'High', 'Pending');

-- Agriculture Officer fetching assigned or pending requests
SELECT 
    r.id, r.title, r.category, r.crop_name, r.urgency, r.status, r.created_at,
    u.name AS farmer_name, u.phone AS farmer_phone, r.district
FROM assistance_requests r
JOIN users u ON r.farmer_id = u.id
WHERE r.district = ? OR r.assigned_officer_id = ?
ORDER BY 
    CASE r.urgency 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        ELSE 4 
    END,
    r.created_at DESC;

-- Officer replies to assistance request and updates ticket status
INSERT INTO assistance_responses (request_id, responder_id, responder_name, responder_role, message, recommended_actions, chemical_biological_advice)
VALUES (?, ?, 'Dr. Sunita Sharma', 'officer', 'Identified as Yellow Stem Borer at vegetative stage. Implement pheromone traps immediately.', 
        '["Install 5 pheromone traps per acre", "Maintain 2-3 cm standing water during application", "Avoid excessive nitrogenous fertilizer"]', 
        'Apply Cartap Hydrochloride 4G @ 10 kg/acre or Chlorantraniliprole 0.4% G @ 4 kg/acre.');

UPDATE assistance_requests 
SET status = 'In Progress', assigned_officer_id = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 4. MARKET PRICE SEARCH, FILTER & HISTORICAL TRENDS
-- Search current modal prices by crop and district
SELECT 
    m.crop_name, m.variety, m.district, m.market_name,
    m.min_price, m.max_price, m.modal_price, m.price_change_percent, m.date
FROM market_prices m
WHERE (m.crop_name LIKE CONCAT('%', ?, '%') OR ? IS NULL)
  AND (m.district = ? OR ? IS NULL)
ORDER BY m.modal_price DESC;

-- 30-Day Historical Trend for a Crop
SELECT date, modal_price, min_price, max_price
FROM market_prices
WHERE crop_name = ? AND district = ?
ORDER BY date ASC
LIMIT 30;

-- 5. ADMIN ANALYTICS & SYSTEM REPORTING
-- Overall dashboard KPI counts
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'farmer') AS total_farmers,
    (SELECT COUNT(*) FROM users WHERE role = 'officer') AS total_officers,
    (SELECT COUNT(*) FROM crops) AS total_crops,
    (SELECT IFNULL(SUM(land_area), 0) FROM crops) AS total_acreage,
    (SELECT COUNT(*) FROM assistance_requests WHERE status = 'Pending') AS pending_requests,
    (SELECT COUNT(*) FROM assistance_requests WHERE status = 'Resolved') AS resolved_requests,
    ROUND((SELECT COUNT(*) FROM assistance_requests WHERE status = 'Resolved') / NULLIF((SELECT COUNT(*) FROM assistance_requests), 0) * 100, 1) AS resolution_rate_percent;

-- Assistance category distribution
SELECT category, COUNT(*) as count
FROM assistance_requests
GROUP BY category
ORDER BY count DESC;

-- Crop status distribution
SELECT crop_status, COUNT(*) as count, SUM(land_area) as total_acres
FROM crops
GROUP BY crop_status;
