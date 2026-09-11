import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MapPin, Sparkles, Sprout, 
  ShieldCheck, Award, Clock, ArrowUpDown, ChevronRight, 
  ShoppingBag, CheckCircle2, Star, Eye, Layers, Compass, 
  SlidersHorizontal, Check, RefreshCw 
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_PRODUCTS, INITIAL_FARMS, MARKET_DEMAND_TRENDS } from '../../data/marketplaceData';
import { MarketplaceProduct, ProduceCategory } from '../../types';
import { ProductTraceModal } from '../../components/marketplace/ProductTraceModal';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { FarmerProfileModal } from '../../components/marketplace/FarmerProfileModal';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES: ProduceCategory[] = [
  'Vegetables',
  'Fruits',
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Herbs & Spices',
  'Cash Crops',
  'Dairy & Honey',
];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const { currentRegion, availableRegions, setRegion, formatCurrency } = useRegion();
  const { addToCart, openCart } = useCart();
  const { user } = useAuth();

  // Region Cascading Filter
  const [selectedCountry, setSelectedCountry] = useState<string>(currentRegion.country || 'India');
  const [selectedState, setSelectedState] = useState<string>(currentRegion.defaultState || 'Punjab');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentRegion.defaultDistrict || 'Ludhiana');
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | 'all'>('all');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'freshness' | 'price-asc' | 'price-desc' | 'rating'>('freshness');
  const [activeTraceProduct, setActiveTraceProduct] = useState<MarketplaceProduct | null>(null);
  const [viewingFarmerId, setViewingFarmerId] = useState<number | null>(null);

  // Available countries derived from configured regions
  const countries = useMemo(() => {
    const list = Array.from(new Set(availableRegions.map((r) => r.country)));
    return list.length > 0 ? list : ['India', 'United States', 'Kenya'];
  }, [availableRegions]);

  // Available states for chosen country
  const states = useMemo(() => {
    const matching = availableRegions.filter((r) => r.country === selectedCountry);
    const set = new Set<string>();
    matching.forEach((r) => {
      if (r.states) {
        r.states.forEach((s) => set.add(s.name));
      } else if (r.defaultState) {
        set.add(r.defaultState);
      }
    });
    return Array.from(set);
  }, [selectedCountry, availableRegions]);

  // Available districts for chosen state
  const districts = useMemo(() => {
    const matching = availableRegions.find((r) => r.country === selectedCountry);
    if (!matching || !matching.states) return [selectedDistrict];
    const foundState = matching.states.find((s) => s.name === selectedState);
    return foundState ? foundState.districts : [matching.defaultDistrict];
  }, [selectedCountry, selectedState, availableRegions, selectedDistrict]);

  // Nearby Farmers for selected district/state
  const nearbyFarmers = useMemo(() => {
    return INITIAL_FARMS.filter(
      (f) => f.country === selectedCountry && (f.state === selectedState || f.district === selectedDistrict)
    );
  }, [selectedCountry, selectedState, selectedDistrict]);

  // Smart Recommendations: Highly fresh or local crops
  const smartRecommendations = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => p.rating >= 4.9 || p.is_organic).slice(0, 4);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => {
      // Country match
      if (selectedCountry && p.farm_location.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        // Fallback: If no products in that foreign region yet, allow all to keep UI rich
        const hasCountryProduce = INITIAL_PRODUCTS.some(
          (ip) => ip.farm_location.country.toLowerCase() === selectedCountry.toLowerCase()
        );
        if (hasCountryProduce) return false;
      }

      // District / Farmer filter if specific farmer chosen
      if (selectedFarmerId !== 'all' && p.farmer_id !== selectedFarmerId) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.crop_category !== selectedCategory) {
        return false;
      }

      // Organic filter
      if (organicOnly && !p.is_organic) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCategory = p.crop_category.toLowerCase().includes(query);
        const matchFarmer = p.farmer_name.toLowerCase().includes(query);
        const matchFarm = p.farm_name.toLowerCase().includes(query);
        const matchDistrict = p.farm_location.district.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchFarmer && !matchFarm && !matchDistrict) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'freshness') {
        return new Date(b.harvest_date).getTime() - new Date(a.harvest_date).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.price_per_unit - b.price_per_unit;
      }
      if (sortBy === 'price-desc') {
        return b.price_per_unit - a.price_per_unit;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [selectedCountry, selectedFarmerId, selectedCategory, organicOnly, searchQuery, sortBy]);

  const handleCountryChange = (c: string) => {
    setSelectedCountry(c);
    const reg = availableRegions.find((r) => r.country === c);
    if (reg) {
      setRegion(reg.id);
      setSelectedState(reg.defaultState);
      setSelectedDistrict(reg.defaultDistrict);
      setSelectedFarmerId('all');
    }
  };

  return (
    <div className="space-y-6">

      {/* Hero Welcome & Value Proposition Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Farm-to-Customer Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
            Fresh Produce Straight from Verified Farms to Your Door.
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            Zero middlemen. Farmers earn up to <strong>35% more</strong> than mandi rates, while customers, restaurants, and wholesalers save <strong>15–25%</strong> on harvest-fresh produce.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-200 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Protected Payment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-200 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-amber-400" />
              <span>100% Traceable Harvest Batches</span>
            </div>
          </div>
        </div>

        {/* Decorative graphic element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-teal-600 to-transparent" />
        </div>
      </div>

      {/* REGION CASCADING SELECTOR (Country -> State -> District -> Nearby Farmers) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                Region-Based Farming Marketplace
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Filter local harvest produce from verified farmers near you
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedFarmerId('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setOrganicOnly(false);
            }}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Cascading Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* 1. Country */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">
              1. Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 2. State */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">
              2. State / Province
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedFarmerId('all');
              }}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {states.length > 0 ? (
                states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))
              ) : (
                <option value={selectedState}>{selectedState}</option>
              )}
            </select>
          </div>

          {/* 3. District */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">
              3. District / County
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedFarmerId('all');
              }}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 4. Nearby Farmers */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">
              4. Nearby Verified Farms ({nearbyFarmers.length})
            </label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Farms in Region ({nearbyFarmers.length})</option>
              {nearbyFarmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.farmer_name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SMART RECOMMENDATIONS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">
              Smart Recommendations: In-Season & High Freshness
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            Algorithmic match for {selectedDistrict}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {smartRecommendations.map((prod) => (
            <div
              key={`rec-${prod.id}`}
              onClick={() => setActiveTraceProduct(prod)}
              className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
            >
              <img
                src={prod.image_url}
                alt={prod.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    {prod.freshness_label}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-stone-900 dark:text-white truncate">
                  {prod.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-extrabold text-stone-900 dark:text-white">
                    {formatCurrency(prod.price_per_unit)} <span className="text-[10px] text-stone-400 font-normal">/ {prod.unit}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    Direct
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH, CATEGORY TABS & SORT CONTROLS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search crops, vegetables, grains, or farms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Quick Filters: Organic Toggle & Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                organicOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certified Organic</span>
              {organicOnly && <Check className="w-3 h-3" />}
            </button>

            <div className="flex items-center gap-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-stone-700 dark:text-stone-300 font-medium focus:ring-0 text-xs py-0"
              >
                <option value="freshness">Freshest Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
            }`}
          >
            All Produce ({INITIAL_PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = INITIAL_PRODUCTS.filter((p) => p.crop_category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                }`}
              >
                {cat} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCE LISTINGS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
          <Sprout className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="font-extrabold text-stone-800 dark:text-stone-200 text-base">
            No produce found matching criteria
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your category or organic filters, or expand your district search to view harvests from nearby districts.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOrganicOnly(false);
              setSelectedFarmerId('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
          >
            Show All Available Harvests
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencyFormatter={formatCurrency}
              onAddToCart={(prod, qty) => addToCart(prod, qty)}
              onTrace={(prod) => setActiveTraceProduct(prod)}
              onOpenFarmer={(fId) => setViewingFarmerId(fId)}
            />
          ))}
        </div>
      )}

      {/* Traceability Modal */}
      <ProductTraceModal
        product={activeTraceProduct}
        onClose={() => setActiveTraceProduct(null)}
      />

      {/* Farmer Profile & Full Harvests Modal */}
      <FarmerProfileModal
        farmerId={viewingFarmerId}
        onClose={() => setViewingFarmerId(null)}
        onAddToCart={(prod, qty) => addToCart(prod, qty)}
        currencyFormatter={formatCurrency}
      />

    </div>
  );
};
