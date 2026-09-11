import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { 
  Database, Server, Layout, ShieldCheck, Code, 
  Terminal, FileText, CheckCircle2, Copy, Check 
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'er_diagram' | 'mysql' | 'apis' | 'auth_flow' | 'deployment'>('architecture');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleMySqlDDL = `-- ==========================================================
-- FARMER ASSISTANCE WEB SERVICE - COMPLETE MYSQL SCHEMA
-- ==========================================================
CREATE DATABASE IF NOT EXISTS agroassist_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE agroassist_db;

-- 1. USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('farmer', 'officer', 'admin') NOT NULL DEFAULT 'farmer',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  village VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- 2. FARMERS TABLE (1:1 with users)
CREATE TABLE farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  land_area_total DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  primary_soil_type VARCHAR(50) NOT NULL,
  water_source VARCHAR(50) NOT NULL,
  CONSTRAINT fk_farmers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. OFFICERS TABLE (1:1 with users)
CREATE TABLE officers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  assigned_district VARCHAR(100) NOT NULL,
  badge_number VARCHAR(50) NOT NULL UNIQUE,
  CONSTRAINT fk_officers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. CROPS TABLE
CREATE TABLE crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('Cereals', 'Pulses', 'Cash Crops', 'Vegetables', 'Oilseeds', 'Horticulture') NOT NULL,
  sowing_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  land_area DECIMAL(6,2) NOT NULL,
  irrigation_type ENUM('Drip Irrigation', 'Sprinkler', 'Canal Flood', 'Tube Well', 'Rainfed') NOT NULL,
  crop_status ENUM('planted', 'vegetative', 'flowering', 'harvesting', 'completed') NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_crops_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. ASSISTANCE REQUESTS & RESPONSES
CREATE TABLE assistance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  district VARCHAR(100) NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  category ENUM('Pest Attack', 'Disease', 'Irrigation Issue', 'Fertilizer Issue', 'Soil Issue', 'Other') NOT NULL,
  description TEXT NOT NULL,
  photo_url VARCHAR(500) NULL,
  urgency ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Pending',
  assigned_officer_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_req_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Architecture & Enterprise Deliverables"
      subtitle="Complete specification, database schemas, ER diagrams, and deployment guides"
      maxWidth="5xl"
    >
      {/* Navigation tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 pb-2 mb-6 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'architecture'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Server className="w-4 h-4" /> 1. Project Architecture
        </button>
        <button
          onClick={() => setActiveTab('er_diagram')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'er_diagram'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Database className="w-4 h-4" /> 2. ER Diagram
        </button>
        <button
          onClick={() => setActiveTab('mysql')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'mysql'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Code className="w-4 h-4" /> 3. MySQL Schema & Queries
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'apis'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" /> 4. API Endpoints
        </button>
        <button
          onClick={() => setActiveTab('auth_flow')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'auth_flow'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> 5. Auth & RBAC
        </button>
        <button
          onClick={() => setActiveTab('deployment')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === 'deployment'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Terminal className="w-4 h-4" /> 6. Deployment Guide
        </button>
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 text-sm text-stone-700 dark:text-stone-300">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-base mb-2">High-Level 3-Tier Enterprise Architecture</h4>
            <p className="leading-relaxed">
              The Farmer Assistance Web Service (AgroAssist) is architected on a decoupled, production-ready Full Stack pattern. The client single-page application is rendered via React 19 + Vite + Tailwind CSS, consuming protected RESTful JSON micro-services exposed by a resilient Node.js / Express backend with JSON Web Token (JWT) stateless authorization and relational MySQL persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white mb-2">
                <Layout className="w-4 h-4 text-emerald-600" /> Presentation Tier
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>• React.js 19 (Vite modern bundler)</li>
                <li>• Context API (Auth, Theme, Alerts)</li>
                <li>• Recharts (Market & Crop visualizations)</li>
                <li>• Tailwind CSS & Lucide Icons</li>
                <li>• Axios client with auto Bearer interceptor</li>
                <li>• Dark & Light mode theme engine</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white mb-2">
                <Server className="w-4 h-4 text-emerald-600" /> Application Tier
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>• Node.js & Express REST API</li>
                <li>• JWT verification & role validation middleware</li>
                <li>• bcrypt password hashing (10 salt rounds)</li>
                <li>• Agricultural advisory calculation engine</li>
                <li>• Real-time notification dispatch hub</li>
                <li>• Weather API integration (Open-Meteo)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white mb-2">
                <Database className="w-4 h-4 text-emerald-600" /> Persistence Tier
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>• MySQL 8.0 / InnoDB transactional engine</li>
                <li>• Foreign Key cascading rules & integrity</li>
                <li>• Multi-column B-tree indexing on hot queries</li>
                <li>• Normalized 3NF entity relational design</li>
                <li>• In-memory mirror for instant zero-config dev</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ER Diagram */}
      {activeTab === 'er_diagram' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto">
            <p className="text-emerald-400 font-bold mb-3">// DATABASE ENTITY-RELATIONSHIP (ER) MAPPING</p>
{`[users]
  ├── (1:1) ──────> [farmers] (user_id -> users.id)
  ├── (1:1) ──────> [officers] (user_id -> users.id)
  ├── (1:N) ──────> [crops] (farmer_id -> users.id)
  ├── (1:N) ──────> [assistance_requests] (farmer_id -> users.id)
  ├── (1:N) ──────> [assistance_responses] (responder_id -> users.id)
  └── (1:N) ──────> [notifications] (user_id -> users.id)

[crops]
  └── (1:N) ──────> [assistance_requests] (crop_id -> crops.id NULLABLE)

[assistance_requests]
  └── (1:N) ──────> [assistance_responses] (request_id -> assistance_requests.id)

[market_prices]     (Standalone APMC mandi trade records, indexed by crop_name & district)
[weather_logs]      (District weather station observations & IMD forecasts)
[schemes]           (Central/State subsidy programs with JSON criteria)`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-lg">
              <span className="font-bold text-emerald-600">Integrity Rules:</span>
              <p className="mt-1 text-stone-600 dark:text-stone-400">
                Deleting a user cascades to their profile, crops, and notifications. Assistance requests retain their audit trail if crops are archived.
              </p>
            </div>
            <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-lg">
              <span className="font-bold text-emerald-600">Performance Indexing:</span>
              <p className="mt-1 text-stone-600 dark:text-stone-400">
                Indexed on <code>(farmer_id, crop_status)</code>, <code>(district, category)</code>, and <code>(user_id, is_read)</code> for sub-millisecond retrieval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MySQL */}
      {activeTab === 'mysql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Generated in <code>/src/db/schema.sql</code> and <code>/src/db/queries.sql</code>
            </p>
            <button
              onClick={() => handleCopy(sampleMySqlDDL)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy DDL'}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto max-h-96">
            {sampleMySqlDDL}
          </pre>
        </div>
      )}

      {/* Tab 4: API Endpoints */}
      {activeTab === 'apis' && (
        <div className="space-y-3 text-xs">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-stone-100 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300">
                <tr>
                  <th className="p-2.5">Method</th>
                  <th className="p-2.5">Endpoint</th>
                  <th className="p-2.5">Auth / Role</th>
                  <th className="p-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-600 dark:text-stone-400">
                <tr>
                  <td className="p-2.5 font-bold text-emerald-600">POST</td>
                  <td className="p-2.5 font-mono">/api/auth/login</td>
                  <td className="p-2.5">Public</td>
                  <td className="p-2.5">JWT token issuance via email/password</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-600">POST</td>
                  <td className="p-2.5 font-mono">/api/auth/register</td>
                  <td className="p-2.5">Public</td>
                  <td className="p-2.5">Register as Farmer or Agriculture Officer</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-sky-600">GET</td>
                  <td className="p-2.5 font-mono">/api/crops</td>
                  <td className="p-2.5">Bearer (All)</td>
                  <td className="p-2.5">Farmer crops list with harvest countdown</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-600">POST</td>
                  <td className="p-2.5 font-mono">/api/crops</td>
                  <td className="p-2.5">Farmer</td>
                  <td className="p-2.5">Create crop with irrigation, sowing & harvest</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-sky-600">GET</td>
                  <td className="p-2.5 font-mono">/api/weather</td>
                  <td className="p-2.5">Public</td>
                  <td className="p-2.5">7-Day forecast, rain probability, ag-advisory</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-sky-600">GET</td>
                  <td className="p-2.5 font-mono">/api/market-prices</td>
                  <td className="p-2.5">Public</td>
                  <td className="p-2.5">Daily mandi prices, search, 30-day trends</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-600">POST</td>
                  <td className="p-2.5 font-mono">/api/assistance-requests</td>
                  <td className="p-2.5">Farmer</td>
                  <td className="p-2.5">Raise assistance ticket with photo upload</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-600">PUT</td>
                  <td className="p-2.5 font-mono">/api/assistance-requests/:id/status</td>
                  <td className="p-2.5">Officer / Admin</td>
                  <td className="p-2.5">Update status: Pending, In Progress, Resolved</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-sky-600">GET</td>
                  <td className="p-2.5 font-mono">/api/admin/analytics</td>
                  <td className="p-2.5">Admin</td>
                  <td className="p-2.5">Platform KPI metrics, acreage & resolution rates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Auth Flow */}
      {activeTab === 'auth_flow' && (
        <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-3">
            <h4 className="font-bold text-sm text-stone-900 dark:text-white">Role-Based Access Control (RBAC) Hierarchy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-emerald-600 block mb-1">1. Farmer Role</span>
                <p className="text-stone-600 dark:text-stone-400 text-xs">
                  Access to Farmer Dashboard, crop additions/updates, weather forecast, mandi prices, scheme applications, and raising assistance tickets.
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-sky-600 block mb-1">2. Agriculture Officer</span>
                <p className="text-stone-600 dark:text-stone-400 text-xs">
                  Access to district assistance request queue, diagnosis submission, chemical/biological treatment prescribing, and status progression.
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-purple-600 block mb-1">3. Admin Role</span>
                <p className="text-stone-600 dark:text-stone-400 text-xs">
                  Complete platform analytics, farmer/officer account activation/suspension, publishing government schemes, and system broadcasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Deployment */}
      {activeTab === 'deployment' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono space-y-2">
            <p className="text-emerald-400 font-bold">// 1. CLONE & INSTALL</p>
            <p>git clone https://github.com/agroassist/farmer-assistance-platform.git</p>
            <p>cd farmer-assistance-platform && npm install</p>

            <p className="text-emerald-400 font-bold mt-4">// 2. INITIALIZE MYSQL DATABASE</p>
            <p>mysql -u root -p &lt; src/db/schema.sql</p>
            <p>mysql -u root -p agroassist_db &lt; src/db/queries.sql</p>

            <p className="text-emerald-400 font-bold mt-4">// 3. CONFIGURE ENVIRONMENT (.env)</p>
            <p>PORT=3000</p>
            <p>MYSQL_HOST=localhost</p>
            <p>MYSQL_USER=agro_user</p>
            <p>MYSQL_PASSWORD=strong_password</p>
            <p>MYSQL_DATABASE=agroassist_db</p>
            <p>JWT_SECRET=super_secret_jwt_key_2026</p>

            <p className="text-emerald-400 font-bold mt-4">// 4. BUILD & RUN IN PRODUCTION (PM2 / DOCKER)</p>
            <p>npm run build</p>
            <p>npm run start  # or pm2 start dist/server.cjs --name "agroassist-app"</p>
          </div>
        </div>
      )}
    </Modal>
  );
};
