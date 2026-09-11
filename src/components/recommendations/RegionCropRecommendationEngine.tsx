import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Sprout, Award, Droplets, ArrowRight, CheckCircle2, 
  MapPin, ShieldCheck, Sun, Layers, HelpCircle, TrendingUp, Compass 
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';

interface CropMatchResult {
  cropName: string;
  category: string;
  suitabilityScore: number;
  seasonMatch: string;
  idealSoil: string;
  growthDays: number;
  expectedYield: string;
  directPriceEstimate: string;
  mandiComparison: string;
  recommendedVarieties: string[];
  keyAdvice: string;
  waterNeed: 'Low' | 'Moderate' | 'High';
  governmentScheme?: string;
}

export const RegionCropRecommendationEngine: React.FC<{
  onNavigate?: (path: string) => void;
}> = ({ onNavigate }) => {
  const { currentRegion, availableRegions, formatCurrency } = useRegion();

  const [selectedSoil, setSelectedSoil] = useState<string>('Alluvial Loam');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif (Monsoon)');
  const [selectedWater, setSelectedWater] = useState<string>('Assured Canal + Borewell');
  const [landArea, setLandArea] = useState<number>(5);

  const soilOptions = [
    'Alluvial Loam',
    'Black Cotton Soil (Regur)',
    'Clay Loam with High Humus',
    'Red Laterite Soil',
    'Sandy Loam (Well-Drained)',
  ];

  const seasonOptions = [
    'Kharif (Monsoon / Summer)',
    'Rabi (Winter / Spring)',
    'Zaid (Pre-Monsoon / Summer Cash)',
  ];

  const waterOptions = [
    'Assured Canal + Borewell',
    'Solar Drip Irrigation',
    'Tube Well (Moderate)',
    'Rainfed / Seasonal Rainfall',
  ];

  // Dynamic agronomic suitability matrix based on region + soil + season
  const recommendations: CropMatchResult[] = useMemo(() => {
    const isPunjabOrHaryana = currentRegion.name.toLowerCase().includes('punjab') || currentRegion.name.toLowerCase().includes('gangetic');
    const isSouthIndia = currentRegion.name.toLowerCase().includes('south') || currentRegion.name.toLowerCase().includes('deccan');
    const isUSA = currentRegion.country.toLowerCase().includes('united states');

    if (isPunjabOrHaryana) {
      if (selectedSeason.startsWith('Kharif')) {
        return [
          {
            cropName: 'Pusa Basmati 1121 / 1509 Rice',
            category: 'Cereals & Grains',
            suitabilityScore: selectedSoil.includes('Alluvial') ? 97 : 89,
            seasonMatch: 'Kharif',
            idealSoil: 'Alluvial Loam / Clay Loam',
            growthDays: 130,
            expectedYield: '22 - 25 Quintals / Acre',
            directPriceEstimate: '₹85 / kg direct (₹4,200/quintal)',
            mandiComparison: '+38% higher than government MSP',
            recommendedVarieties: ['Pusa Basmati 1121', 'Pusa 1509', 'CSR 30'],
            keyAdvice: 'Transplant 25-day seedlings with alternate wetting and drying (AWD) to save 30% groundwater.',
            waterNeed: 'High',
            governmentScheme: 'Direct Seeded Rice (DSR) ₹1,500/acre incentive',
          },
          {
            cropName: 'Organic Sweet Corn (Sugar 75)',
            category: 'Vegetables',
            suitabilityScore: selectedSoil.includes('Sandy') || selectedSoil.includes('Loam') ? 94 : 85,
            seasonMatch: 'Kharif',
            idealSoil: 'Well-drained Loam',
            growthDays: 85,
            expectedYield: '14,000 cobs / Acre',
            directPriceEstimate: '₹22 / cob to restaurants',
            mandiComparison: '+45% vs traditional feed maize',
            recommendedVarieties: ['Syngenta Sugar 75', 'Madhuri Sweet Corn'],
            keyAdvice: 'Short 85-day duration allows double cropping before winter wheat.',
            waterNeed: 'Moderate',
            governmentScheme: 'Crop Diversification Mission subsidy on seeds',
          },
          {
            cropName: 'Moong (Green Gram - SML 668)',
            category: 'Pulses & Legumes',
            suitabilityScore: 91,
            seasonMatch: 'Kharif',
            idealSoil: 'Sandy Loam to Loam',
            growthDays: 65,
            expectedYield: '5 - 6 Quintals / Acre',
            directPriceEstimate: '₹95 / kg direct',
            mandiComparison: '+30% vs APMC mandi auction',
            recommendedVarieties: ['SML 668', 'MH 421'],
            keyAdvice: 'Fixes atmospheric nitrogen (up to 40kg N/ha), reducing fertilizer costs for next crop.',
            waterNeed: 'Low',
            governmentScheme: 'National Food Security Mission Pulses grant',
          },
        ];
      } else {
        // Rabi
        return [
          {
            cropName: 'Sharbati HD-2967 Golden Wheat',
            category: 'Cereals & Grains',
            suitabilityScore: 96,
            seasonMatch: 'Rabi',
            idealSoil: 'Alluvial Loam',
            growthDays: 145,
            expectedYield: '24 - 26 Quintals / Acre',
            directPriceEstimate: '₹42 / kg stone-ground',
            mandiComparison: '+48% higher through direct customer milling',
            recommendedVarieties: ['HD 2967', 'HD 3086', 'PBW 550'],
            keyAdvice: 'Zero-till drill sowing directly into standing stubble preserves residual soil moisture.',
            waterNeed: 'Moderate',
            governmentScheme: 'Subsidized Happy Seeder & Super Seeder allocation',
          },
          {
            cropName: 'Yellow Mustard (Pusa Mustard 25)',
            category: 'Oilseeds',
            suitabilityScore: selectedWater.includes('Rainfed') ? 95 : 90,
            seasonMatch: 'Rabi',
            idealSoil: 'Sandy Loam with good drainage',
            growthDays: 110,
            expectedYield: '8 - 10 Quintals / Acre',
            directPriceEstimate: '₹190 / liter cold-pressed oil',
            mandiComparison: '+60% value capture through farm-gate oil expelling',
            recommendedVarieties: ['Pusa Mustard 25', 'Giriraj (DRMRIJ 31)'],
            keyAdvice: 'Low water requirement (only 2 irrigations). High direct restaurant demand for kachi ghani oil.',
            waterNeed: 'Low',
            governmentScheme: 'National Mission on Edible Oils (NMEO-OP)',
          },
          {
            cropName: 'Vine Ripe Tomatoes (Himsona)',
            category: 'Vegetables',
            suitabilityScore: 92,
            seasonMatch: 'Rabi',
            idealSoil: 'Well-drained Loam rich in organic matter',
            growthDays: 110,
            expectedYield: '280 - 320 Quintals / Acre',
            directPriceEstimate: '₹40 / kg direct',
            mandiComparison: '+50% vs commission agent wholesale',
            recommendedVarieties: ['Himsona', 'Abhinav Hybrid'],
            keyAdvice: 'Staking with bamboo trellises prevents soil contact diseases and improves fruit cosmetic grade.',
            waterNeed: 'Moderate',
            governmentScheme: 'MIDH Polyhouse & Mulching subsidy (50% grant)',
          },
        ];
      }
    }

    // Default universal recommendations
    return [
      {
        cropName: 'Organic Heirloom Tomatoes',
        category: 'Vegetables',
        suitabilityScore: 95,
        seasonMatch: selectedSeason,
        idealSoil: selectedSoil,
        growthDays: 95,
        expectedYield: '250 Quintals / Acre',
        directPriceEstimate: '₹45 / kg direct',
        mandiComparison: '+40% savings shared with buyer',
        recommendedVarieties: ['Roma VF', 'Arka Rakshak', 'Pusa Ruby'],
        keyAdvice: 'Drip fertigation with bio-slurry enhances shelf life by 4 days for long-distance transit.',
        waterNeed: 'Moderate',
        governmentScheme: 'Paramparagat Krishi Vikas Yojana (PKVY) certification grant',
      },
      {
        cropName: 'Premium Basmati Rice / Golden Grain',
        category: 'Cereals',
        suitabilityScore: 92,
        seasonMatch: selectedSeason,
        idealSoil: selectedSoil,
        growthDays: 125,
        expectedYield: '20 Quintals / Acre',
        directPriceEstimate: '₹85 / kg direct',
        mandiComparison: '+35% above mandi benchmark',
        recommendedVarieties: ['Pusa 1121', 'Super Basmati'],
        keyAdvice: 'Harvest at 20% grain moisture to prevent breakage during de-husking.',
        waterNeed: 'High',
        governmentScheme: 'Subsidized Solar Irrigation Pumping Scheme',
      },
      {
        cropName: 'High-Protein Green Gram / Pulses',
        category: 'Pulses',
        suitabilityScore: 89,
        seasonMatch: selectedSeason,
        idealSoil: selectedSoil,
        growthDays: 70,
        expectedYield: '6 Quintals / Acre',
        directPriceEstimate: '₹110 / kg direct',
        mandiComparison: '+25% premium for graded unpolished pulse',
        recommendedVarieties: ['IPM 02-3', 'Samrat'],
        keyAdvice: 'Seed treatment with Rhizobium inoculant ensures rapid nodulation.',
        waterNeed: 'Low',
        governmentScheme: 'Certified Seed Distribution at 50% subsidy',
      },
    ];
  }, [currentRegion, selectedSoil, selectedSeason, selectedWater]);

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm p-6 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
              Smart Region & Soil Crop Recommendation Engine
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Algorithmic agro-climatic matching for <strong>{currentRegion.name}</strong> based on soil profile, season, and water capacity.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>Regional Agro-Climatic Zone: {currentRegion.climateZone}</span>
        </span>
      </div>

      {/* Interactive Input Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/70 text-xs">
        {/* Soil Type */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            1. Primary Soil Profile
          </label>
          <select
            value={selectedSoil}
            onChange={(e) => setSelectedSoil(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {soilOptions.map((soil) => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            2. Target Planting Season
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {seasonOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Irrigation Water Availability */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            3. Irrigation Source
          </label>
          <select
            value={selectedWater}
            onChange={(e) => setSelectedWater(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {waterOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Land Holding */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            4. Cultivation Land (Acres)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="500"
              value={landArea}
              onChange={(e) => setLandArea(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-stone-400 font-bold shrink-0">Acres</span>
          </div>
        </div>
      </div>

      {/* Agronomic Recommendations Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Ranked High-Yield Recommendations for Your Inputs ({recommendations.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.cropName}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="rounded-2xl p-5 bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/90 dark:border-stone-700/80 hover:border-emerald-500/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Score & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                    {rec.category}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{rec.suitabilityScore}% Match</span>
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                  {rec.cropName}
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                  {rec.keyAdvice}
                </p>

                {/* Specs Box */}
                <div className="mt-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Expected Yield:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{rec.expectedYield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Direct Farm Price:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{rec.directPriceEstimate}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-stone-400">Market Advantage:</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{rec.mandiComparison}</span>
                  </div>
                </div>

                {/* Seed Varieties */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Certified Cultivars / Varieties
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rec.recommendedVarieties.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-medium"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Government Subsidies */}
                {rec.governmentScheme && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-[10px] text-amber-900 dark:text-amber-300 flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                    <span>{rec.governmentScheme}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('/farmer-products')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>List Harvest Lot in Marketplace</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RegionCropRecommendationEngine;
