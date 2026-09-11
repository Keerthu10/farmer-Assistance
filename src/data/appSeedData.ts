import { hashPassword } from '../services/passwordUtils';
import {
  User, FarmerProfile, OfficerProfile, Crop, MarketPrice,
  GovernmentScheme, AssistanceRequest, KnowledgeArticle,
  AppNotification, WeatherData,
} from '../types';

export interface LocalDbShape {
  users: (User & { password_hash: string })[];
  farmers: FarmerProfile[];
  officers: OfficerProfile[];
  crops: Crop[];
  marketPrices: MarketPrice[];
  schemes: GovernmentScheme[];
  assistanceRequests: AssistanceRequest[];
  knowledgeArticles: KnowledgeArticle[];
  notifications: AppNotification[];
}

const generateTrend = (basePrice: number) => {
  const trend = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const variation = Math.round((Math.sin(i * 0.4) * 60) + ((Math.random() - 0.5) * 40));
    trend.push({
      date: d.toISOString().split('T')[0],
      price: Math.max(1200, basePrice + variation),
    });
  }
  return trend;
};

export function createSeedData(): LocalDbShape {
  const defaultPasswordHash = hashPassword('farmer123');
  const officerPasswordHash = hashPassword('officer123');
  const adminPasswordHash = hashPassword('admin123');

  const users: (User & { password_hash: string })[] = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      email: 'farmer@agroassist.gov.in',
      phone: '+91 98765 43210',
      password_hash: defaultPasswordHash,
      role: 'farmer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      district: 'Ludhiana',
      state: 'Punjab',
      village: 'Samrala Kalan',
      created_at: '2026-01-15T08:30:00Z',
    },
    {
      id: 2,
      name: 'Dr. Sunita Sharma',
      email: 'officer@agroassist.gov.in',
      phone: '+91 98112 34567',
      password_hash: officerPasswordHash,
      role: 'officer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      district: 'Ludhiana',
      state: 'Punjab',
      village: 'Agricultural Complex',
      created_at: '2025-11-01T10:00:00Z',
    },
    {
      id: 3,
      name: 'Super Admin Vikramaditya',
      email: 'admin@agroassist.gov.in',
      phone: '+91 94000 88990',
      password_hash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      district: 'New Delhi',
      state: 'Delhi',
      village: 'Krishi Bhawan',
      created_at: '2025-08-10T09:00:00Z',
    },
    {
      id: 4,
      name: 'Baldev Singh',
      email: 'baldev@agroassist.gov.in',
      phone: '+91 98711 22334',
      password_hash: defaultPasswordHash,
      role: 'farmer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
      district: 'Karnal',
      state: 'Haryana',
      village: 'Taraori',
      created_at: '2026-02-01T11:20:00Z',
    },
    {
      id: 5,
      name: 'Anita Sharma (GreenTable Kitchens)',
      email: 'customer@agroassist.gov.in',
      phone: '+91 98765 00099',
      password_hash: hashPassword('customer123'),
      role: 'customer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      district: 'Ludhiana',
      state: 'Punjab',
      village: 'Civil Lines',
      created_at: '2026-02-01T10:00:00Z',
    },
  ];

  const farmers: FarmerProfile[] = [
    {
      id: 1,
      user_id: 1,
      district: 'Ludhiana',
      state: 'Punjab',
      village: 'Samrala Kalan',
      land_area_total: 14.5,
      primary_soil_type: 'Alluvial Loam',
      water_source: 'Canal + Solar Tube Well',
      aadhaar_number_masked: 'XXXX-XXXX-4982',
    },
    {
      id: 2,
      user_id: 4,
      district: 'Karnal',
      state: 'Haryana',
      village: 'Taraori',
      land_area_total: 8.0,
      primary_soil_type: 'Clay Loam',
      water_source: 'Electric Borewell',
      aadhaar_number_masked: 'XXXX-XXXX-8114',
    },
  ];

  const officers: OfficerProfile[] = [
    {
      id: 1,
      user_id: 2,
      department: 'Department of Agriculture & Farmers Welfare',
      designation: 'Senior Block Agricultural Development Officer',
      assigned_district: 'Ludhiana',
      office_contact: '+91 161 2401960',
      specialization: 'Crop Pathology, Pest Mitigation & Integrated Soil Nutrition',
      badge_number: 'PB-AGRI-0492',
    },
  ];

  const crops: Crop[] = [
    {
      id: 1,
      farmer_id: 1,
      farmer_name: 'Ramesh Kumar',
      name: 'Sharbati Durum Wheat',
      type: 'Cereals',
      sowing_date: '2025-11-12',
      expected_harvest_date: '2026-04-18',
      land_area: 6.5,
      irrigation_type: 'Sprinkler',
      crop_status: 'flowering',
      soil_type: 'Alluvial Loam',
      estimated_yield_quintals: 130,
      notes: 'Targeting MSP export quality. Nitrogen split application applied after second irrigation.',
      created_at: '2025-11-12T10:00:00Z',
    },
    {
      id: 2,
      farmer_id: 1,
      farmer_name: 'Ramesh Kumar',
      name: 'Pusa 1121 Basmati Paddy',
      type: 'Cereals',
      sowing_date: '2026-06-25',
      expected_harvest_date: '2026-10-30',
      land_area: 5.0,
      irrigation_type: 'Canal Flood',
      crop_status: 'vegetative',
      soil_type: 'Clay Loam',
      estimated_yield_quintals: 105,
      notes: 'Direct seeded rice (DSR) trial on plot 3 to conserve groundwater.',
      created_at: '2026-06-25T09:15:00Z',
    },
    {
      id: 3,
      farmer_id: 1,
      farmer_name: 'Ramesh Kumar',
      name: 'Pusa Bold Mustard',
      type: 'Oilseeds',
      sowing_date: '2025-10-15',
      expected_harvest_date: '2026-03-20',
      land_area: 3.0,
      irrigation_type: 'Drip Irrigation',
      crop_status: 'harvesting',
      soil_type: 'Sandy Loam',
      estimated_yield_quintals: 48,
      notes: 'Zero-tillage intercropped along boundary rows.',
      created_at: '2025-10-15T08:00:00Z',
    },
    {
      id: 4,
      farmer_id: 4,
      farmer_name: 'Baldev Singh',
      name: 'Hybrid Sugarcane (Co 0238)',
      type: 'Cash Crops',
      sowing_date: '2025-03-10',
      expected_harvest_date: '2026-03-15',
      land_area: 8.0,
      irrigation_type: 'Tube Well',
      crop_status: 'harvesting',
      soil_type: 'Alluvial Soil',
      estimated_yield_quintals: 640,
      notes: 'Cooperative sugar mill contract supply arrangement.',
      created_at: '2025-03-10T12:00:00Z',
    },
  ];

  const marketPrices: MarketPrice[] = [
    {
      id: 1,
      crop_name: 'Wheat (Gehun)',
      variety: 'Sharbati High Grade',
      district: 'Ludhiana',
      market_name: 'Grain Market APMC Khanna',
      min_price: 2425,
      max_price: 2680,
      modal_price: 2550,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: 2.4,
      historical_trends: generateTrend(2550),
    },
    {
      id: 2,
      crop_name: 'Paddy (Dhan)',
      variety: 'Pusa Basmati 1121',
      district: 'Ludhiana',
      market_name: 'Sahnewal Mandi',
      min_price: 3650,
      max_price: 4100,
      modal_price: 3880,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: -1.2,
      historical_trends: generateTrend(3880),
    },
    {
      id: 3,
      crop_name: 'Mustard (Sarson)',
      variety: 'Yellow Mustard High Oil',
      district: 'Ludhiana',
      market_name: 'Jagraon Mandi',
      min_price: 5400,
      max_price: 5850,
      modal_price: 5620,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: 3.8,
      historical_trends: generateTrend(5620),
    },
    {
      id: 4,
      crop_name: 'Cotton (Kapas)',
      variety: 'BT Medium Staple',
      district: 'Bathinda',
      market_name: 'Bathinda Main Yard',
      min_price: 6800,
      max_price: 7450,
      modal_price: 7120,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: 1.5,
      historical_trends: generateTrend(7120),
    },
    {
      id: 5,
      crop_name: 'Soybean',
      variety: 'JS-335 Yellow',
      district: 'Indore',
      market_name: 'Chhawani Anaj Mandi',
      min_price: 4400,
      max_price: 4890,
      modal_price: 4680,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: -0.8,
      historical_trends: generateTrend(4680),
    },
    {
      id: 6,
      crop_name: 'Onion (Pyaaz)',
      variety: 'Nasik Red Medium',
      district: 'Pune',
      market_name: 'Gultekdi APMC',
      min_price: 1850,
      max_price: 2400,
      modal_price: 2150,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: 5.6,
      historical_trends: generateTrend(2150),
    },
    {
      id: 7,
      crop_name: 'Potato (Aloo)',
      variety: 'Kufri Jyoti Jyotish',
      district: 'Jalandhar',
      market_name: 'Maqsudan Sabzi Mandi',
      min_price: 950,
      max_price: 1350,
      modal_price: 1180,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: -3.1,
      historical_trends: generateTrend(1180),
    },
    {
      id: 8,
      crop_name: 'Chickpea (Chana)',
      variety: 'Desi Bold Gram',
      district: 'Jaipur',
      market_name: 'Kukas Krishi Upaj Mandi',
      min_price: 5200,
      max_price: 5650,
      modal_price: 5430,
      unit: '₹/Quintal',
      date: '2026-09-10',
      price_change_percent: 0.9,
      historical_trends: generateTrend(5430),
    },
  ];

  // Government schemes. Both the canonical API field names (title, sponsor,
  // eligibility_criteria, status) and the admin-console alias names
  // (name, ministry, eligibility, is_active) are populated from the same
  // record, since both SchemesPage and AdminPanelPage read this data.
  const schemesBase: { title: string; category: string; description: string; sponsor: string; subsidy_amount_or_percent: string; eligibility_criteria: string[]; benefits: string[]; application_guide: string[]; important_dates: GovernmentScheme['important_dates']; required_documents: string[]; status: 'open' | 'closing_soon' | 'closed'; link_url: string; code: string; }[] = [
    {
      code: 'PM-KISAN-2026',
      title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      category: 'Financial Support',
      description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 to all landholding farmer families across the nation.',
      sponsor: 'Central Government',
      subsidy_amount_or_percent: '₹6,000 / Year (100% Direct Bank Transfer)',
      eligibility_criteria: [
        'All landholding small and marginal farmer families',
        'Valid Aadhaar linked to national bank account',
        'Land ownership records (Khasra/Khatauni) registered with State Revenue Dept',
        'Institutional landholders and income tax payees excluded',
      ],
      benefits: [
        'Unconditional cash transfer for procuring certified seeds and fertilizers',
        'Protects farmers from informal moneylenders',
        'Zero intermediary commission via NPCI Aadhaar bridge',
      ],
      application_guide: [
        'Visit the PM-KISAN Farmers Corner portal or local CSC center',
        'Click on New Farmer Registration and enter 12-digit Aadhaar number',
        'Verify OTP received on Aadhaar registered mobile',
        'Upload land holding documents and submit bank IFSC code',
      ],
      important_dates: {
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        disbursement_date: 'Next installment: 15th October 2026',
      },
      required_documents: [
        'Aadhaar Card',
        'Land Ownership Mutation Copy (Jamabandi / ROR)',
        'Bank Account Passbook (Aadhaar linked)',
        'Mobile Number linked to UIDAI',
      ],
      status: 'open',
      link_url: 'https://pmkisan.gov.in',
    },
    {
      code: 'PMFBY-RABI-26',
      title: 'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
      category: 'Crop Insurance',
      description: 'Comprehensive risk coverage from pre-sowing to post-harvest losses caused by unpreventable natural perils, pests, drought, and cyclonic rains.',
      sponsor: 'Central Government',
      subsidy_amount_or_percent: 'Premium: 1.5% for Rabi, 2% for Kharif, remaining subsidized up to 90%',
      eligibility_criteria: [
        'All farmers cultivating notified crops in notified areas',
        'Both loanee and non-loanee farmers eligible',
        'Sharecroppers and tenant farmers with signed crop agreements eligible',
      ],
      benefits: [
        'Fast claim settlement via satellite crop cutting surveys (CCE)',
        'Prevented sowing and localized calamity coverage within 72 hours',
        'High sum insured matching district average cost of cultivation',
      ],
      application_guide: [
        'Enroll within the cut-off date through National Crop Insurance Portal or Bank',
        'Submit sowing certificate issued by Patwari or Village Agriculture Officer',
        'Pay farmer share of premium (1.5% - 2.0%)',
      ],
      important_dates: {
        start_date: '2026-08-01',
        end_date: '2026-10-31',
        disbursement_date: 'Claims processed within 21 days of survey',
      },
      required_documents: [
        'Sowing Certificate / Declaration',
        'Aadhaar Card & Land Revenue records (Khata / Khasra)',
        'Cancelled Cheque / Bank Passbook',
      ],
      status: 'closing_soon',
      link_url: 'https://pmfby.gov.in',
    },
    {
      code: 'PM-KUSUM-SOLAR',
      title: 'PM-KUSUM Solar Agriculture Pump Scheme',
      category: 'Farm Mechanization',
      description: 'Capital subsidy for standalone off-grid solar agriculture pumps and solarization of existing grid-connected agriculture pumps.',
      sponsor: 'Central Government',
      subsidy_amount_or_percent: 'Up to 60% Subsidy (30% Central + 30% State)',
      eligibility_criteria: [
        'Individual farmers, cooperatives, and Water User Associations (WUAs)',
        'Land with water source suitable for micro-irrigation installation',
        'Farmers currently using expensive diesel pumps given priority',
      ],
      benefits: [
        'Eliminates diesel fuel recurring expenditure',
        'Guaranteed daytime irrigation power for crops',
        'Opportunity to sell surplus solar power back to DISCOM grid',
      ],
      application_guide: [
        'Apply via State Renewable Energy Development Agency (SREDA) portal',
        'Select pump capacity (3 HP, 5 HP, or 7.5 HP) based on water table depth',
        'Pay 10% farmer margin money; 30% loan facilitated by banks',
      ],
      important_dates: {
        start_date: '2026-03-01',
        end_date: '2026-11-30',
        disbursement_date: 'Pump installation within 60 days of allotment',
      },
      required_documents: [
        'Electricity connection noc / Diesel pump affidavit',
        'Land ownership papers',
        'Aadhaar card & Bank proof',
        'Passport photo',
      ],
      status: 'open',
      link_url: 'https://pmkusum.mnre.gov.in',
    },
    {
      code: 'PMKSY-MICRO-IRR',
      title: 'Per Drop More Crop (PDMC - PMKSY)',
      category: 'Irrigation & Infra',
      description: 'Financial assistance for installing micro-irrigation systems (Drip and Sprinkler) to enhance water use efficiency and fertilizer optimization.',
      sponsor: 'Central Government',
      subsidy_amount_or_percent: '55% for Small/Marginal Farmers, 45% for Other Farmers',
      eligibility_criteria: [
        'All categories of farmers with cultivable land holding',
        'Assured water source with pipeline or borewell',
      ],
      benefits: [
        'Saves 40-50% irrigation water while boosting crop yield by 20-30%',
        'Reduces weed infestation and power consumption',
        'Fertigation saves 25% chemical fertilizer cost',
      ],
      application_guide: [
        'Submit application through State Horticulture or Agriculture portal',
        'Field verification by Department Surveyor to measure pipe length and emitters',
        'System supplied and installed by empanelled certified manufacturers',
      ],
      important_dates: {
        start_date: '2026-04-01',
        end_date: '2026-12-15',
      },
      required_documents: [
        'Land 7/12 extract or Jamabandi',
        'Water source availability certificate',
        'Soil and Water test report',
        'Aadhaar card',
      ],
      status: 'open',
      link_url: 'https://pmksy.gov.in',
    },
  ];

  const schemes: GovernmentScheme[] = schemesBase.map((s, idx) => ({
    id: idx + 1,
    code: s.code,
    title: s.title,
    name: s.title,
    category: s.category,
    description: s.description,
    sponsor: s.sponsor,
    ministry: s.sponsor,
    subsidy_amount_or_percent: s.subsidy_amount_or_percent,
    eligibility_criteria: s.eligibility_criteria,
    eligibility: s.eligibility_criteria,
    benefits: s.benefits,
    application_guide: s.application_guide,
    important_dates: s.important_dates,
    required_documents: s.required_documents,
    status: s.status,
    is_active: s.status !== 'closed',
    link_url: s.link_url,
  }));

  const assistanceRequests: AssistanceRequest[] = [
    {
      id: 101,
      farmer_id: 1,
      farmer_name: 'Ramesh Kumar',
      farmer_phone: '+91 98765 43210',
      district: 'Ludhiana',
      crop_id: 1,
      crop_name: 'Sharbati Durum Wheat',
      title: 'Yellow Stripe Rust spotted on upper canopy flag leaves',
      category: 'Disease' as any,
      description: 'Noticed bright yellow pustules arranged in linear stripes on flag leaves across 2 acres. Symptoms spreading rapidly after recent morning fog and humid weather.',
      photo_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      urgency: 'High',
      status: 'In Progress',
      created_at: '2026-09-08T07:45:00Z',
      updated_at: '2026-09-09T10:15:00Z',
      officer_id: 2,
      officer_name: 'Dr. Sunita Sharma',
      responses: [
        {
          id: 1,
          request_id: 101,
          responder_id: 2,
          responder_name: 'Dr. Sunita Sharma',
          responder_role: 'officer',
          message: 'Visual inspection confirms early stage Yellow Stripe Rust (Puccinia striiformis). Because temperature is rising and humidity is high, immediate chemical prophylaxis is needed to protect grain filling.',
          recommended_actions: [
            'Do not delay spray; treat infected patches plus 10m buffer zone',
            'Avoid flood irrigation for the next 4 days to lower canopy humidity',
            'Inspect neighboring fields and report new pustule clusters',
          ],
          chemical_biological_advice: 'Foliar spray with Propiconazole 25% EC (Tilt) @ 200 ml in 200 liters of water per acre. Alternatively use Tebuconazole 25.9% EC @ 200 ml/acre on calm non-windy morning.',
          created_at: '2026-09-09T10:15:00Z',
        },
      ],
    },
    {
      id: 102,
      farmer_id: 1,
      farmer_name: 'Ramesh Kumar',
      farmer_phone: '+91 98765 43210',
      district: 'Ludhiana',
      crop_id: 2,
      crop_name: 'Pusa 1121 Basmati Paddy',
      title: 'Brown Planthopper (BPH) hopperburn warning signs in center plot',
      category: 'Pest Attack',
      description: 'Base of tillers turn brown, plants showing drying patches in circular spots. Observed small brown insects jumping when shaking tiller stems.',
      photo_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      urgency: 'Critical',
      status: 'Resolved',
      created_at: '2026-08-20T14:10:00Z',
      updated_at: '2026-08-22T16:00:00Z',
      officer_id: 2,
      officer_name: 'Dr. Sunita Sharma',
      responses: [
        {
          id: 2,
          request_id: 102,
          responder_id: 2,
          responder_name: 'Dr. Sunita Sharma',
          responder_role: 'officer',
          message: 'Hopperburn confirmed. Immediate drainage of standing water is essential to break microclimate conducive to BPH multiplication.',
          recommended_actions: [
            'Drain standing water from field for 3-4 days (alternate wetting and drying)',
            'Avoid synthetic pyrethroids as they cause BPH resurgence by killing natural spiders',
            'Open up alleyways (30 cm paths every 2-3 meters) for aeration',
          ],
          chemical_biological_advice: 'Spray Pymetrozine 50% WG @ 120 g/acre or Triflumezopyrim 10% SC @ 94 ml/acre directed precisely at the base of the rice plants using hollow cone nozzle.',
          created_at: '2026-08-21T09:30:00Z',
        },
        {
          id: 3,
          request_id: 102,
          responder_id: 1,
          responder_name: 'Ramesh Kumar',
          responder_role: 'farmer',
          message: 'Applied Pymetrozine and drained water as instructed. Pest population collapsed by 90% within 48 hours. Plants recovering vigorously!',
          created_at: '2026-08-22T15:45:00Z',
        },
      ],
    },
    {
      id: 103,
      farmer_id: 4,
      farmer_name: 'Baldev Singh',
      farmer_phone: '+91 98711 22334',
      district: 'Karnal',
      crop_id: 4,
      crop_name: 'Sugarcane (Co 0238)',
      title: 'Drip emitter clogging and low line pressure in block B',
      category: 'Irrigation Issue',
      description: 'Calcium carbonate scaling noticed in inline drippers. Water flow has reduced by nearly 40% across lateral pipes.',
      photo_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      urgency: 'Medium',
      status: 'Pending',
      created_at: '2026-09-09T16:20:00Z',
      updated_at: '2026-09-09T16:20:00Z',
      responses: [],
    },
  ];

  const knowledgeArticlesBase: { title: string; category: string; read_time_mins: number; season: string; target_crop: string; summary: string; content: string; tags: string[]; image_url: string; video_url?: string; author: string; published_date: string; }[] = [
    {
      title: 'Integrated Pest Management (IPM) for High-Yield Basmati Rice',
      category: 'Pest Control',
      read_time_mins: 6,
      season: 'Kharif',
      target_crop: 'Basmati Rice',
      summary: 'Learn how to combine pheromone traps, trichogramma egg parasitoids, and selective green-label bio-pesticides to slash spray costs.',
      content: `Integrated Pest Management (IPM) is an ecosystem-based strategy focusing on long-term prevention of pests through a combination of techniques such as biological control, habitat manipulation, modification of cultural practices, and use of resistant varieties.

Key Pillars for Basmati Rice:
1. Cultural Practices: Maintain proper plant spacing (20 x 15 cm) and create alleyways every 2-3 meters. Alternate wetting and drying (AWD) prevents Brown Planthopper.
2. Mechanical Controls: Install yellow sticky traps (10/acre) for whiteflies/leafhoppers, and bird perches (15/acre) for natural predators.
3. Bio-Agents: Release Trichogramma japonicum parasitized egg cards @ 20,000 eggs/acre against stem borer and leaf folder.
4. Chemical Thresholds: Spray only when Economic Threshold Level (ETL) is breached (e.g., >1 egg mass/sq.m for stem borer).`,
      tags: ['Basmati', 'IPM', 'Pheromone Traps', 'Kharif'],
      image_url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      author: 'Dr. Sunita Sharma, Plant Protection Specialist',
      published_date: '2026-08-15',
    },
    {
      title: 'Drip Fertigation Protocol: Saving 35% Fertilizer with Precise Crop Nutrition',
      category: 'Modern Irrigation',
      read_time_mins: 8,
      season: 'All Seasons',
      target_crop: 'All Crops',
      summary: 'Step-by-step calculation for water-soluble N-P-K dosing via venturi injectors tailored to vegetative and reproductive crop stages.',
      content: `Fertigation delivers soluble plant nutrients through pressurized irrigation directly to the root zone, maximizing fertilizer use efficiency from 35% in broadcasting to over 85%.

Fertigation Schedule Rules:
- Never mix calcium nitrate with sulfate or phosphate fertilizers in the same stock tank.
- Flush lines with clean water for 15 minutes before and after fertigation cycle.
- Maintain solution pH between 5.5 and 6.5 for optimal micronutrient uptake (Zinc, Iron, Boron).`,
      tags: ['Drip Irrigation', 'Fertigation', 'NPK', 'Water Conservation'],
      image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      author: 'Krishi Vigyan Kendra Advisory Board',
      published_date: '2026-07-20',
    },
    {
      title: 'Soil Health Card Interpretation: Correcting Micronutrient Deficiencies',
      category: 'Soil Health',
      read_time_mins: 5,
      season: 'Rabi',
      target_crop: 'Wheat & Mustard',
      summary: 'Understanding soil organic carbon (SOC), electrical conductivity (EC), and how to remediate zinc and sulphur deficiencies.',
      content: `Soil testing is the foundation of precision agriculture. A balanced soil card report evaluates 12 parameters: Macro-nutrients (N, P, K), Secondary-nutrients (S), Micro-nutrients (Zn, Fe, Cu, Mn, Bo), and Physical parameters (pH, EC, OC).

Remediation Guidelines:
- If Organic Carbon < 0.5%: Apply 5-8 tonnes of well-decomposed Farmyard Manure (FYM) or incorporate green manuring (Dhaincha/Sunhemp).
- If Soil pH > 8.5 (Alkaline): Apply agricultural gypsum based on gypsum requirement test.
- Zinc Deficiency: Basal broadcast of Zinc Sulphate Heptahydrate 21% @ 25 kg/acre once every 2 years.`,
      tags: ['Soil Card', 'Micronutrients', 'Zinc', 'Organic Carbon'],
      image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
      author: 'National Soil Survey Bureau',
      published_date: '2026-06-10',
    },
  ];

  const knowledgeArticles: KnowledgeArticle[] = knowledgeArticlesBase.map((a, idx) => ({
    id: idx + 1,
    title: a.title,
    category: a.category,
    read_time_mins: a.read_time_mins,
    read_time_minutes: a.read_time_mins,
    season: a.season,
    target_crop: a.target_crop,
    summary: a.summary,
    content: a.content,
    tags: a.tags,
    image_url: a.image_url,
    video_url: a.video_url,
    author: a.author,
    published_date: a.published_date,
  }));

  const notifications: AppNotification[] = [
    {
      id: 1,
      user_id: 1,
      type: 'weather',
      title: 'Heavy Rain & Thunderstorm Advisory',
      message: 'IMD predicts moderate to heavy showers (35mm) in Ludhiana on Sept 12-13. Postpone urea top dressing and pesticide sprays.',
      is_read: false,
      action_link: '/weather',
      created_at: '2026-09-10T06:00:00Z',
    },
    {
      id: 2,
      user_id: 1,
      type: 'assistance',
      title: 'Officer responded to your Request #101',
      message: 'Dr. Sunita Sharma recommended Propiconazole spray for Yellow Stripe Rust. Review treatment steps.',
      is_read: false,
      action_link: '/assistance',
      created_at: '2026-09-09T10:16:00Z',
    },
    {
      id: 3,
      user_id: 1,
      type: 'market',
      title: 'Mustard Prices Up +3.8% in Khanna Mandi',
      message: 'Modal price touched ₹5,620/Quintal today. Good window for releasing stored produce.',
      is_read: true,
      action_link: '/market',
      created_at: '2026-09-08T12:30:00Z',
    },
    {
      id: 4,
      user_id: 1,
      type: 'scheme',
      title: 'PMFBY Rabi Enrollment Deadline Approaching',
      message: 'Last date for insuring Rabi wheat and mustard crops is Oct 31, 2026. Keep Aadhaar and sowing certificate ready.',
      is_read: false,
      action_link: '/schemes',
      created_at: '2026-09-07T09:00:00Z',
    },
  ];

  return { users, farmers, officers, crops, marketPrices, schemes, assistanceRequests, knowledgeArticles, notifications };
}

