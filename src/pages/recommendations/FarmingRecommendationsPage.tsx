import React, { useState } from 'react';
import { 
  Sparkles, Filter, Search, Globe, Sprout, AlertTriangle, 
  CheckCircle2, ShieldCheck, Droplets, Bug, Leaf, Sun, 
  BookOpen, ChevronRight, LifeBuoy, PlusCircle 
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useRegion } from '../../context/RegionContext';
import { FARMING_RECOMMENDATIONS, CROP_PRESETS } from '../../data/regionsData';
import { FarmingRecommendation, CropPreset, CropStatus } from '../../types';

interface FarmingRecommendationsPageProps {
  onNavigate?: (path: string) => void;
}

export const FarmingRecommendationsPage: React.FC<FarmingRecommendationsPageProps> = ({ onNavigate }) => {
  const { currentRegion, setRegionById, availableRegions } = useRegion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedRecommendation, setSelectedRecommendation] = useState<FarmingRecommendation | null>(null);
  const [selectedPresetModal, setSelectedPresetModal] = useState<CropPreset | null>(null);

  const categories = [
    'All',
    'Sowing & Land Prep',
    'Irrigation Schedule',
    'Fertilizer & Nutrition',
    'Pest & Disease Control',
    'Harvesting & Post-Harvest',
  ];

  const uniqueCrops = ['All', ...Array.from(new Set(CROP_PRESETS.map(c => c.name)))];

  const filteredRecs = FARMING_RECOMMENDATIONS.filter(rec => {
    // Crop filter
    const matchesCrop = selectedCrop === 'All' || rec.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    // Category filter
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    // Urgency filter
    const matchesUrgency = selectedUrgency === 'All' || rec.urgency === selectedUrgency;
    // Search query
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.crop.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesCategory && matchesUrgency && matchesSearch;
  });

  const getUrgencyBadge = (urgency: FarmingRecommendation['urgency']) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="rose">Critical Action</Badge>;
      case 'recommended':
        return <Badge variant="amber">Recommended</Badge>;
      case 'routine':
        return <Badge variant="emerald">Routine Care</Badge>;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Irrigation Schedule':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'Pest & Disease Control':
        return <Bug className="w-4 h-4 text-rose-500" />;
      case 'Fertilizer & Nutrition':
        return <Leaf className="w-4 h-4 text-emerald-500" />;
      case 'Sowing & Land Prep':
        return <Sprout className="w-4 h-4 text-amber-500" />;
      default:
        return <Sun className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Farming Recommendations & Advisory Engine"
        subtitle={`Precision agronomic protocols, integrated pest management, and seasonal guidance tailored for ${currentRegion.name}`}
        badge={
          <Badge variant="emerald">
            {currentRegion.flag} {currentRegion.country} Station
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-stone-400" />
          <select
            value={currentRegion.id}
            onChange={(e) => setRegionById(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-emerald-500"
          >
            {availableRegions.map(r => (
              <option key={r.id} value={r.id}>
                {r.flag} {r.name}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      {/* Regional Climate & Seasons Context Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRegion.flag}</span>
              <h3 className="font-bold text-base text-emerald-300">
                {currentRegion.name}
              </h3>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Climate Zone: <span className="text-white font-medium">{currentRegion.climateZone}</span> • Land Measurement: <span className="text-white font-medium">{currentRegion.landUnit}</span> • Currency: <span className="text-white font-medium">{currentRegion.currencySymbol} ({currentRegion.currencyCode})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentRegion.farmingSeasons.map((s, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-bold text-emerald-400">{s.name}:</span>{' '}
                <span className="text-stone-300">{s.period}</span>
                <p className="text-[10px] text-stone-400 mt-0.5">{s.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Presets Catalog Quick Strip */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Supported Crop Agronomic Profiles
            </span>
          </div>
          <span className="text-xs text-stone-400">Click a crop to inspect full agronomic benchmark</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CROP_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPresetModal(preset)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 transition-all text-stone-700 dark:text-stone-200"
            >
              <span>🌱 {preset.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-normal">
                {preset.growthDays}d
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crops, pests, fertilizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            <option value="All">All Crops</option>
            {uniqueCrops.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Urgency */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            <option value="All">All Urgency Levels</option>
            <option value="critical">Critical Only</option>
            <option value="recommended">Recommended</option>
            <option value="routine">Routine</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                  {getCategoryIcon(rec.category)}
                  <span>{rec.category}</span>
                </div>
                {getUrgencyBadge(rec.urgency)}
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>🌱 {rec.crop}</span>
                  <span>•</span>
                  <span className="capitalize">{rec.stage} stage</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 line-clamp-3">
                  {rec.description}
                </p>
              </div>

              {/* Action checklist snippet */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 space-y-1.5">
                <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                  Action Steps:
                </div>
                {rec.actionItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
                {rec.actionItems.length > 2 && (
                  <p className="text-[10px] text-stone-400 italic">
                    +{rec.actionItems.length - 2} more action items...
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedRecommendation(rec)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Full Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('/assistance')}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-1"
                  title="Ask agriculture officer about this issue"
                >
                  <LifeBuoy className="w-3 h-3 text-emerald-500" />
                  <span>Request Officer</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRecs.length === 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-12 text-center">
          <Sprout className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            No recommendations match your current criteria
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or reset the crop and category filters.
          </p>
        </div>
      )}

      {/* Full Recommendation Detail Modal */}
      {selectedRecommendation && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecommendation(null)}
          title={selectedRecommendation.title}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald">{selectedRecommendation.crop}</Badge>
              <Badge variant="sky">{selectedRecommendation.category}</Badge>
              {getUrgencyBadge(selectedRecommendation.urgency)}
              <span className="text-xs text-stone-500">
                Recommended for {selectedRecommendation.stage}
              </span>
            </div>

            <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl">
              {selectedRecommendation.description}
            </div>

            {/* Action Items List */}
            <div className="space-y-2">
              <h5 className="font-bold text-xs text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Step-by-Step Field Actions
              </h5>
              <div className="space-y-2">
                {selectedRecommendation.actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Rationale */}
            <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs">
              <h6 className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Agronomic Scientific Rationale
              </h6>
              <p className="text-stone-700 dark:text-stone-300 mt-1">
                {selectedRecommendation.scientificRationale}
              </p>
            </div>

            {/* Organic Alternative if available */}
            {selectedRecommendation.organicAlternative && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
                <h6 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  Eco-Friendly & Organic Protocol
                </h6>
                <p className="text-stone-700 dark:text-stone-300 mt-1">
                  {selectedRecommendation.organicAlternative}
                </p>
              </div>
            )}

            {/* Weather trigger if available */}
            {selectedRecommendation.weatherTrigger && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs">
                <h6 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Meteorological Trigger Warning
                </h6>
                <p className="text-stone-700 dark:text-stone-300 mt-1">
                  {selectedRecommendation.weatherTrigger}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
              >
                Close
              </button>
              {onNavigate && (
                <button
                  onClick={() => {
                    setSelectedRecommendation(null);
                    onNavigate('/crops');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Manage My Crops
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Crop Agronomic Benchmark Modal */}
      {selectedPresetModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPresetModal(null)}
          title={`${selectedPresetModal.name} (${selectedPresetModal.scientificName})`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                <div className="text-[10px] text-stone-500 uppercase font-bold">Growth Cycle</div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedPresetModal.growthDays} Days
                </div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                <div className="text-[10px] text-stone-500 uppercase font-bold">Category</div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedPresetModal.type}
                </div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                <div className="text-[10px] text-stone-500 uppercase font-bold">Irrigation</div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedPresetModal.irrigationMethod}
                </div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                <div className="text-[10px] text-stone-500 uppercase font-bold">Yield Benchmark</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedPresetModal.expectedYieldValue} {selectedPresetModal.yieldUnit}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-800 dark:text-stone-200">Soil Suitability:</div>
              <p className="text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl">
                {selectedPresetModal.optimalSoil}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-800 dark:text-stone-200">Water Requirement:</div>
              <p className="text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl">
                {selectedPresetModal.waterRequirement}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-800 dark:text-stone-200">Critical Growth Stages:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPresetModal.criticalStages.map((stage, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-medium">
                    {idx + 1}. {stage}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-800 dark:text-stone-200">High Risk Pests & Pathogens:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPresetModal.keyPestsAndDiseases.map((pest, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-medium">
                    ⚠️ {pest}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300">
              <span className="font-bold">Agronomist Pro-Tip:</span> {selectedPresetModal.tips}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPresetModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Close Guide
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
