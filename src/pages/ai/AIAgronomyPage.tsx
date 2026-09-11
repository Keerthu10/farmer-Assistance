import React, { useState } from 'react';
import { 
  Sparkles, TrendingUp, Calculator, AlertCircle, 
  Leaf, CloudSun, ShieldCheck, ArrowRight, CheckCircle2, 
  BarChart3, DollarSign, Sprout, Upload, Bug, HelpCircle, 
  Award, Eye, RefreshCw 
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';
import { MARKET_DEMAND_TRENDS } from '../../data/marketplaceData';

interface AIAgronomyPageProps {
  onNavigate: (path: string) => void;
}

export const AIAgronomyPage: React.FC<AIAgronomyPageProps> = ({ onNavigate }) => {
  const { currentRegion, formatCurrency } = useRegion();
  const [activeTab, setActiveTab] = useState<'yield' | 'demand' | 'pricing' | 'disease' | 'weather'>('yield');

  // 1. Yield Predictor State
  const [crop, setCrop] = useState<string>('Organic Basmati Rice');
  const [acreage, setAcreage] = useState<number>(5);
  const [soilType, setSoilType] = useState<string>('Alluvial Loam');
  const [irrigation, setIrrigation] = useState<string>('Drip Irrigation');
  const [regimen, setRegimen] = useState<string>('Zero-Chemical Vermicompost + Bio-NPK');
  const [isYieldPredicting, setIsYieldPredicting] = useState<boolean>(false);
  const [yieldResult, setYieldResult] = useState<any>({
    minYield: 110,
    maxYield: 135,
    unit: 'Quintals (100kg)',
    confidence: 94.6,
    harvestWindow: 'Nov 12 – Nov 24, 2026',
    directRevenue: 1380000,
    mandiRevenue: 980000,
    gainPercent: 40.8,
  });

  // 3. Dynamic Pricing State
  const [pricingCrop, setPricingCrop] = useState<string>('Vine-Ripened Cherry Tomatoes');
  const [costOfProduction, setCostOfProduction] = useState<number>(22);
  const [mandiRate, setMandiRate] = useState<number>(32);
  const [retailRate, setRetailRate] = useState<number>(70);

  // 4. Disease Detector State
  const [selectedSymptom, setSelectedSymptom] = useState<string>('brown-concentric-rings');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [diseaseDiagnosis, setDiseaseDiagnosis] = useState<any>({
    name: 'Early Blight (Alternaria solani)',
    pathogen: 'Fungal leaf pathogen',
    severity: 'Moderate (25% leaf area affected)',
    confidence: 96.2,
    organicRemedy: 'Foliar spray of Trichoderma harzianum (5g/litre) + 1% Cold-Pressed Neem Seed Kernel Extract.',
    chemicalBackup: 'Copper Oxychloride (2.5g/litre) only if rain exceeds 3 consecutive days.',
    safeHarvestWait: 'Zero-day wait for organic spray; produce 100% edible immediately.',
  });

  const handleRunYieldPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsYieldPredicting(true);
    setTimeout(() => {
      let multiplier = 24;
      let priceDirect = 115;
      let priceMandi = 85;

      if (crop.includes('Tomatoes')) {
        multiplier = 65;
        priceDirect = 48;
        priceMandi = 30;
      } else if (crop.includes('Wheat')) {
        multiplier = 20;
        priceDirect = 38;
        priceMandi = 27;
      } else if (crop.includes('Avocados')) {
        multiplier = 35;
        priceDirect = 140;
        priceMandi = 95;
      }

      const min = Math.round(acreage * multiplier * 0.9);
      const max = Math.round(acreage * multiplier * 1.15);
      const avg = (min + max) / 2;
      const directRev = Math.round(avg * 100 * (priceDirect / 100)); // converting quintal to kg
      const mandiRev = Math.round(avg * 100 * (priceMandi / 100));
      const gain = Math.round(((directRev - mandiRev) / mandiRev) * 100);

      setYieldResult({
        minYield: min,
        maxYield: max,
        unit: 'Quintals',
        confidence: 93 + Math.floor(Math.random() * 5),
        harvestWindow: 'Within 45–60 days of current vegetative stage',
        directRevenue: directRev * 100,
        mandiRevenue: mandiRev * 100,
        gainPercent: gain > 0 ? gain : 32,
      });
      setIsYieldPredicting(false);
    }, 600);
  };

  const handleRunDiseaseScan = (symptomKey: string) => {
    setSelectedSymptom(symptomKey);
    setIsScanning(true);
    setTimeout(() => {
      if (symptomKey === 'brown-concentric-rings') {
        setDiseaseDiagnosis({
          name: 'Early Blight (Alternaria solani)',
          pathogen: 'Fungal Pathogen',
          severity: 'Moderate (25% leaf area affected)',
          confidence: 96.2,
          organicRemedy: 'Foliar spray of Trichoderma harzianum (5g/litre) + 1% Cold-Pressed Neem Seed Kernel Extract.',
          chemicalBackup: 'Copper Oxychloride (2.5g/litre) only if rain exceeds 3 consecutive days.',
          safeHarvestWait: 'Zero-day harvest interval for bio-sprays; 100% organic compliance maintained.',
        });
      } else if (symptomKey === 'yellow-stripes') {
        setDiseaseDiagnosis({
          name: 'Yellow Stripe Rust (Puccinia striiformis)',
          pathogen: 'Airborne fungal spores',
          severity: 'Early Stage Detection (8% canopy)',
          confidence: 97.5,
          organicRemedy: 'Foliar bio-fungicide Bacillus subtilis bio-spray + bio-potash foliar strengthening.',
          chemicalBackup: 'Tebuconazole 25.9% EC (1ml/litre) in severe clusters.',
          safeHarvestWait: '7 days before harvesting grains.',
        });
      } else {
        setDiseaseDiagnosis({
          name: 'Powdery White Mildew (Erysiphales)',
          pathogen: 'Surface fungal mycelium',
          severity: 'Mild (Surface dust spots)',
          confidence: 95.8,
          organicRemedy: 'Baking soda (Potassium bicarbonate 3g/L) + mild organic soap water spray every 5 days.',
          chemicalBackup: 'Sulfur 80% WDG (2.5g/L).',
          safeHarvestWait: 'Wash produce with clean water before packing.',
        });
      }
      setIsScanning(false);
    }, 500);
  };

  // Dynamic Pricing Recommendation formula
  const recommendedDirectPrice = Math.round(mandiRate + (retailRate - mandiRate) * 0.45);
  const farmerExtraGain = recommendedDirectPrice - mandiRate;
  const customerSavings = retailRate - recommendedDirectPrice;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Agricultural Intelligence Suite</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
          AI Agronomy & Market Optimization
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Predict yield outcomes, benchmark dynamic direct prices, forecast restaurant demand, and identify plant diseases instantly
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        {[
          { id: 'yield', label: '1. Crop Yield Predictor', icon: Calculator },
          { id: 'demand', label: '2. Market Demand Forecasting', icon: TrendingUp },
          { id: 'pricing', label: '3. Dynamic Pricing Suggester', icon: DollarSign },
          { id: 'disease', label: '4. AI Crop Disease Detector', icon: Bug },
          { id: 'weather', label: '5. Weather Harvest Advisory', icon: CloudSun },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CROP YIELD PREDICTOR */}
      {activeTab === 'yield' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          
          {/* Inputs Form (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Yield Simulation Parameters</span>
            </h3>

            <form onSubmit={handleRunYieldPrediction} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Target Crop Variety
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                >
                  <option value="Organic Basmati Rice">Organic Pusa 1121 Basmati Rice</option>
                  <option value="Vine-Ripened Cherry Tomatoes">Vine-Ripened Cherry Tomatoes</option>
                  <option value="Sharbati Wheat">Sharbati Golden Wheat</option>
                  <option value="Export Grade Hass Avocados">Export Grade Hass Avocados</option>
                  <option value="Tender Coconuts">Pollachi Tender Coconuts</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
                  <span>Farm Acreage Under Cultivation:</span>
                  <span className="text-emerald-600">{acreage} Acres</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={acreage}
                  onChange={(e) => setAcreage(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Irrigation System
                  </label>
                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="Drip Irrigation">Precision Drip Irrigation</option>
                    <option value="Micro Sprinkler">Micro Sprinkler System</option>
                    <option value="Canal Flood">Canal Gravity Flood</option>
                    <option value="Tube Well">Deep Solar Tube Well</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Fertilization / Compost Regimen
                </label>
                <select
                  value={regimen}
                  onChange={(e) => setRegimen(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="Zero-Chemical Vermicompost + Bio-NPK">Zero-Chemical Vermicompost + Bio-NPK (Organic)</option>
                  <option value="Jeevamrutha Natural Liquid Manure">Jeevamrutha Natural Liquid Manure</option>
                  <option value="Integrated Nutrient Management (INM)">Integrated Nutrient Management (INM)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isYieldPredicting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isYieldPredicting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Agronomic Yield & Revenue Prediction</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                  Predicted Harvest & Financial Outcome
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  {yieldResult.confidence}% AI Confidence Score
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">
                    Expected Harvest Yield
                  </span>
                  <span className="text-xl font-extrabold text-stone-900 dark:text-white">
                    {yieldResult.minYield} – {yieldResult.maxYield}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {yieldResult.unit}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">
                    Optimal Harvest Window
                  </span>
                  <span className="text-xs font-extrabold text-stone-900 dark:text-white leading-tight block">
                    {yieldResult.harvestWindow}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-1">
                    Peak brix sweetness period
                  </span>
                </div>
              </div>

              {/* Direct Farm Revenue vs Mandi Comparison Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                  Marketplace Direct Revenue Advantage
                </span>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600 dark:text-stone-400">Direct-to-Customer Revenue:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrency(yieldResult.directRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400 line-through">Middleman Mandi Auction Rate:</span>
                    <span className="font-semibold text-stone-500">
                      {formatCurrency(yieldResult.mandiRevenue)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    Net Extra Income to Farm:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{yieldResult.gainPercent}% ({formatCurrency(yieldResult.directRevenue - yieldResult.mandiRevenue)})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
              <strong>Agronomic Yield Booster Tip:</strong> Apply foliar bio-zinc spray at early panicle / flowering stage to enhance grain fullness and reduce moisture drops.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MARKET DEMAND FORECASTING */}
      {activeTab === 'demand' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">
                Regional Demand Velocity Intelligence
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Aggregated procurement search requests from restaurants, organic supermarkets, and culinary exporters
              </p>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              Updated 2 hours ago
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKET_DEMAND_TRENDS.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 font-extrabold text-emerald-600 text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{item.growth_rate_percent}% Demand
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                    {item.crop_name}
                  </h4>
                  <span className="text-emerald-600 font-bold text-xs block mt-0.5">
                    {item.average_price_gain}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1.5">
                    Active Buyer Segments:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.buyer_interest.map((b, bi) => (
                      <span
                        key={bi}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC PRICING SUGGESTER */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-4">
            <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Input Production & Market Benchmarks</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Commodity Name
                </label>
                <input
                  type="text"
                  value={pricingCrop}
                  onChange={(e) => setPricingCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Farmer Cost of Cultivation (Per Unit): {formatCurrency(costOfProduction)}
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={costOfProduction}
                  onChange={(e) => setCostOfProduction(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Local Mandi Broker Price: {formatCurrency(mandiRate)}
                </label>
                <input
                  type="range"
                  min={10}
                  max={150}
                  value={mandiRate}
                  onChange={(e) => setMandiRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Retail Supermarket Shelf Price: {formatCurrency(retailRate)}
                </label>
                <input
                  type="range"
                  min={20}
                  max={250}
                  value={retailRate}
                  onChange={(e) => setRetailRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                AI Suggested Direct Farm Price
              </span>
              <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg space-y-1">
                <span className="text-xs text-emerald-100 font-semibold block">Optimal Direct Sweet Spot:</span>
                <span className="text-3xl font-extrabold block">
                  {formatCurrency(recommendedDirectPrice)} / kg
                </span>
                <p className="text-[11px] text-emerald-100">
                  Guarantees maximum velocity sales while yielding substantial farmer profit.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-bold">Farmer Extra Margin:</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    +{formatCurrency(farmerExtraGain)}/kg (+{Math.round((farmerExtraGain / mandiRate) * 100)}%)
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Higher than mandi middleman</span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-bold">Customer Savings:</span>
                  <span className="text-base font-extrabold text-teal-600">
                    -{formatCurrency(customerSavings)}/kg (-{Math.round((customerSavings / retailRate) * 100)}%)
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Cheaper than supermarket</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/farmer-products')}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold hover:opacity-90 transition-opacity"
            >
              Apply this price to My Harvest Listings
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AI CROP DISEASE DETECTOR */}
      {activeTab === 'disease' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-4">
            <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-500" />
              <span>Diagnostic Symptom Scanner</span>
            </h3>

            <p className="text-stone-500 text-xs">
              Select or upload visible crop leaf symptoms to diagnose fungal, bacterial, or viral infections immediately.
            </p>

            <div className="space-y-2">
              {[
                { id: 'brown-concentric-rings', label: 'Dark brown concentric target rings on lower leaves (Tomatoes / Potatoes)' },
                { id: 'yellow-stripes', label: 'Bright yellow powdery stripes along wheat leaf veins (Cereals)' },
                { id: 'powdery-white', label: 'White talcum-powder like dusting over upper leaf surfaces (Vegetables / Cucurbits)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleRunDiseaseScan(s.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    selectedSymptom === s.id
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-stone-900 dark:text-white font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 text-center space-y-1">
              <Upload className="w-6 h-6 text-stone-400 mx-auto" />
              <span className="font-bold text-stone-700 dark:text-stone-300 block">Or upload crop leaf photo</span>
              <span className="text-[10px] text-stone-400">Simulate diagnosis from high-resolution mobile cameras</span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-4">
            {isScanning ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold text-stone-700">Analyzing plant pathology computer vision model...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Diagnosis</span>
                    <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                      {diseaseDiagnosis.name}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                    {diseaseDiagnosis.confidence}% Match
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="text-amber-800 dark:text-amber-300 font-bold block">Severity:</span>
                  <p className="text-stone-700 dark:text-stone-300">{diseaseDiagnosis.severity}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold block flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Organic & Biological Prescription (Zero-Residue):
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {diseaseDiagnosis.organicRemedy}
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1 border-t border-emerald-200 dark:border-emerald-800">
                    {diseaseDiagnosis.safeHarvestWait}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-stone-600 dark:text-stone-300 font-bold block">Chemical Backup (if outbreak is severe):</span>
                  <p className="text-stone-500">{diseaseDiagnosis.chemicalBackup}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: WEATHER HARVEST ADVISORY */}
      {activeTab === 'weather' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
              Synchronized Atmospheric Harvest & Spray Windows
            </h3>
          </div>

          <p className="text-stone-500">
            Current forecast for <strong>{currentRegion.defaultDistrict}, {currentRegion.defaultState}</strong> recommends optimal timing for plucking and cold chain logistics:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">Optimal Window</span>
              <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">Harvest Vegetables & Fruits</h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Next 48 hours show 0% rain probability and moderate morning humidity (58%). Best time to pluck cherry tomatoes and bell peppers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">Safe Window</span>
              <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">Bio-Compost Spraying</h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Wind speeds are calm at 6 km/h. Suitable for foliar biological nutrition and neem oil coverage without drift.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-stone-400 text-white font-bold text-[10px]">Logistics Alert</span>
              <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">Cold Chain Transit</h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Midday temperatures reaching 31°C. Ship tender produce before 9:00 AM or use thermal insulation blankets in direct farm vans.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