const WEATHER_CONDITIONS = [
  { cond: 'Partly Cloudy', rain: 10, min: 22, max: 33, wind: 14, hum: 62 },
  { cond: 'Scattered Showers', rain: 65, min: 21, max: 29, wind: 22, hum: 84 },
  { cond: 'Thunderstorm Expected', rain: 80, min: 20, max: 28, wind: 28, hum: 89 },
  { cond: 'Light Rain', rain: 45, min: 21, max: 30, wind: 18, hum: 78 },
  { cond: 'Sunny & Clear', rain: 5, min: 23, max: 34, wind: 12, hum: 55 },
  { cond: 'Mostly Sunny', rain: 10, min: 24, max: 35, wind: 11, hum: 58 },
  { cond: 'Humid & Overcast', rain: 30, min: 23, max: 32, wind: 15, hum: 70 },
];

export function getWeatherForDistrict(district: string = 'Ludhiana'): WeatherData {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const forecast = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const c = WEATHER_CONDITIONS[i % WEATHER_CONDITIONS.length];
    forecast.push({
      date: d.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : days[d.getDay()]),
      max_temp: c.max,
      min_temp: c.min,
      rain_prob: c.rain,
      humidity: c.hum,
      wind_speed: c.wind,
      condition: c.cond,
      icon: c.rain > 50 ? 'rain' : (c.rain > 20 ? 'cloud-rain' : 'sun'),
    });
  }

  return {
    district: district || 'Ludhiana',
    state: 'Punjab',
    temperature: 31.4,
    humidity: 68,
    wind_speed: 16.5,
    rain_prediction: 25,
    condition: 'Partly Cloudy with Humid Breeze',
    uv_index: 6.8,
    air_quality: 'Moderate (AQI 85)',
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    forecast,
    agri_advisory: 'Suitable conditions for weeding and hoeing in standing crops. Avoid heavy chemical foliar sprays tomorrow afternoon due to predicted wind gusts and 65% chance of localized showers.',
  };
}
