export type UserRole = 'farmer' | 'customer' | 'officer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  avatar?: string;
  district?: string;
  state?: string;
  village?: string;
  created_at: string;
}

export interface FarmerProfile {
  id: number;
  user_id: number;
  district: string;
  state: string;
  village: string;
  land_area_total: number; // in acres
  primary_soil_type: string;
  water_source: string;
  aadhaar_number_masked?: string;
}

export interface OfficerProfile {
  id: number;
  user_id: number;
  department: string;
  designation: string;
  assigned_district: string;
  office_contact: string;
  specialization: string;
  badge_number: string;
}

export type CropStatus = 'planted' | 'vegetative' | 'flowering' | 'harvesting' | 'completed';
export type IrrigationType = 'Drip Irrigation' | 'Sprinkler' | 'Canal Flood' | 'Tube Well' | 'Rainfed';
export type CropType = 'Cereals' | 'Pulses' | 'Cash Crops' | 'Vegetables' | 'Oilseeds' | 'Horticulture';

export interface Crop {
  id: number;
  farmer_id: number;
  farmer_name?: string;
  name: string;
  type: CropType;
  sowing_date: string;
  expected_harvest_date: string;
  land_area: number; // in acres
  irrigation_type: IrrigationType;
  crop_status: CropStatus;
  soil_type?: string;
  estimated_yield_quintals?: number;
  notes?: string;
  created_at: string;
}

export interface DailyForecast {
  date: string;
  day: string;
  max_temp: number;
  min_temp: number;
  rain_prob: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  district: string;
  state: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  rain_prediction: number; // percentage
  condition: string;
  uv_index: number;
  air_quality: string;
  last_updated: string;
  forecast: DailyForecast[];
  agri_advisory: string;
}

export interface MarketPrice {
  id: number;
  crop_name: string;
  variety: string;
  district: string;
  market_name: string;
  min_price: number;
  max_price: number;
  modal_price: number; // ₹ per Quintal
  unit: string;
  date: string;
  price_change_percent: number;
  historical_trends?: { date: string; price: number }[];
}

export interface GovernmentScheme {
  id: number;
  title: string;
  name?: string;
  code?: string;
  category: string;
  description: string;
  sponsor?: string;
  ministry?: string;
  subsidy_amount_or_percent?: string;
  eligibility_criteria?: string[];
  eligibility?: string[];
  benefits: any;
  application_guide?: string[] | string;
  application_process?: string;
  important_dates?: {
    start_date: string;
    end_date: string;
    disbursement_date?: string;
  };
  required_documents: string[];
  status?: 'open' | 'closing_soon' | 'closed';
  is_active?: boolean;
  link_url?: string;
}

export type Scheme = GovernmentScheme;

export type AssistanceCategory = 
  | 'Pest Attack'
  | 'Disease'
  | 'Irrigation Issue'
  | 'Fertilizer Issue'
  | 'Soil Issue'
  | 'Other';

export type AssistanceStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
export type AssistanceUrgency = 'Low' | 'Medium' | 'High' | 'Critical';
export type UrgencyLevel = AssistanceUrgency;

export interface AssistanceResponse {
  id: number;
  request_id: number;
  responder_id: number;
  responder_name: string;
  responder_role: UserRole;
  message: string;
  recommended_actions?: string[];
  chemical_biological_advice?: string;
  created_at: string;
}

export interface AssistanceRequest {
  id: number;
  farmer_id: number;
  farmer_name: string;
  farmer_phone: string;
  district: string;
  crop_id?: number;
  crop_name: string;
  title: string;
  category: AssistanceCategory;
  description: string;
  photo_url?: string;
  urgency: AssistanceUrgency;
  status: AssistanceStatus;
  created_at: string;
  updated_at: string;
  officer_id?: number;
  officer_name?: string;
  responses?: AssistanceResponse[];
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  read_time_mins?: number;
  read_time_minutes?: number;
  season?: string;
  target_crop?: string;
  summary: string;
  content: string;
  tags: string[];
  image_url: string;
  video_url?: string;
  author: string;
  published_date: string;
}

export type NotificationType = 'weather' | 'market' | 'scheme' | 'assistance' | 'system';

export interface AppNotification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_link?: string;
  created_at: string;
}

export interface AdminAnalytics {
  total_farmers: number;
  total_officers: number;
  total_crops: number;
  total_acreage: number;
  pending_requests: number;
  in_progress_requests: number;
  resolved_requests: number;
  resolution_rate_percent: number;
  crops_by_status: { status: string; count: number }[];
  requests_by_category: { category: string; count: number }[];
  crops_by_type: { type: string; count: number }[];
}

export interface RegionConfig {
  id: string;
  name: string;
  country: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  landUnit: string;
  tempUnit: '°C' | '°F';
  weightUnit: string;
  rainfallUnit: 'mm' | 'inches';
  defaultDistrict: string;
  defaultState: string;
  districts: string[];
  climateZone: string;
  helplineName: string;
  helplineContact: string;
  helpline?: {
    name: string;
    contact: string;
  };
  supportedCrops: string[];
  farmingSeasons: { name: string; period: string; focus: string }[];
  idTypeLabel: string;
  idTypePlaceholder: string;
}

export interface CropPreset {
  name: string;
  type: CropType;
  scientificName: string;
  growthDays: number;
  optimalSoil: string;
  irrigationMethod: IrrigationType;
  expectedYieldValue: number;
  yieldUnit: string;
  waterRequirement: string;
  criticalStages: string[];
  keyPestsAndDiseases: string[];
  tips: string;
}

