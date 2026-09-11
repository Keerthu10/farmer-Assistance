export interface CropRecommendationItem {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereals' | 'Pulses' | 'Cash Crops' | 'Vegetables' | 'Fruits' | 'Oilseeds' | 'Horticulture';
  suitableSeason: string;
  waterNeeds: 'Low' | 'Medium' | 'High' | 'Very High';
  growthDurationDays: number;
  avgYield: string;
  economicImportance: string;
  keyNutrientRequirements: string;
  commonPestAlerts: string[];
  irrigationMethod: string;
  optimalSoil: string;
  icon: string;
}

export interface SeasonalSuggestion {
  seasonName: string;
  period: string;
  activityFocus: string;
  keyActionItems: string[];
  climateNote: string;
}

export interface DistrictRegionData {
  id: string;
  name: string;
  soilTypes: string[];
  primaryWaterSource: string;
  climateSummary: string;
  helpline: {
    name: string;
    contact: string;
  };
  recommendedCrops: CropRecommendationItem[];
  seasonalSuggestions: SeasonalSuggestion[];
  regionalFarmingTips: string[];
}

export interface StateProvinceData {
  id: string;
  name: string;
  climateZone: string;
  districts: DistrictRegionData[];
}

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  landUnit: 'Acres' | 'Hectares';
  tempUnit: '°C' | '°F';
  weightUnit: string;
  rainfallUnit: 'mm' | 'inches';
  idTypeLabel: string;
  idTypePlaceholder: string;
  states: StateProvinceData[];
}

