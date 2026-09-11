import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, Award, Star, MapPin, Phone, 
  Calendar, ShieldCheck, Sprout, Droplets, Layers, ShoppingBag 
} from 'lucide-react';
import { FarmProfile, MarketplaceProduct } from '../../types';
import { INITIAL_FARMS, INITIAL_PRODUCTS } from '../../data/marketplaceData';

interface FarmerProfileModalProps {
  farmerId: number | null;
  onClose: () => void;
  onAddToCart?: (product: MarketplaceProduct, quantity: number) => void;
  currencyFormatter?: (amount: number) => string;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmerId,
  onClose,
  onAddToCart,
  currencyFormatter = (n) => `₹${n.toLocaleString()}`,
}) => {
  if (!farmerId) return null;

  const farm: FarmProfile | undefined = INITIAL_FARMS.find((f) => f.id === farmerId) || INITIAL_FARMS[0];
  const farmerProducts = INITIAL_PRODUCTS.filter((p) => p.farmer_id === farm.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-6"
        >
          {/* Header & Farmer Banner */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={farm.avatar}
                alt={farm.farmer_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                    {farm.farmer_name}
                  </h3>
                  {farm.is_verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Grower
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                  {farm.farm_name}
                </p>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {farm.village}, {farm.district}, {farm.state}, {farm.country}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Farm Bio */}
          {farm.bio && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
              "{farm.bio}"
            </p>
          )}

          {/* Farm Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/70">
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Land Holding</span>
              <span className="text-stone-900 dark:text-white font-extrabold text-sm">{farm.land_area_total} Acres</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/70">
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Soil Profile</span>
              <span className="text-stone-900 dark:text-white font-bold text-xs truncate block" title={farm.primary_soil_type}>
                {farm.primary_soil_type}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/70">
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Irrigation Water</span>
              <span className="text-stone-900 dark:text-white font-bold text-xs truncate block" title={farm.water_source}>
                {farm.water_source}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/70">
              <span className="text-stone-400 text-[10px] block font-bold uppercase">Farmer Rating</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-stone-900 dark:text-white font-extrabold">{farm.rating}</span>
                <span className="text-stone-400 text-[10px]">({farm.total_reviews})</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                  {farm.organic_certified ? 'Certified Organic Agriculture' : 'Good Agricultural Practices (GAP)'}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {farm.certifying_agency || 'Government Audited NPOP Standard'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500">Est. {farm.established_year}</span>
          </div>

          {/* Active Produce from this Farmer */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              Active Fresh Harvests from this Farm ({farmerProducts.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {farmerProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{p.name}</p>
                      <p className="text-[11px] text-emerald-600 font-extrabold">
                        {currencyFormatter(p.price_per_unit)} / {p.unit}
                      </p>
                    </div>
                  </div>
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(p, p.min_order_qty || 1)}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Contact / Guarantee Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 text-xs">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Farm Contact: <strong>{farm.contact_phone}</strong></span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
