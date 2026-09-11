import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Sprout, ShieldCheck, 
  TrendingUp, Award, Calendar, Clock, DollarSign, 
  CheckCircle2, X, AlertCircle, Eye, Image as ImageIcon,
  Check, Store, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { INITIAL_PRODUCTS, INITIAL_FARMS } from '../../data/marketplaceData';
import { MarketplaceProduct, ProduceCategory } from '../../types';

interface FarmerProductsPageProps {
  onNavigate: (path: string) => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wheat Grain', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bell Peppers', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coconuts', url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=800&q=80' },
  { label: 'Raw Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  { label: 'Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mustard Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Strawberries', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80' },
];

export const FarmerProductsPage: React.FC<FarmerProductsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { currentRegion, formatCurrency } = useRegion();

  const [products, setProducts] = useState<MarketplaceProduct[]>(() => {
    try {
      const saved = localStorage.getItem('agroassist_farmer_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ProduceCategory>('Vegetables');
  const [formQuantity, setFormQuantity] = useState<number>(500);
  const [formUnit, setFormUnit] = useState<'kg' | 'quintal' | 'crate (20kg)' | 'bag (50kg)'>('kg');
  const [formPrice, setFormPrice] = useState<number>(45);
  const [formMandiPrice, setFormMandiPrice] = useState<number>(30);
  const [formRetailPrice, setFormRetailPrice] = useState<number>(65);
  const [formHarvestDate, setFormHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formIsOrganic, setFormIsOrganic] = useState<boolean>(true);
  const [formOrganicCert, setFormOrganicCert] = useState<string>('India Organic (NPOP)');
  const [formImageUrl, setFormImageUrl] = useState<string>(SAMPLE_IMAGE_PRESETS[0].url);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formShelfLife, setFormShelfLife] = useState<number>(7);
  const [formSoilType, setFormSoilType] = useState<string>('Alluvial Loam Rich in Humus');
  const [formWaterSource, setFormWaterSource] = useState<string>('Solar Drip Irrigation');

  // Filter farmer products
  // If user is farmer, show products matching user.id or default farmer id = 1
  const farmerId = user?.id || 1;
  const myProducts = products.filter((p) => p.farmer_id === farmerId || p.farmer_id === 1);

  // Metrics
  const totalStockKg = myProducts.reduce((sum, p) => sum + p.quantity_available, 0);
  const totalPotentialRevenue = myProducts.reduce((sum, p) => sum + p.quantity_available * p.price_per_unit, 0);
  const activeCount = myProducts.filter((p) => p.in_stock).length;

  const saveProductsToStorage = (updated: MarketplaceProduct[]) => {
    setProducts(updated);
    localStorage.setItem('agroassist_farmer_products', JSON.stringify(updated));
  };

  const handleOpenAddModal = (existing?: MarketplaceProduct) => {
    if (existing) {
      setEditingProductId(existing.id);
      setFormName(existing.name);
      setFormCategory(existing.crop_category);
      setFormQuantity(existing.quantity_available);
      setFormUnit(existing.unit as any);
      setFormPrice(existing.price_per_unit);
      setFormMandiPrice(existing.mandi_benchmark_price);
      setFormRetailPrice(existing.retail_supermarket_price);
      setFormHarvestDate(existing.harvest_date.split('T')[0]);
      setFormIsOrganic(existing.is_organic);
      setFormOrganicCert(existing.organic_cert_name || 'India Organic (NPOP)');
      setFormImageUrl(existing.image_url);
      setFormDescription(existing.description);
      setFormShelfLife(existing.shelf_life_days);
      setFormSoilType(existing.soil_type);
      setFormWaterSource(existing.water_source);
    } else {
      setEditingProductId(null);
      setFormName('');
      setFormCategory('Vegetables');
      setFormQuantity(500);
      setFormUnit('kg');
      setFormPrice(45);
      setFormMandiPrice(30);
      setFormRetailPrice(65);
      setFormHarvestDate(new Date().toISOString().split('T')[0]);
      setFormIsOrganic(true);
      setFormOrganicCert('India Organic (NPOP)');
      setFormImageUrl(SAMPLE_IMAGE_PRESETS[0].url);
      setFormDescription('Freshly harvested today from our zero-chemical organic plots. Hand-graded for restaurants and retail buyers.');
      setFormShelfLife(7);
      setFormSoilType('Alluvial Loam Rich in Humus');
      setFormWaterSource('Solar Drip Irrigation');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProductId) {
      const updated = products.map((p) => {
        if (p.id !== editingProductId) return p;
        return {
          ...p,
          name: formName,
          crop_category: formCategory,
          quantity_available: formQuantity,
          unit: formUnit,
          price_per_unit: formPrice,
          mandi_benchmark_price: formMandiPrice,
          retail_supermarket_price: formRetailPrice,
          harvest_date: `${formHarvestDate}T06:00:00Z`,
          is_organic: formIsOrganic,
          organic_cert_name: formIsOrganic ? formOrganicCert : undefined,
          image_url: formImageUrl,
          description: formDescription,
          shelf_life_days: formShelfLife,
          soil_type: formSoilType,
          water_source: formWaterSource,
          in_stock: formQuantity > 0,
        };
      });
      saveProductsToStorage(updated);
    } else {
      const newProduct: MarketplaceProduct = {
        id: Date.now(),
        farmer_id: farmerId,
        farm_name: 'Green Valley Organic Heritage Farm',
        farmer_name: user?.name || 'Ramesh Kumar',
        farmer_avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
        farmer_verified: true,
        name: formName,
        crop_category: formCategory,
        quantity_available: formQuantity,
        unit: formUnit,
        price_per_unit: formPrice,
        mandi_benchmark_price: formMandiPrice,
        retail_supermarket_price: formRetailPrice,
        harvest_date: `${formHarvestDate}T06:00:00Z`,
        freshness_label: 'Freshly Listed Harvest',
        is_organic: formIsOrganic,
        organic_cert_name: formIsOrganic ? formOrganicCert : undefined,
        farm_location: {
          village: 'Samrala Kalan',
          district: currentRegion.defaultDistrict || 'Ludhiana',
          state: currentRegion.defaultState || 'Punjab',
          country: currentRegion.country || 'India',
        },
        image_url: formImageUrl,
        shelf_life_days: formShelfLife,
        min_order_qty: 2,
        batch_number: `GV-${formCategory.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        soil_type: formSoilType,
        water_source: formWaterSource,
        delivery_estimate_days: 1,
        description: formDescription,
        rating: 5.0,
        review_count: 0,
        in_stock: true,
        created_at: new Date().toISOString(),
      };
      saveProductsToStorage([newProduct, ...products]);
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this product listing from the public marketplace?')) {
      const updated = products.filter((p) => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  const handleToggleStock = (id: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, in_stock: !p.in_stock } : p
    );
    saveProductsToStorage(updated);
  };

  const handleUpdateStockQty = (id: number, delta: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const nextQty = Math.max(0, p.quantity_available + delta);
        return { ...p, quantity_available: nextQty, in_stock: nextQty > 0 };
      }
      return p;
    });
    saveProductsToStorage(updated);
  };

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>Farm Direct Producer Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            My Farm Produce & Inventory
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Publish harvest lots directly to consumers, restaurants, and wholesalers without middlemen
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/marketplace')}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            View Live Marketplace
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Harvest Lot</span>
          </button>
        </div>
      </div>

      {/* Farm Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Active Harvest Listings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              {myProducts.length} Lots
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Total Inventory Volume
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {totalStockKg.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400 font-bold">
              kg in storage
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Direct Farm Revenue Value
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalPotentialRevenue)}
            </span>
            <span className="text-[10px] text-teal-600 font-semibold">
              100% Escrow protected
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Average Customer Rating
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-500">
              4.92 ★
            </span>
            <span className="text-xs text-stone-400 font-bold">
              81 Verified Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
          Active Produce Catalog ({myProducts.length})
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {myProducts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {p.crop_category}
                    </span>
                    {p.is_organic && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Organic
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {p.in_stock ? 'Active on Market' : 'Paused / Out of Stock'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-white truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Harvested: {new Date(p.harvest_date).toLocaleDateString()} • Batch #{p.batch_number}
                  </p>
                </div>
              </div>

              {/* Pricing & Stock Operations */}
              <div className="flex flex-wrap items-center gap-6 text-xs w-full md:w-auto justify-between md:justify-end">
                {/* Price Display */}
                <div>
                  <span className="text-[10px] text-stone-400 block">Direct Price</span>
                  <span className="font-extrabold text-stone-900 dark:text-white text-base">
                    {formatCurrency(p.price_per_unit)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    +{formatCurrency(p.price_per_unit - p.mandi_benchmark_price)} vs Mandi
                  </span>
                </div>

                {/* Stock Controls */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Stock Level</span>
                  <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => handleUpdateStockQty(p.id, -25)}
                      className="px-1 font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
                      title="-25 units"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-stone-900 dark:text-white min-w-[50px] text-center">
                      {p.quantity_available} {p.unit}
                    </span>
                    <button
                      onClick={() => handleUpdateStockQty(p.id, +25)}
                      className="px-1 font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
                      title="+25 units"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStock(p.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      p.in_stock
                        ? 'border border-stone-200 dark:border-stone-700 text-stone-600 hover:bg-stone-50'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {p.in_stock ? 'Pause' : 'Resume'}
                  </button>

                  <button
                    onClick={() => handleOpenAddModal(p)}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-600 dark:text-stone-300"
                    title="Edit Listing"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in">
            
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
                    {editingProductId ? 'Edit Produce Listing' : 'List New Harvest on Marketplace'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Direct listing with instant buyer reach and full batch traceability
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="p-6 space-y-4 max-h-[calc(85vh-8rem)] overflow-y-auto text-xs">
              
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Produce / Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Heirloom Vine Cherry Tomatoes"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Crop Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProduceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Cereals">Cereals & Grains</option>
                    <option value="Pulses">Pulses & Legumes</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                    <option value="Cash Crops">Cash Crops</option>
                    <option value="Dairy & Honey">Dairy & Honey</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Standard Unit *
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal (100 kg)</option>
                    <option value="crate (20kg)">Crate (20 kg)</option>
                    <option value="bag (50kg)">Bag (50 kg)</option>
                  </select>
                </div>
              </div>

              {/* Transparent Pricing Grid (Direct Price, Mandi Benchmark, Retail Supermarket) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  Transparent Pricing Setup (Win-Win Formula)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-600 dark:text-stone-300 mb-1">
                      Your Direct Price ({currentRegion.currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-900 font-extrabold text-emerald-700 dark:text-emerald-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 dark:text-stone-300 mb-1">
                      Local Mandi Broker Benchmark
                    </label>
                    <input
                      type="number"
                      value={formMandiPrice}
                      onChange={(e) => setFormMandiPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 dark:text-stone-300 mb-1">
                      Retail Supermarket Rate
                    </label>
                    <input
                      type="number"
                      value={formRetailPrice}
                      onChange={(e) => setFormRetailPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Harvest Date & Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Harvest Date & Time *
                  </label>
                  <input
                    type="date"
                    required
                    value={formHarvestDate}
                    onChange={(e) => setFormHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Natural Shelf Life (Days) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formShelfLife}
                    onChange={(e) => setFormShelfLife(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Organic Certification */}
              <div className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Is this produce certified organic / chemical-free?
                  </span>
                  <input
                    type="checkbox"
                    checked={formIsOrganic}
                    onChange={(e) => setFormIsOrganic(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>

                {formIsOrganic && (
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Certifying Agency / Standard
                    </label>
                    <input
                      type="text"
                      value={formOrganicCert}
                      onChange={(e) => setFormOrganicCert(e.target.value)}
                      placeholder="E.g., India Organic NPOP, OneCert Asia, PGS-India"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Soil & Water details for Farm-to-Fork Traceability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Soil Type
                  </label>
                  <input
                    type="text"
                    value={formSoilType}
                    onChange={(e) => setFormSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Irrigation Water Source
                  </label>
                  <input
                    type="text"
                    value={formWaterSource}
                    onChange={(e) => setFormWaterSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Product Image (Select Preset or Custom URL)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`p-1 rounded-xl border shrink-0 transition-all ${
                        formImageUrl === preset.url
                          ? 'border-emerald-600 ring-2 ring-emerald-500'
                          : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-[10px] block mt-0.5 truncate max-w-[50px]">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom image URL"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-colors"
                >
                  {editingProductId ? 'Update Listing' : 'Publish Harvest Lot'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