export interface FarmingRecommendation {
  id: string;
  crop: string;
  regionId: string;
  category: 'Sowing & Land Prep' | 'Irrigation Schedule' | 'Fertilizer & Nutrition' | 'Pest & Disease Control' | 'Harvesting & Post-Harvest';
  title: string;
  stage: CropStatus | 'All Stages';
  urgency: 'routine' | 'recommended' | 'critical';
  description: string;
  actionItems: string[];
  scientificRationale: string;
  organicAlternative?: string;
  weatherTrigger?: string;
}

// ==========================================
// FARM-TO-CUSTOMER MARKETPLACE ECOSYSTEM TYPES
// ==========================================

export type BuyerType = 'Individual' | 'Restaurant' | 'Supermarket' | 'Wholesaler' | 'Exporter';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Escrow Held' | 'Released to Farmer' | 'Refunded' | 'Pending';

export interface FarmLocation {
  village: string;
  district: string;
  state: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface FarmProfile {
  id: number;
  user_id: number;
  farm_name: string;
  farmer_name: string;
  avatar: string;
  district: string;
  state: string;
  country: string;
  village: string;
  land_area_total: number; // in acres or hectares
  primary_soil_type: string;
  water_source: string;
  is_verified: boolean;
  organic_certified: boolean;
  certifying_agency?: string;
  rating: number;
  total_reviews: number;
  contact_phone: string;
  bio?: string;
  established_year: number;
  featured_crops: string[];
}

export type ProduceCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Cereals' 
  | 'Pulses' 
  | 'Cash Crops' 
  | 'Oilseeds' 
  | 'Herbs & Spices' 
  | 'Dairy & Honey';

export interface MarketplaceProduct {
  id: number;
  farmer_id: number;
  farm_name: string;
  farmer_name: string;
  farmer_avatar: string;
  farmer_verified: boolean;
  name: string;
  scientific_name?: string;
  crop_category: ProduceCategory;
  quantity_available: number;
  unit: 'kg' | 'quintal' | 'crate (20kg)' | 'bag (50kg)' | 'bushel';
  price_per_unit: number;
  mandi_benchmark_price: number; // wholesale benchmark to show transparency
  retail_supermarket_price: number; // consumer supermarket price for savings calculation
  harvest_date: string;
  freshness_label: string; // e.g. "Harvested 4 hours ago", "Freshly Picked Today"
  is_organic: boolean;
  organic_cert_name?: string;
  farm_location: FarmLocation;
  image_url: string;
  shelf_life_days: number;
  min_order_qty: number;
  batch_number: string;
  soil_type: string;
  water_source: string;
  delivery_estimate_days: number;
  description: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  created_at: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
  selectedUnit: string;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  farmer_id: number;
  farm_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
  image_url: string;
}

export interface DeliveryTimelineStep {
  step: string;
  timestamp: string;
  completed: boolean;
  note?: string;
}

export interface MarketplaceOrder {
  id: number;
  order_code: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  buyer_type: BuyerType;
  delivery_address: {
    street: string;
    district: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  farmer_ids: number[];
  subtotal: number;
  delivery_fee: number;
  direct_farmer_savings: number; // savings vs retail middleman
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'UPI' | 'Direct Card' | 'Escrow Bank Transfer' | 'Cash on Delivery';
  harvest_date: string;
  estimated_delivery: string;
  delivered_at?: string;
  tracking_steps: DeliveryTimelineStep[];
  has_reviewed?: boolean;
  dispute_status?: 'None' | 'Raised' | 'Investigating' | 'Resolved';
  created_at: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  order_id: number;
  customer_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  buyer_type: BuyerType;
  created_at: string;
}

export interface MarketplaceDispute {
  id: number;
  order_id: number;
  order_code: string;
  customer_id: number;
  customer_name: string;
  farmer_id: number;
  farm_name: string;
  reason: string;
  status: 'Open' | 'Under Mediation' | 'Refunded' | 'Dismissed';
  amount: number;
  resolution_notes?: string;
  created_at: string;
}

// AI Agronomy Features Types
export interface YieldPredictionInput {
  crop_name: string;
  acreage: number;
  soil_type: string;
  irrigation_type: string;
  fertilizer_plan: string;
  region: string;
}

export interface YieldPredictionResult {
  predicted_yield_min: number;
  predicted_yield_max: number;
  unit: string;
  confidence_score: number;
  optimal_harvest_window: string;
  projected_revenue_direct: number;
  projected_revenue_mandi: number;
  revenue_gain_percent: number;
  key_risk_factors: string[];
  agronomic_recommendations: string[];
}

export interface MarketDemandTrend {
  crop_name: string;
  category: ProduceCategory;
  demand_level: 'Very High' | 'High' | 'Moderate' | 'Stable';
  trend_direction: 'up' | 'stable' | 'down';
  growth_rate_percent: number;
  buyer_interest: string[]; // e.g. ["Organic Supermarkets", "Farm-to-Table Restaurants"]
  average_price_gain: string;
}

export interface DiseaseDiagnosisResult {
  disease_name: string;
  pathogen: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence_percentage: number;
  affected_parts: string[];
  organic_treatment: string;
  biological_control: string;
  chemical_prescription?: string;
  prevention_tips: string[];
}