export const GLOBAL_AGRICULTURE_DATA: CountryData[] = [
  // 1. INDIA
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
    landUnit: 'Acres',
    tempUnit: '°C',
    weightUnit: 'Quintal (100kg)',
    rainfallUnit: 'mm',
    idTypeLabel: 'Aadhaar / Farmer ID',
    idTypePlaceholder: 'XXXX-XXXX-XXXX',
    states: [
      {
        id: 'TN',
        name: 'Tamil Nadu',
        climateZone: 'Tropical Coastal & Semi-Arid Deltaic',
        districts: [
          {
            id: 'TN-CBE',
            name: 'Coimbatore & Western Plains',
            soilTypes: ['Red Sandy Loam', 'Black Soil', 'Clay Loam'],
            primaryWaterSource: 'Bhavani & Noyyal Basins / Drip Tube Wells',
            climateSummary: 'Equable tropical climate, shielded by the Western Ghats with mild winters.',
            helpline: {
              name: 'TNAU Kisan Helpline (Coimbatore)',
              contact: '1800-425-1661',
            },
            recommendedCrops: [
              {
                id: 'cbe-paddy',
                name: 'Paddy (Rice)',
                scientificName: 'Oryza sativa',
                category: 'Cereals',
                suitableSeason: 'Kuruvai (June–Sep) & Samba (Aug–Jan)',
                waterNeeds: 'Very High',
                growthDurationDays: 125,
                avgYield: '28 – 35 Quintals / Acre',
                economicImportance: 'Primary staple crop under the minimum support price (MSP) program.',
                keyNutrientRequirements: 'NPK 120:40:40 kg/ha with Zinc Sulfate basal dressing.',
                commonPestAlerts: ['Brown Plant Hopper (BPH)', 'Yellow Stem Borer', 'Bacterial Leaf Blight'],
                irrigationMethod: 'Alternate Wetting & Drying (AWD)',
                optimalSoil: 'Clay Loam & Alluvial',
                icon: '🌾',
              },
              {
                id: 'cbe-sugarcane',
                name: 'Sugarcane',
                scientificName: 'Saccharum officinarum',
                category: 'Cash Crops',
                suitableSeason: 'Main Season (Dec–March Planting)',
                waterNeeds: 'High',
                growthDurationDays: 360,
                avgYield: '45 – 60 Tons / Acre',
                economicImportance: 'Key sugar mill supplier and bio-ethanol feedstock.',
                keyNutrientRequirements: 'High nitrogen splits (275 kg N/ha) with potash supplements.',
                commonPestAlerts: ['Early Shoot Borer', 'Woolly Aphid', 'Red Rot'],
                irrigationMethod: 'Sub-surface Drip Irrigation',
                optimalSoil: 'Deep Well-Drained Red Loam',
                icon: '🎋',
              },
              {
                id: 'cbe-banana',
                name: 'Banana (G9 / Robusta / Nendran)',
                scientificName: 'Musa acuminata',
                category: 'Fruits',
                suitableSeason: 'Year-Round (Best Feb–April)',
                waterNeeds: 'High',
                growthDurationDays: 330,
                avgYield: '30 – 40 Tons / Acre',
                economicImportance: 'High commercial cash flow for daily farm wholesale markets.',
                keyNutrientRequirements: 'Heavy Potassium (K) feeder at shooting and finger filling.',
                commonPestAlerts: ['Sigatoka Leaf Spot', 'Pseudostem Weevil', 'Panama Wilt'],
                irrigationMethod: 'Micro-sprinklers & Drip fertigation',
                optimalSoil: 'Fertile Sandy Clay Loam (pH 6.5–7.5)',
                icon: '🍌',
              },
              {
                id: 'cbe-coconut',
                name: 'Coconut',
                scientificName: 'Cocos nucifera',
                category: 'Cash Crops',
                suitableSeason: 'Perennial Plantation',
                waterNeeds: 'Medium',
                growthDurationDays: 365,
                avgYield: '12,000 – 16,000 Nuts / Acre / Year',
                economicImportance: 'Core oilseed, tender water, and coir fiber export industry.',
                keyNutrientRequirements: 'Boron, Magnesium sulfate, and organic farmyard manure basins.',
                commonPestAlerts: ['Rhinoceros Beetle', 'Red Palm Weevil', 'Rugose Spiralling Whitefly'],
                irrigationMethod: 'Basin Drip Bubbler Systems',
                optimalSoil: 'Coastal Alluvium & Well-Drained Red Loams',
                icon: '🥥',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Kuruvai (Early Kharif)',
                period: 'June – September',
                activityFocus: 'Short-duration paddy varieties (ADT 43, TPS 5) and inter-cropped pulses.',
                keyActionItems: [
                  'Complete field puddling and level plots before canal release',
                  'Adopt System of Rice Intensification (SRI) spacing (25x25cm) to save 30% water',
                  'Seed treatment with Azospirillum and Phosphobacteria biofertilizers',
                ],
                climateNote: 'Southwest monsoon brings moderate showers; monitor humidity in canopy.',
              },
              {
                seasonName: 'Samba / Thaladi',
                period: 'August – January',
                activityFocus: 'Long-duration flood-tolerant Paddy (CR 1009 Sub 1) and Sugarcane earthing-up.',
                keyActionItems: [
                  'Prophylactic foliar spray of Pseudomonas fluorescens against blast',
                  'Apply split dose of muriate of potash before panicle initiation',
                  'Ensure deep drainage channels ahead of Northeast monsoon peak',
                ],
                climateNote: 'Northeast monsoon is active with intense spells; clear field drains.',
              },
            ],
            regionalFarmingTips: [
              'Integrate drip fertigation with solar pumps to access the 70% state subsidy',
              'Use pheromone traps (5/acre) for early yellow stem borer detection',
              'Perform mandatory soil testing before rabi sowing to optimize urea application',
            ],
          },
          {
            id: 'TN-TJ',
            name: 'Thanjavur & Cauvery Delta',
            soilTypes: ['Deep Cauvery Alluvium', 'Clay Loam'],
            primaryWaterSource: 'Cauvery Canal Network & Grand Anicut',
            climateSummary: 'Humid maritime delta with high water table and fertile silt beds.',
            helpline: {
              name: 'Cauvery Delta Farmer Extension Desk',
              contact: '04362-230142',
            },
            recommendedCrops: [
              {
                id: 'tj-paddy',
                name: 'Paddy (Kuruvai / Samba)',
                scientificName: 'Oryza sativa',
                category: 'Cereals',
                suitableSeason: 'June–Oct (Kuruvai), Oct–Jan (Samba)',
                waterNeeds: 'Very High',
                growthDurationDays: 135,
                avgYield: '32 – 38 Quintals / Acre',
                economicImportance: 'Known as the Rice Bowl of Tamil Nadu.',
                keyNutrientRequirements: 'Silt enriched; split application of urea coated with neem.',
                commonPestAlerts: ['Bacterial Leaf Streak', 'Gall Midge', 'False Smut'],
                irrigationMethod: 'Canal Flooding with AWD gates',
                optimalSoil: 'Heavy Alluvial Clay',
                icon: '🌾',
              },
              {
                id: 'tj-coconut',
                name: 'Coconut Groves',
                scientificName: 'Cocos nucifera',
                category: 'Cash Crops',
                suitableSeason: 'Perennial',
                waterNeeds: 'Medium',
                growthDurationDays: 365,
                avgYield: '14,000 Nuts / Acre / Year',
                economicImportance: 'Continuous copra and coir manufacturing economy.',
                keyNutrientRequirements: 'Basin mulching with green manure (Crotalaria juncea).',
                commonPestAlerts: ['Tanjore Wilt (Ganoderma)', 'Rhinoceros Beetle'],
                irrigationMethod: 'Canal Seepage & Drip Ring',
                optimalSoil: 'Delta Alluvial Sand Loam',
                icon: '🥥',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Samba Season',
                period: 'August – January',
                activityFocus: 'Main cropping cycle across 500,000 delta acres.',
                keyActionItems: [
                  'Direct seeded rice (DSR) using seed drills to advance harvest window',
                  'Incorporate zinc sulfate (25kg/ha) during basal ploughing',
                  'Spray 1% potassium chloride in case of moisture stress during dry spells',
                ],
                climateNote: 'High risk of cyclonic rainfall in October–November.',
              },
            ],
            regionalFarmingTips: [
              'Broadcast black gram seeds directly into standing paddy 7 days before harvest (Rice-Fallow Pulses)',
              'Install Trichogramma cards for biological stem borer eradication',
            ],
          },
        ],
      },
      {
        id: 'PB',
        name: 'Punjab',
        climateZone: 'Sub-Tropical Semi-Arid & Continental',
        districts: [
          {
            id: 'PB-LDH',
            name: 'Ludhiana & Central Plains',
            soilTypes: ['Alluvial Loam', 'Sandy Loam', 'Clayey Silt'],
            primaryWaterSource: 'Bhakra Canal System & Deep Submersible Tube Wells',
            climateSummary: 'Hot dry summers and cold, fog-prone winters ideal for rabi wheat.',
            helpline: {
              name: 'PAU Kisan Call Desk (Ludhiana)',
              contact: '0161-2401960',
            },
            recommendedCrops: [
              {
                id: 'ldh-wheat',
                name: 'Wheat (HD 3086 / PBW 824)',
                scientificName: 'Triticum aestivum',
                category: 'Cereals',
                suitableSeason: 'Rabi (November – April)',
                waterNeeds: 'Medium',
                growthDurationDays: 145,
                avgYield: '22 – 26 Quintals / Acre',
                economicImportance: 'National grain reserve pillar and central procurement leader.',
                keyNutrientRequirements: 'NPK 120:60:40 kg/ha with Zinc foliar spray at crown root stage.',
                commonPestAlerts: ['Yellow Rust (Puccinia striiformis)', 'Aphids', 'Termites'],
                irrigationMethod: 'Furrow / High-efficiency Sprinkler',
                optimalSoil: 'Deep Alluvial Fertile Loam',
                icon: '🌾',
              },
              {
                id: 'ldh-rice',
                name: 'Basmati & PR Paddy',
                scientificName: 'Oryza sativa',
                category: 'Cereals',
                suitableSeason: 'Kharif (June – October)',
                waterNeeds: 'Very High',
                growthDurationDays: 130,
                avgYield: '25 – 30 Quintals / Acre',
                economicImportance: 'High export premium Basmati varieties (Pusa 1121, 1509).',
                keyNutrientRequirements: 'Green manuring with Dhaincha followed by balanced NPK.',
                commonPestAlerts: ['Leaf Folder', 'Bacterial Blight', 'Sheath Rot'],
                irrigationMethod: 'Laser Leveled Flood with AWD',
                optimalSoil: 'Heavy Clay Loam',
                icon: '🍚',
              },
              {
                id: 'ldh-cotton',
                name: 'Bt Cotton',
                scientificName: 'Gossypium hirsutum',
                category: 'Cash Crops',
                suitableSeason: 'Kharif (May – November)',
                waterNeeds: 'Medium',
                growthDurationDays: 170,
                avgYield: '10 – 14 Quintals / Acre',
                economicImportance: 'Raw lint supply for spinning mills and cottonseed oil cake.',
                keyNutrientRequirements: 'Potassium nitrate foliar sprays during boll development.',
                commonPestAlerts: ['Pink Bollworm', 'Whitefly', 'Cotton Leaf Curl Virus (CLCuV)'],
                irrigationMethod: 'Drip & Alternate Furrow',
                optimalSoil: 'Deep Sandy Loam',
                icon: '☁️',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Rabi Sowing Window',
                period: 'October – April',
                activityFocus: 'Timely wheat sowing using Happy Seeder without residue burning.',
                keyActionItems: [
                  'Use Super Seeder or Happy Seeder directly into paddy stubble',
                  'First irrigation strictly at 21 days (Crown Root Initiation stage)',
                  'Monitor weekly for yellow rust pustules on lower leaves in foggy mornings',
                ],
                climateNote: 'Cold wave and dense fog in Dec–Jan; watch for frost damage.',
              },
            ],
            regionalFarmingTips: [
              'Zero-tillage wheat sowing saves ₹2,500/acre in diesel and retains soil moisture',
              'Adopt PAU Tensio-meter for paddy irrigation to prevent groundwater depletion',
            ],
          },
        ],
      },
      {
        id: 'MH',
        name: 'Maharashtra',
        climateZone: 'Tropical Wet & Dry / Semi-Arid Deccan',
        districts: [
          {
            id: 'MH-PUN',
            name: 'Pune & Western Maharashtra',
            soilTypes: ['Black Regur Cotton Soil', 'Medium Black Loam'],
            primaryWaterSource: 'Canals & Drip Fed Farm Ponds',
            climateSummary: 'Mild climate suitable for commercial horticulture and sugarcane.',
            helpline: {
              name: 'MPKV Agricultural Extension (Rahuri/Pune)',
              contact: '1800-233-4000',
            },
            recommendedCrops: [
              {
                id: 'pun-sugarcane',
                name: 'Sugarcane (Co 86032)',
                scientificName: 'Saccharum officinarum',
                category: 'Cash Crops',
                suitableSeason: 'Adsali (July) / Suru (Jan–Feb)',
                waterNeeds: 'High',
                growthDurationDays: 360,
                avgYield: '50 – 70 Tons / Acre',
                economicImportance: 'Supplies high-efficiency cooperative sugar mills.',
                keyNutrientRequirements: 'Heavy vermicompost and split bio-fertilizer dosing.',
                commonPestAlerts: ['White Grub', 'Scale Insect', 'Pokkah Boeng'],
                irrigationMethod: 'Automated Drip Irrigation',
                optimalSoil: 'Deep Black Regur Soil',
                icon: '🎋',
              },
              {
                id: 'pun-soybean',
                name: 'Soybean',
                scientificName: 'Glycine max',
                category: 'Oilseeds',
                suitableSeason: 'Kharif (June – October)',
                waterNeeds: 'Medium',
                growthDurationDays: 100,
                avgYield: '10 – 14 Quintals / Acre',
                economicImportance: 'Core edible oilseed and high-protein de-oiled cake.',
                keyNutrientRequirements: 'Rhizobium seed inoculation with single super phosphate (SSP).',
                commonPestAlerts: ['Girdle Beetle', 'Spodoptera caterpillar', 'Yellow Mosaic'],
                irrigationMethod: 'Rainfed with protective sprinkler',
                optimalSoil: 'Medium to Heavy Black Loam',
                icon: '🌱',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Kharif Monsoonal',
                period: 'June – October',
                activityFocus: 'Soybean, Cotton, and Pulses planting on Broad Bed Furrow (BBF).',
                keyActionItems: [
                  'Use Broad Bed Furrow seeders for moisture conservation and drainage',
                  'Inoculate seeds with Trichoderma viride against root rot',
                ],
                climateNote: 'Southwest monsoon active; manage runoff via farm ponds.',
              },
            ],
            regionalFarmingTips: [
              'Install drip automation with moisture sensors to save 45% water in sugarcane',
              'Intercrop soybean with pigeon pea (arhar) at 4:2 ratio for risk diversification',
            ],
          },
        ],
      },
    ],
  },

  // 2. UNITED STATES
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    landUnit: 'Acres',
    tempUnit: '°F',
    weightUnit: 'Bushels / Cwt',
    rainfallUnit: 'inches',
    idTypeLabel: 'USDA Farm / Ranch ID',
    idTypePlaceholder: 'FSA-XXXX-XXXX',
    states: [
      {
        id: 'IA',
        name: 'Iowa',
        climateZone: 'Humid Continental / Corn Belt Core',
        districts: [
          {
            id: 'IA-DSM',
            name: 'Des Moines & Central Iowa',
            soilTypes: ['Clarion-Nicollet-Webster Mollisols', 'Deep Organic Loam'],
            primaryWaterSource: 'Natural Rainfall & Tile Drainage Systems',
            climateSummary: 'Rich glacial till, warm humid summers, and deep freeze winters.',
            helpline: {
              name: 'Iowa State University Extension & Outreach',
              contact: '1-800-262-3804',
            },
            recommendedCrops: [
              {
                id: 'ia-corn',
                name: 'Field Corn (Maize)',
                scientificName: 'Zea mays',
                category: 'Cereals',
                suitableSeason: 'Spring Planting (April – October)',
                waterNeeds: 'Medium',
                growthDurationDays: 110,
                avgYield: '190 – 225 Bushels / Acre',
                economicImportance: 'Global leader in grain export, livestock feed, and ethanol fuel.',
                keyNutrientRequirements: 'Variable rate anhydrous ammonia nitrogen with potash.',
                commonPestAlerts: ['Corn Rootworm', 'Tar Spot', 'European Corn Borer'],
                irrigationMethod: 'Predominantly Rainfed with Pattern Tile Drainage',
                optimalSoil: 'Rich Prairie Mollisols (High Organic Matter 4–6%)',
                icon: '🌽',
              },
              {
                id: 'ia-soybean',
                name: 'Soybean',
                scientificName: 'Glycine max',
                category: 'Oilseeds',
                suitableSeason: 'Spring Planting (May – October)',
                waterNeeds: 'Medium',
                growthDurationDays: 115,
                avgYield: '55 – 65 Bushels / Acre',
                economicImportance: 'Essential rotation partner with corn; huge export market.',
                keyNutrientRequirements: 'Symbiotic nitrogen fixation; apply Phosphorus and Potassium.',
                commonPestAlerts: ['Soybean Cyst Nematode (SCN)', 'Sudden Death Syndrome (SDS)', 'Aphids'],
                irrigationMethod: 'Rainfed Tile Controlled',
                optimalSoil: 'Well-drained Silty Clay Loam',
                icon: '🌱',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Spring Planting Campaign',
                period: 'April – June',
                activityFocus: 'Soil temperature monitoring (>50°F) for rapid corn and bean emergence.',
                keyActionItems: [
                  'Calibrate air planters for precision seed singulation and depth (1.75–2 inches)',
                  'Apply pre-emergence residual herbicide for waterhemp management',
                  'Inspect field tile outlets for proper spring drainage flow',
                ],
                climateNote: 'Spring rains can delay field operations; avoid planting into wet soils.',
              },
            ],
            regionalFarmingTips: [
              'Plant winter rye cover crops after harvest to prevent soil erosion and retain nitrate',
              'Utilize SCN-resistant varieties (Peking or PI 88788) on rotating plots',
            ],
          },
        ],
      },
      {
        id: 'CA',
        name: 'California',
        climateZone: 'Mediterranean / Central Valley Arid',
        districts: [
          {
            id: 'CA-FRS',
            name: 'Fresno & San Joaquin Valley',
            soilTypes: ['Alluvial Loam', 'Fine Sandy Loam'],
            primaryWaterSource: 'Central Valley Project Canals & Deep Aquifers',
            climateSummary: 'Hot dry summers and mild winters; world capital of specialty fruit and nut crops.',
            helpline: {
              name: 'UC Cooperative Extension (Fresno)',
              contact: '1-559-241-7515',
            },
            recommendedCrops: [
              {
                id: 'ca-almond',
                name: 'Almonds',
                scientificName: 'Prunus dulcis',
                category: 'Fruits',
                suitableSeason: 'Perennial Orchard',
                waterNeeds: 'High',
                growthDurationDays: 240,
                avgYield: '2,200 – 2,800 lbs / Acre',
                economicImportance: 'Accounts for over 80% of the world’s commercial almond supply.',
                keyNutrientRequirements: 'Precision nitrogen injection via micro-drip with Zinc and Boron foliar.',
                commonPestAlerts: ['Navel Orangeworm', 'Hull Rot', 'Spider Mites'],
                irrigationMethod: 'Subsurface Precision Drip & Micro-Sprinklers',
                optimalSoil: 'Deep Well-Drained Sandy Loam',
                icon: '🌰',
              },
              {
                id: 'ca-tomato',
                name: 'Processing Tomatoes',
                scientificName: 'Solanum lycopersicum',
                category: 'Vegetables',
                suitableSeason: 'March – August',
                waterNeeds: 'Medium',
                growthDurationDays: 120,
                avgYield: '45 – 55 Tons / Acre',
                economicImportance: 'High brix content for global paste and canning industries.',
                keyNutrientRequirements: 'High Potassium (K) at fruit sizing to enhance solids.',
                commonPestAlerts: ['Fusarium Wilt', 'Tomato Hornworm', 'Powdery Mildew'],
                irrigationMethod: 'Buried Drip Tape Fertigation',
                optimalSoil: 'Fine Silty Loam',
                icon: '🍅',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Bloom & Pollination Period',
                period: 'February – March',
                activityFocus: 'Honeybee colony placement and fungicide bloom sprays.',
                keyActionItems: [
                  'Place 2 to 2.5 honeybee hives per acre for maximum cross-pollination',
                  'Spray prophylactic fungicides ahead of spring shower forecasts',
                ],
                climateNote: 'Mild sunny days promote flight activity; protect against late frost.',
              },
            ],
            regionalFarmingTips: [
              'Perform winter sanitation (mummy nut removal) to destroy navel orangeworm over-wintering habitat',
              'Track pressure bomb stem water potential readings before scheduling irrigation pulses',
            ],
          },
        ],
      },
    ],
  },

  // 3. AUSTRALIA
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    landUnit: 'Hectares',
    tempUnit: '°C',
    weightUnit: 'Metric Tonnes',
    rainfallUnit: 'mm',
    idTypeLabel: 'National Grower ID (NGR)',
    idTypePlaceholder: 'NGR-XXXX-XXXX',
    states: [
      {
        id: 'VIC',
        name: 'Victoria',
        climateZone: 'Temperate / Mediterranean Wimmera & Mallee',
        districts: [
          {
            id: 'VIC-WIM',
            name: 'Wimmera & Mallee Grain Belt',
            soilTypes: ['Self-Mulching Cracking Clays (Vertosols)', 'Calcarosols'],
            primaryWaterSource: 'Winter Rainfall (Dryland broadacre farming)',
            climateSummary: 'Winter dominant rainfall with hot dry summers; prime wheat and barley heartland.',
            helpline: {
              name: 'Agriculture Victoria Farmer Support',
              contact: '136 186',
            },
            recommendedCrops: [
              {
                id: 'vic-wheat',
                name: 'Wheat (ASW / APH Australian Hard)',
                scientificName: 'Triticum aestivum',
                category: 'Cereals',
                suitableSeason: 'Autumn Sowing (May) – Summer Harvest (Dec)',
                waterNeeds: 'Low',
                growthDurationDays: 180,
                avgYield: '3.5 – 5.5 Tonnes / Hectare',
                economicImportance: 'Premier grain export commodity into Southeast Asia and Middle East.',
                keyNutrientRequirements: 'Deep soil nitrogen testing; starter MAP/DAP with zinc at seeding.',
                commonPestAlerts: ['Stripe Rust', 'Crown Rot', 'Snails & Slugs'],
                irrigationMethod: 'Dryland Conservation Stubble Retention',
                optimalSoil: 'Self-mulching grey and brown clay',
                icon: '🌾',
              },
              {
                id: 'vic-barley',
                name: 'Barley (Malting / Feed)',
                scientificName: 'Hordeum vulgare',
                category: 'Cereals',
                suitableSeason: 'May – November',
                waterNeeds: 'Low',
                growthDurationDays: 160,
                avgYield: '4.0 – 6.0 Tonnes / Hectare',
                economicImportance: 'High quality malting barley for global brewing markets.',
                keyNutrientRequirements: 'Careful nitrogen timing to keep grain protein within 9.5–12.0%.',
                commonPestAlerts: ['Spot Form of Net Blotch', 'Scald', 'Armyworm'],
                irrigationMethod: 'Dryland No-Till',
                optimalSoil: 'Alkaline Calcareous Loam',
                icon: '🌾',
              },
              {
                id: 'vic-canola',
                name: 'Canola (Rapeseed)',
                scientificName: 'Brassica napus',
                category: 'Oilseeds',
                suitableSeason: 'April – November',
                waterNeeds: 'Medium',
                growthDurationDays: 190,
                avgYield: '2.0 – 3.2 Tonnes / Hectare',
                economicImportance: 'High oil percentage export to European biofuel and edible markets.',
                keyNutrientRequirements: 'High sulfur demand (ammonium sulfate) and split nitrogen.',
                commonPestAlerts: ['Diamondback Moth', 'Blackleg', 'Redlegged Earth Mite'],
                irrigationMethod: 'Dryland Direct Drill',
                optimalSoil: 'Medium Clay Loam',
                icon: '🌼',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Autumn Seeding Campaign',
                period: 'April – June',
                activityFocus: 'Direct drilling into retained stubble following break-of-season rains.',
                keyActionItems: [
                  'Soil moisture probe check before dropping openers into the ground',
                  'Knockdown weed control with registered systemic herbicide mix',
                  'Seed treatment with fluquinconazole against blackleg in canola',
                ],
                climateNote: 'Autumn break timing varies; dry sowing practiced if rains delay past May 15.',
              },
            ],
            regionalFarmingTips: [
              'Retain 100% crop residue stubble to maximize summer fallow moisture retention',
              'Utilize controlled traffic farming (CTF) tracks to eliminate subsoil compaction',
            ],
          },
        ],
      },
    ],
  },

  // 4. CANADA
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    landUnit: 'Acres',
    tempUnit: '°C',
    weightUnit: 'Bushels / Metric Tonnes',
    rainfallUnit: 'mm',
    idTypeLabel: 'AgriStability PIN / Farm ID',
    idTypePlaceholder: 'CAP-XXXX-XXXX',
    states: [
      {
        id: 'SK',
        name: 'Saskatchewan',
        climateZone: 'Boreal & Semi-Arid Prairie Steppe',
        districts: [
          {
            id: 'SK-REG',
            name: 'Regina & Southern Prairies',
            soilTypes: ['Heavy Brown & Dark Brown Chernozem Soils', 'Clay Plains'],
            primaryWaterSource: 'Snowmelt Moisture & Summer Rain (Dryland)',
            climateSummary: 'Short, sunny growing season (100–110 frost-free days) with high summer daylight hours.',
            helpline: {
              name: 'Saskatchewan Ministry of Agriculture Knowledge Center',
              contact: '1-866-457-2377',
            },
            recommendedCrops: [
              {
                id: 'sk-canola',
                name: 'Canola',
                scientificName: 'Brassica napus',
                category: 'Oilseeds',
                suitableSeason: 'May – September',
                waterNeeds: 'Medium',
                growthDurationDays: 98,
                avgYield: '40 – 52 Bushels / Acre',
                economicImportance: 'Flagship prairie export crop with extensive domestic crushing mills.',
                keyNutrientRequirements: 'Balanced nitrogen, phosphate, and elemental sulfur blends.',
                commonPestAlerts: ['Flea Beetles', 'Sclerotinia Stem Rot', 'Clubroot'],
                irrigationMethod: 'Dryland Zero-Till',
                optimalSoil: 'Chernozemic Fertile Loam',
                icon: '🌼',
              },
              {
                id: 'sk-wheat',
                name: 'Canada Western Red Spring (CWRS) Wheat',
                scientificName: 'Triticum aestivum',
                category: 'Cereals',
                suitableSeason: 'May – September',
                waterNeeds: 'Medium',
                growthDurationDays: 105,
                avgYield: '50 – 65 Bushels / Acre',
                economicImportance: 'World benchmark for high protein bread-making flour.',
                keyNutrientRequirements: 'In-soil banding of urea and monoammonium phosphate.',
                commonPestAlerts: ['Fusarium Head Blight', 'Wheat Midge', 'Stripe Rust'],
                irrigationMethod: 'Zero-Till Conservation Air Drill',
                optimalSoil: 'Deep Dark Brown Clay Loam',
                icon: '🌾',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Prairie Seeding Window',
                period: 'May – June',
                activityFocus: 'Rapid 3-week seeding window with high capacity 60ft air seeders.',
                keyActionItems: [
                  'Seed shallow (0.5 to 1 inch) to ensure rapid soil warming and emergence',
                  'Use insecticidal seed dressings to protect young seedlings from flea beetles',
                ],
                climateNote: 'Risk of late spring frost until May 20; cold soils slow root intake.',
              },
            ],
            regionalFarmingTips: [
              'Zero-tillage air-seeding conserves over 85% of winter snowpack moisture',
              'Include pulse crops (lentils, peas) every 3rd year to fix biological nitrogen',
            ],
          },
        ],
      },
    ],
  },

  // 5. UNITED KINGDOM
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    landUnit: 'Hectares',
    tempUnit: '°C',
    weightUnit: 'Metric Tonnes',
    rainfallUnit: 'mm',
    idTypeLabel: 'Single Business Identifier (SBI)',
    idTypePlaceholder: 'SBI-XXXX-XXXX',
    states: [
      {
        id: 'ENG-EA',
        name: 'East Anglia',
        climateZone: 'Temperate Maritime / Arable Eastern Lowlands',
        districts: [
          {
            id: 'EA-NFK',
            name: 'Norfolk & Suffolk Arable Lowlands',
            soilTypes: ['Sandy Loam over Chalk', 'Fen Peat', 'Heavy Boulder Clay'],
            primaryWaterSource: 'Winter Borehole Storage & Regulated Abstraction',
            climateSummary: 'Driest region in the UK with high sunshine hours and fertile soils.',
            helpline: {
              name: 'AHDB Farmer Information Bureau',
              contact: '024 7669 2051',
            },
            recommendedCrops: [
              {
                id: 'ea-wheat',
                name: 'Winter Milling Wheat',
                scientificName: 'Triticum aestivum',
                category: 'Cereals',
                suitableSeason: 'Autumn Sowing (Sep–Oct) – Harvest (Aug)',
                waterNeeds: 'Medium',
                growthDurationDays: 290,
                avgYield: '8.5 – 11.5 Tonnes / Hectare',
                economicImportance: 'High quality milling for UK master bakers and export.',
                keyNutrientRequirements: 'Late liquid nitrogen application at flag leaf to elevate protein to 13%.',
                commonPestAlerts: ['Septoria tritici', 'Yellow Rust', 'Orange Wheat Blossom Midge'],
                irrigationMethod: 'Rainfed Arable',
                optimalSoil: 'Heavy Clay Loam & Chalk Basins',
                icon: '🌾',
              },
              {
                id: 'ea-sugarbeet',
                name: 'Sugar Beet',
                scientificName: 'Beta vulgaris',
                category: 'Cash Crops',
                suitableSeason: 'Spring Sowing (March–April) – Winter Lifting (Nov–Feb)',
                waterNeeds: 'High',
                growthDurationDays: 220,
                avgYield: '75 – 90 Tonnes / Hectare',
                economicImportance: 'Supplies British Sugar processing plants across East Anglia.',
                keyNutrientRequirements: 'High Boron, Sodium, and balanced Nitrogen requirements.',
                commonPestAlerts: ['Virus Yellows (Myzus persicae)', 'Cercospora Leaf Spot'],
                irrigationMethod: 'Hose Reel Boom Irrigators in Sandy Blocks',
                optimalSoil: 'Deep Fertile Sandy Loam and Fen Soils',
                icon: '🌱',
              },
              {
                id: 'ea-barley',
                name: 'Spring Malting Barley',
                scientificName: 'Hordeum vulgare',
                category: 'Cereals',
                suitableSeason: 'March – August',
                waterNeeds: 'Low',
                growthDurationDays: 140,
                avgYield: '6.5 – 8.0 Tonnes / Hectare',
                economicImportance: 'Supplies the iconic East Anglian craft ale and whisky distilleries.',
                keyNutrientRequirements: 'Low nitrogen regime to satisfy maltster specs (<1.55% N).',
                commonPestAlerts: ['Rhynchosporium', 'Ramularia', 'Gout Fly'],
                irrigationMethod: 'Rainfed',
                optimalSoil: 'Light Chalk Loam',
                icon: '🌾',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Autumn Establishment',
                period: 'September – November',
                activityFocus: 'Drilling winter wheat and managing black-grass (Alopecurus myosuroides).',
                keyActionItems: [
                  'Delay drilling on black-grass infested parcels until mid-October',
                  'Apply robust pre-emergence residual herbicide stack within 48 hours of drilling',
                ],
                climateNote: 'Mild autumn rains help germination; avoid compaction during drilling.',
              },
            ],
            regionalFarmingTips: [
              'Adopt min-till and strip-till cultivation to preserve earthworm populations and reduce fuel spend',
              'Participate in the Sustainable Farming Incentive (SFI) companion cropping standards',
            ],
          },
        ],
      },
    ],
  },

  // 6. KENYA
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currencySymbol: 'KSh',
    currencyCode: 'KES',
    landUnit: 'Hectares',
    tempUnit: '°C',
    weightUnit: 'Bag (90kg)',
    rainfallUnit: 'mm',
    idTypeLabel: 'National ID / Farmers Card',
    idTypePlaceholder: 'ID-XXXXXXXX',
    states: [
      {
        id: 'KE-RV',
        name: 'Rift Valley & Highlands',
        climateZone: 'Tropical Highland / Bimodal Savanna',
        districts: [
          {
            id: 'KE-NAK',
            name: 'Nakuru & Central Rift',
            soilTypes: ['Volcanic Loam', 'Rich Ash Soils'],
            primaryWaterSource: 'Bimodal Rainfall & Lake Naivasha Basins',
            climateSummary: 'Highland altitude keeps temperatures cool with reliable long and short rains.',
            helpline: {
              name: 'KALRO Farmer Agricultural Information Line',
              contact: '+254-20-4183301',
            },
            recommendedCrops: [
              {
                id: 'ke-maize',
                name: 'Highland White Maize',
                scientificName: 'Zea mays',
                category: 'Cereals',
                suitableSeason: 'Long Rains (March – September)',
                waterNeeds: 'Medium',
                growthDurationDays: 160,
                avgYield: '30 – 45 Bags / Acre',
                economicImportance: 'National food staple for Ugali consumption across East Africa.',
                keyNutrientRequirements: 'DAP basal at planting with CAN top dressing at knee-high.',
                commonPestAlerts: ['Fall Armyworm', 'Maize Lethal Necrosis (MLND)', 'Stem Borers'],
                irrigationMethod: 'Rainfed with micro-drip supplements',
                optimalSoil: 'Deep Fertile Volcanic Ash Loam',
                icon: '🌽',
              },
              {
                id: 'ke-frenchbeans',
                name: 'French Beans & Horticulture',
                scientificName: 'Phaseolus vulgaris',
                category: 'Vegetables',
                suitableSeason: 'Year-Round with irrigation',
                waterNeeds: 'Medium',
                growthDurationDays: 60,
                avgYield: '4 – 6 Tonnes / Acre',
                economicImportance: 'High value air-freight export crop to European supermarket shelves.',
                keyNutrientRequirements: 'Soluble NPK fertigation with bio-stimulants.',
                commonPestAlerts: ['Thrips', 'Bean Fly', 'Rust'],
                irrigationMethod: 'Overhead Sprinkler & Drip',
                optimalSoil: 'Well Drained Loam',
                icon: '🌱',
              },
            ],
            seasonalSuggestions: [
              {
                seasonName: 'Long Rains (Msimu wa Masika)',
                period: 'March – August',
                activityFocus: 'Main food security cropping for maize, potatoes, and beans.',
                keyActionItems: [
                  'Dry planting just before rains to capture the early nitrogen flush',
                  'Scout for Fall Armyworm egg batches on underside of maize leaves weekly',
                ],
                climateNote: 'Heavy downpours expected in April–May; prevent sheet erosion with vetiver grass.',
              },
            ],
            regionalFarmingTips: [
              'Use Push-Pull technology (Desmodium and Napier grass) to eliminate stem borers naturally',
              'Lime acidic volcanic soils every 3 years to unlock bonded phosphorus',
            ],
          },
        ],
      },
    ],
  },
];

// Helper Query Utilities
export const getAvailableCountries = () => {
  return GLOBAL_AGRICULTURE_DATA.map(c => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    landUnit: c.landUnit,
    currencySymbol: c.currencySymbol,
  }));
};

export const getCountryByCode = (code: string): CountryData => {
  const found = GLOBAL_AGRICULTURE_DATA.find(c => c.code === code);
  return found || GLOBAL_AGRICULTURE_DATA[0];
};

export const getStatesForCountry = (countryCode: string): StateProvinceData[] => {
  const country = getCountryByCode(countryCode);
  return country.states;
};

export const getDistrictsForState = (countryCode: string, stateId: string): DistrictRegionData[] => {
  const states = getStatesForCountry(countryCode);
  const state = states.find(s => s.id === stateId) || states[0];
  return state ? state.districts : [];
};

export const getDistrictDetails = (
  countryCode: string,
  stateId: string,
  districtId: string
): { country: CountryData; state: StateProvinceData; district: DistrictRegionData } => {
  const country = getCountryByCode(countryCode);
  const state = country.states.find(s => s.id === stateId) || country.states[0];
  const district = state.districts.find(d => d.id === districtId) || state.districts[0];
  return { country, state, district };
};
