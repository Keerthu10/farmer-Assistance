import React, { useEffect, useState } from 'react';
import { 
  Sprout, Plus, Search, Filter, Edit3, Trash2, 
  Calendar, Droplets, MapPin, CheckCircle2, Clock, 
  Layers, AlertCircle, ArrowUpDown, Sparkles, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge, getStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { cropsApi } from '../../services/api';
import { Crop, CropStatus, CropType, IrrigationType, CropPreset } from '../../types';
import { CROP_PRESETS } from '../../data/regionsData';

export const CropManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { currentRegion } = useRegion();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [viewDetailCrop, setViewDetailCrop] = useState<Crop | null>(null);
  const [selectedPresetNotice, setSelectedPresetNotice] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<CropType>('Cereals');
  const [sowingDate, setSowingDate] = useState('');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [landArea, setLandArea] = useState('5.0');
  const [irrigationType, setIrrigationType] = useState<IrrigationType>('Drip Irrigation');
  const [cropStatus, setCropStatus] = useState<CropStatus>('planted');
  const [soilType, setSoilType] = useState('Alluvial Loam');
  const [estimatedYield, setEstimatedYield] = useState('100');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const applyPreset = (preset: CropPreset) => {
    setName(preset.name);
    setType(preset.type);
    const now = new Date();
    setSowingDate(now.toISOString().split('T')[0]);
    const harvest = new Date(now.getTime() + preset.growthDays * 24 * 60 * 60 * 1000);
    setExpectedHarvestDate(harvest.toISOString().split('T')[0]);
    setIrrigationType(preset.irrigationMethod);
    setSoilType(preset.optimalSoil.split('/')[0].trim());
    setEstimatedYield(String(preset.expectedYieldValue));
    setNotes(`${preset.tips} Common pests: ${preset.keyPestsAndDiseases.join(', ')}.`);
    setSelectedPresetNotice(`Applied agronomic benchmark for ${preset.name} (${preset.growthDays} days cycle, ${preset.irrigationMethod})`);
  };

  const fetchCrops = async () => {
    setIsLoading(true);
    try {
      const res = await cropsApi.getCrops();
      if (res.data.success) {
        setCrops(res.data.crops);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const openAddModal = () => {
    setEditingCrop(null);
    setSelectedPresetNotice('');
    setName('');
    setType('Cereals');
    setSowingDate(new Date().toISOString().split('T')[0]);
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + 120);
    setExpectedHarvestDate(harvestDate.toISOString().split('T')[0]);
    setLandArea('4.0');
    setIrrigationType('Drip Irrigation');
    setCropStatus('planted');
    setSoilType('Alluvial Loam');
    setEstimatedYield('80');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setSelectedPresetNotice('');
    setName(crop.name);
    setType(crop.type);
    setSowingDate(crop.sowing_date);
    setExpectedHarvestDate(crop.expected_harvest_date);
    setLandArea(String(crop.land_area));
    setIrrigationType(crop.irrigation_type);
    setCropStatus(crop.crop_status);
    setSoilType(crop.soil_type || 'Alluvial Loam');
    setEstimatedYield(crop.estimated_yield_quintals ? String(crop.estimated_yield_quintals) : '');
    setNotes(crop.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name || !sowingDate || !expectedHarvestDate || !landArea) {
      setFormError('Please fill in all mandatory crop fields.');
      return;
    }

    try {
      const payload: Partial<Crop> = {
        name,
        type,
        sowing_date: sowingDate,
        expected_harvest_date: expectedHarvestDate,
        land_area: Number(landArea),
        irrigation_type: irrigationType,
        crop_status: cropStatus,
        soil_type: soilType,
        estimated_yield_quintals: estimatedYield ? Number(estimatedYield) : undefined,
        notes,
      };

      if (editingCrop) {
        await cropsApi.updateCrop(editingCrop.id, payload);
      } else {
        await cropsApi.addCrop(payload);
      }

      setIsModalOpen(false);
      fetchCrops();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save crop entry');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to remove this crop record?')) {
      try {
        await cropsApi.deleteCrop(id);
        fetchCrops();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || crop.crop_status === statusFilter;
    const matchesType = typeFilter === 'All' || crop.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAcres = filteredCrops.reduce((sum, c) => sum + (Number(c.land_area) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Management & Sowing Registry"
        subtitle="Monitor growth cycles, schedule irrigation methods, and track anticipated harvest milestones"
        badge={<Badge variant="emerald">{filteredCrops.length} Registered Crops</Badge>}
      >
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop Entry</span>
        </button>
      </PageHeader>

      {/* Regional Agronomy Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
            {currentRegion.flag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-100">{currentRegion.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-[10px] font-semibold text-emerald-300">
                Active Agro Station
              </span>
            </div>
            <p className="text-emerald-200/80 text-[11px] mt-0.5">
              Primary Season: {currentRegion.currentSeason} • Land Unit: {currentRegion.landUnit} • Agro-Climatic Zone: {currentRegion.climateZone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-emerald-800/80 pt-2 md:pt-0 md:pl-4 shrink-0">
          <div>
            <span className="text-[10px] text-emerald-300/80 uppercase tracking-wider block">Cultivated Land</span>
            <span className="font-bold text-base text-white">{totalAcres.toFixed(1)} {currentRegion.landUnit}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300/80 uppercase tracking-wider block">Registered Plots</span>
            <span className="font-bold text-base text-emerald-300">{filteredCrops.length} Crops</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop name or variety..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
          >
            <option value="All">All Stages</option>
            <option value="planted">Planted</option>
            <option value="vegetative">Vegetative</option>
            <option value="flowering">Flowering</option>
            <option value="harvesting">Harvesting</option>
            <option value="completed">Completed</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
          >
            <option value="All">All Crop Types</option>
            <option value="Cereals">Cereals</option>
            <option value="Pulses">Pulses</option>
            <option value="Cash Crops">Cash Crops</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Oilseeds">Oilseeds</option>
            <option value="Horticulture">Horticulture</option>
          </select>
        </div>
      </div>

      {/* Grid of Crop Cards */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-stone-400 text-xs">
          <Sprout className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
          <p className="font-semibold text-stone-700 dark:text-stone-300">No crops match your filter criteria.</p>
          <p className="mt-1">Try clearing filters or click "Add Crop Entry" to log a new plot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCrops.map(crop => {
            const today = new Date();
            const harvest = new Date(crop.expected_harvest_date);
            const daysLeft = Math.ceil((harvest.getTime() - today.getTime()) / (1000 * 3600 * 24));

            return (
              <div
                key={crop.id}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {crop.type}
                      </span>
                      <h3 className="font-bold text-base text-stone-900 dark:text-white mt-0.5">
                        {crop.name}
                      </h3>
                      {crop.farmer_name && user?.role !== 'farmer' && (
                        <p className="text-[11px] text-stone-400">Farmer: {crop.farmer_name}</p>
                      )}
                    </div>
                    {getStatusBadge(crop.crop_status)}
                  </div>

                  {/* Attributes */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Cultivated Land</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{crop.land_area} {currentRegion.landUnit}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Irrigation System</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 truncate block">{crop.irrigation_type}</span>
                    </div>
                  </div>

                  {/* Harvest Countdown */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>Expected Harvest</span>
                      </div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                        {daysLeft > 0 ? `${daysLeft} days remaining` : 'Harvest Window Active'}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                      Target Date: {new Date(crop.expected_harvest_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {crop.notes && (
                    <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 italic">
                      "{crop.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewDetailCrop(crop)}
                    className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(crop)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Edit Crop"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(crop.id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Crop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCrop ? 'Edit Crop Record' : 'Register New Crop'}
        subtitle="Specify crop taxonomy, sowing timeline, irrigation method, and projected yield"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
              {formError}
            </div>
          )}

          {/* 1-Click Agronomic Presets for Fast Crop Registration */}
          {!editingCrop && (
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Agronomic Presets</span>
                </div>
                <span className="text-[10px] text-stone-400">Auto-sets growth cycle, irrigation & soil</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {CROP_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 text-[11px] font-medium shrink-0 transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <span>🌱</span>
                    <span>{preset.name}</span>
                    <span className="text-[9px] text-stone-400">({preset.growthDays}d)</span>
                  </button>
                ))}
              </div>
              {selectedPresetNotice && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60 font-medium">
                  ✓ {selectedPresetNotice}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Crop Name / Variety *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharbati Durum Wheat, Pusa 1121 Paddy"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Crop Category *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CropType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Cereals">Cereals</option>
                <option value="Pulses">Pulses</option>
                <option value="Cash Crops">Cash Crops</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Oilseeds">Oilseeds</option>
                <option value="Horticulture">Horticulture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Sowing Date *
              </label>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Expected Harvest Date *
              </label>
              <input
                type="date"
                required
                value={expectedHarvestDate}
                onChange={(e) => setExpectedHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Land Area ({currentRegion.landUnit}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Irrigation Type *
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Canal Flood">Canal Flood</option>
                <option value="Tube Well">Tube Well</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Current Growth Status *
              </label>
              <select
                value={cropStatus}
                onChange={(e) => setCropStatus(e.target.value as CropStatus)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="planted">Planted</option>
                <option value="vegetative">Vegetative</option>
                <option value="flowering">Flowering</option>
                <option value="harvesting">Harvesting</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Primary Soil Type
              </label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="e.g. Alluvial Loam, Black Clay, Sandy Loam"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Estimated Yield ({currentRegion.weightUnit})
              </label>
              <input
                type="number"
                value={estimatedYield}
                onChange={(e) => setEstimatedYield(e.target.value)}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Field Observations & Agronomy Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record seed certification batch, fertilizer split dosing schedule, or bio-fungicide details..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              {editingCrop ? 'Update Crop Record' : 'Save & Register Crop'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Crop Detail Modal */}
      {viewDetailCrop && (
        <Modal
          isOpen={!!viewDetailCrop}
          onClose={() => setViewDetailCrop(null)}
          title={`Crop Profile: ${viewDetailCrop.name}`}
          subtitle={`Registered on ${new Date(viewDetailCrop.created_at).toLocaleDateString()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold">Crop Stage</span>
                <p className="text-base font-bold capitalize text-stone-900 dark:text-white mt-0.5">{viewDetailCrop.crop_status}</p>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold">Estimated Yield</span>
                <p className="text-base font-bold text-stone-900 dark:text-white mt-0.5">{viewDetailCrop.estimated_yield_quintals || '—'} Quintals</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Sowing Date</span>
                <span className="font-bold text-stone-900 dark:text-white">{viewDetailCrop.sowing_date}</span>
              </div>
              <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Expected Harvest</span>
                <span className="font-bold text-stone-900 dark:text-white">{viewDetailCrop.expected_harvest_date}</span>
              </div>
              <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Cultivated Area</span>
                <span className="font-bold text-stone-900 dark:text-white">{viewDetailCrop.land_area} Acres</span>
              </div>
              <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px]">Irrigation Method</span>
                <span className="font-bold text-stone-900 dark:text-white">{viewDetailCrop.irrigation_type}</span>
              </div>
            </div>

            {viewDetailCrop.notes && (
              <div className="p-3 border border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="text-stone-400 block text-[10px] mb-1">Agronomy Notes & Record</span>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{viewDetailCrop.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
