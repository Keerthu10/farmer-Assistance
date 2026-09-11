import React, { useState } from 'react';
import { 
  X, QrCode, ShieldCheck, MapPin, Calendar, 
  Clock, Award, Droplet, Sprout, Truck, 
  MessageSquare, Phone, CheckCircle2, User, Share2 
} from 'lucide-react';
import { MarketplaceProduct } from '../../types';
import { useRegion } from '../../context/RegionContext';
import { useCart } from '../../context/CartContext';

interface ProductTraceModalProps {
  product: MarketplaceProduct | null;
  onClose: () => void;
}

export const ProductTraceModal: React.FC<ProductTraceModalProps> = ({ product, onClose }) => {
  const { formatCurrency } = useRegion();
  const { addToCart } = useCart();
  const [inquirySent, setInquirySent] = useState<boolean>(false);
  const [inquiryText, setInquiryText] = useState<string>('');
  const [showDirectContact, setShowDirectContact] = useState<boolean>(false);

  if (!product) return null;

  const harvestDateObj = new Date(product.harvest_date);
  const formattedHarvestDate = harvestDateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryText('');
      setShowDirectContact(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header with Cover & Product Details */}
        <div className="relative h-48 bg-stone-900 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Farm-to-Fork Verified
                </span>
                {product.is_organic && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3" />
                    {product.organic_cert_name || '100% Certified Organic'}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {product.name}
              </h2>
              {product.scientific_name && (
                <p className="text-xs text-stone-300 italic">
                  {product.scientific_name}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-stone-300 block">Direct Farm Rate</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {formatCurrency(product.price_per_unit)}
                <span className="text-xs font-normal text-stone-300"> / {product.unit}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(85vh-12rem)] overflow-y-auto space-y-6">

          {/* Farmer & Farm Identity Row */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={product.farmer_avatar}
                alt={product.farmer_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {product.farmer_name}
                  </h4>
                  {product.farmer_verified && (
                    <span className="text-emerald-600 dark:text-emerald-400" title="Verified Land & KYC Records">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {product.farm_name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>
                    {product.farm_location.village}, {product.farm_location.district}, {product.farm_location.state}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDirectContact(!showDirectContact)}
              className="px-3 py-2 rounded-xl border border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Farmer</span>
            </button>
          </div>

          {/* Direct Farmer Inquiry Box */}
          {showDirectContact && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Ask Farmer {product.farmer_name} Directly:
                </span>
                <span className="text-[10px] text-emerald-600 font-normal">Typical reply: &lt; 30 mins</span>
              </div>

              {inquirySent ? (
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-emerald-300 text-center text-xs text-emerald-700 font-bold">
                  Inquiry dispatched directly to {product.farmer_name}'s mobile!
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-2">
                  <textarea
                    rows={2}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="E.g., Can you harvest 50kg extra for Friday delivery? What is the brix sweetness?"
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDirectContact(false)}
                      className="px-3 py-1.5 rounded-lg border text-stone-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Farm-to-Fork Traceability Grid */}
          <div>
            <h4 className="font-extrabold text-stone-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Full Agricultural Traceability Parameters</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                  Harvest Date
                </span>
                <p className="font-extrabold text-stone-900 dark:text-white text-xs">
                  {formattedHarvestDate}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
                  {product.freshness_label}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" />
                  Soil Composition
                </span>
                <p className="font-extrabold text-stone-900 dark:text-white text-xs truncate" title={product.soil_type}>
                  {product.soil_type}
                </p>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Natural nutrient balance
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-cyan-600" />
                  Water Source
                </span>
                <p className="font-extrabold text-stone-900 dark:text-white text-xs truncate" title={product.water_source}>
                  {product.water_source}
                </p>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Tested safe pH & salinity
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-600" />
                  Estimated Delivery
                </span>
                <p className="font-extrabold text-stone-900 dark:text-white text-xs">
                  {product.delivery_estimate_days === 1 ? 'Same-day / Next Morning' : `${product.delivery_estimate_days} Days via Cold Transit`}
                </p>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Direct from farm gate
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-600" />
                  Farm Shelf-Life
                </span>
                <p className="font-extrabold text-stone-900 dark:text-white text-xs">
                  {product.shelf_life_days} Days
                </p>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Zero chemical wax coating
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  Batch ID Number
                </span>
                <p className="font-mono font-bold text-stone-900 dark:text-white text-xs">
                  {product.batch_number}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                  Cryptographically Tracked
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Transparency Visualizer */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
            <h4 className="font-extrabold text-xs text-stone-900 dark:text-white flex items-center justify-between">
              <span>Transparent Price Breakdown (Eliminating Middlemen)</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                Win-Win Direct Model
              </span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block">Mandi Broker Price</span>
                <span className="font-bold text-stone-500 line-through">
                  {formatCurrency(product.mandi_benchmark_price)}
                </span>
                <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">Farmer receives less</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
                <span className="text-[10px] text-emerald-100 font-bold block uppercase tracking-wide">Direct Platform Rate</span>
                <span className="font-extrabold text-base">
                  {formatCurrency(product.price_per_unit)}
                </span>
                <span className="text-[10px] text-emerald-100 font-semibold block mt-0.5">100% directly to farmer</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block">Supermarket Retail</span>
                <span className="font-bold text-stone-500">
                  {formatCurrency(product.retail_supermarket_price)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                  You save {Math.round(((product.retail_supermarket_price - product.price_per_unit) / product.retail_supermarket_price) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Description & Agronomy Notes */}
          <div>
            <h4 className="font-extrabold text-stone-900 dark:text-white text-xs uppercase tracking-wider mb-2">
              Harvest & Taste Profile
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>

        {/* Bottom CTA Action Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Available Harvest Stock</span>
            <span className="text-sm font-extrabold text-stone-900 dark:text-white">
              {product.quantity_available} {product.unit} <span className="text-xs text-emerald-600 font-normal">ready for dispatch</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                addToCart(product, product.min_order_qty || 1);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-colors flex items-center gap-2"
            >
              <span>Add to Cart ({formatCurrency(product.price_per_unit)})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
