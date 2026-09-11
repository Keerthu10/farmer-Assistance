import React, { useState, useId } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Globe, MapPin, Calendar, Sprout, Droplets, 
  AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, 
  Sparkles, Layers, PhoneCall, Info, Compass 
} from 'lucide-react';
import { 
  GLOBAL_AGRICULTURE_DATA, 
  getCountryByCode, 
  getStatesForCountry, 
  getDistrictsForState,
  CropRecommendationItem
} from '../../data/globalAgricultureData';
import { useRegion } from '../../context/RegionContext';
import { Badge } from '../common/Badge';

interface RegionAgriExplorerProps {
  onSelectCropForRegistration?: (crop: CropRecommendationItem) => void;
  standalone?: boolean;
}

export const RegionAgriExplorer: React.FC<RegionAgriExplorerProps> = ({ 
  onSelectCropForRegistration,
  standalone = false 
}) => {
  const { setRegionById } = useRegion();
  const countrySelectId = useId();
  const stateSelectId = useId();
  const districtSelectId = useId();

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [selectedStateId, setSelectedStateId] = useState<string>('TN');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('TN-CBE');
  const [activeTab, setActiveTab] = useState<'crops' | 'seasons' | 'tips'>('crops');
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  // Derive active entities
  const country = getCountryByCode(selectedCountryCode);
  const states = getStatesForCountry(selectedCountryCode);
  const activeState = states.find(s => s.id === selectedStateId) || states[0];
  
  const districts = activeState ? activeState.districts : [];
  const activeDistrict = districts.find(d => d.id === selectedDistrictId) || districts[0];

  // Handler for Country change
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    const newStates = getStatesForCountry(countryCode);
    if (newStates.length > 0) {
      const firstState = newStates[0];
      setSelectedStateId(firstState.id);
      if (firstState.districts.length > 0) {
        setSelectedDistrictId(firstState.districts[0].id);
      }
    }
    // Synchronize global context
    if (countryCode === 'IN') setRegionById('in-south');
    else if (countryCode === 'US') setRegionById('us-midwest');
    else if (countryCode === 'KE') setRegionById('ke-east');
    else if (countryCode === 'AU') setRegionById('au-south');
    else if (countryCode === 'CA') setRegionById('ca-prairies');
    else if (countryCode === 'GB') setRegionById('uk-east');
  };

  // Handler for State change
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const newState = states.find(s => s.id === stateId);
    if (newState && newState.districts.length > 0) {
      setSelectedDistrictId(newState.districts[0].id);
    }
    if (selectedCountryCode === 'IN' && stateId === 'PB') {
      setRegionById('in-north');
    } else if (selectedCountryCode === 'IN' && stateId === 'TN') {
      setRegionById('in-south');
    }
  };

  return (
    <div className={`space-y-6 ${standalone ? 'p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm' : ''}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                Global Agricultural Recommendation Engine
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Hierarchical agronomy matching: Country → State/Province → District → Benchmark Crops & Seasonal Suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Station Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
          <span className="text-base">{country?.flag || '🌾'}</span>
          <span className="font-bold text-emerald-900 dark:text-emerald-200">
            {activeDistrict?.name || 'Agricultural Station'}
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            {country?.landUnit || 'Acres'}
          </span>
        </div>
      </div>

      {/* 3-Step Cascading Region Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/80 text-xs">
        {/* 1. Country Selector */}
        <div>
          <label htmlFor={countrySelectId} className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Select Country</span>
          </label>
          <select
            id={countrySelectId}
            value={selectedCountryCode}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            {GLOBAL_AGRICULTURE_DATA.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.landUnit}, {c.currencySymbol})
              </option>
            ))}
          </select>
        </div>

        {/* 2. State / Province Selector */}
        <div>
          <label htmlFor={stateSelectId} className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>2. State / Province</span>
          </label>
          <select
            id={stateSelectId}
            value={selectedStateId}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                📍 {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. District / Agro-Climatic Region */}
        <div>
          <label htmlFor={districtSelectId} className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>3. District / Agro-Region</span>
          </label>
          <select
            id={districtSelectId}
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                🌾 {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active District Agro Profile Card */}
      {activeDistrict && (
        <motion.div
          key={activeDistrict.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-stone-900 text-white shadow-md text-xs"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{country?.flag || '🌾'}</span>
                <h3 className="font-extrabold text-base text-white">
                  {country?.name} • {activeState?.name || 'Region'} • {activeDistrict.name}
                </h3>
                {activeState?.climateZone && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {activeState.climateZone}
                  </span>
                )}
              </div>
              <p className="text-emerald-200/90 text-xs">
                {activeDistrict.climateSummary}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-emerald-300/80 pt-1 flex-wrap">
                <span><strong>Primary Soils:</strong> {activeDistrict.soilTypes?.join(', ')}</span>
                <span>•</span>
                <span><strong>Water Source:</strong> {activeDistrict.primaryWaterSource}</span>
              </div>
            </div>

            {/* Helpline quick widget */}
            {activeDistrict.helpline && (
              <div className="shrink-0 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/60 text-white">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">
                    {activeDistrict.helpline.name || 'Agri Extension'}
                  </p>
                  <p className="font-mono font-bold text-sm text-white mt-0.5">
                    {activeDistrict.helpline.contact || 'Toll Free'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tabs Navigation: Recommended Crops / Seasonal Calendar / Agronomy Tips */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'crops'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Recommended Crops ({activeDistrict?.recommendedCrops.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('seasons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'seasons'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Seasonal Suggestions ({activeDistrict?.seasonalSuggestions.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tips'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regional Farming Tips ({activeDistrict?.regionalFarmingTips.length || 0})</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === 'crops' && (
          <motion.div
            key="crops-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {activeDistrict?.recommendedCrops.map((crop) => {
              const isExpanded = expandedCropId === crop.id;
              return (
                <motion.div
                  key={crop.id}
                  layout
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-stone-100 dark:bg-stone-800">
                          {crop.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                            {crop.name}
                          </h4>
                          <p className="text-[11px] text-stone-400 italic">
                            {crop.scientificName}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                        {crop.category}
                      </span>
                    </div>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-2 my-3.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">Optimal Season</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">
                          {crop.suitableSeason}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">Benchmark Yield</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">
                          {crop.avgYield}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">Growth Duration</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                          ~{crop.growthDurationDays} Days
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400 block">Water Requirement</span>
                        <span className={`font-semibold block ${
                          crop.waterNeeds === 'Very High' ? 'text-sky-600' :
                          crop.waterNeeds === 'High' ? 'text-emerald-600' :
                          crop.waterNeeds === 'Medium' ? 'text-amber-600' : 'text-stone-600'
                        }`}>
                          {crop.waterNeeds} Needs
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {crop.economicImportance}
                    </p>

                    {/* Expandable Agronomic Specifications */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3.5 pt-3.5 border-t border-stone-100 dark:border-stone-800 space-y-2.5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-stone-700 dark:text-stone-300 block mb-0.5">
                            🌾 Soil & Irrigation Protocol:
                          </span>
                          <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                            {crop.optimalSoil} • Method: <strong>{crop.irrigationMethod}</strong>
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-stone-700 dark:text-stone-300 block mb-0.5">
                            🧪 Nutrient & Fertilizer Schedule:
                          </span>
                          <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                            {crop.keyNutrientRequirements}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Pest & Disease Watchlist:</span>
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {crop.commonPestAlerts.map((pest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[10px] text-rose-700 dark:text-rose-300 font-medium"
                              >
                                ⚠️ {pest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Less agronomy details' : 'View full agronomy guide'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {onSelectCropForRegistration && (
                      <button
                        onClick={() => onSelectCropForRegistration(crop)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <span>Register Crop</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'seasons' && (
          <motion.div
            key="seasons-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {activeDistrict?.seasonalSuggestions.map((season, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {season.seasonName}
                      </h4>
                      <span className="text-[11px] text-stone-400 font-medium">
                        Active Period: {season.period}
                      </span>
                    </div>
                  </div>
                  <Badge variant="amber">
                    {season.climateNote}
                  </Badge>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                  {season.activityFocus}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    Action Checklist:
                  </span>
                  {season.keyActionItems.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <motion.div
            key="tips-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {activeDistrict?.regionalFarmingTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-stone-900 dark:text-white mb-1">
                    Agronomic Recommendation #{idx + 1}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {tip}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
