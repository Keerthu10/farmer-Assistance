import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, Award, Clock, Star, MapPin, Eye, ShoppingBag, 
  Check, Phone, CheckCircle2, ShieldCheck, Heart 
} from 'lucide-react';
import { MarketplaceProduct } from '../../types';

export interface ProductCardProps {
  product: Partial<MarketplaceProduct> & {
    productName?: string;
  };
  onAddToCart?: (product: MarketplaceProduct, quantity: number) => void;
  onTrace?: (product: MarketplaceProduct) => void;
  onOpenFarmer?: (farmerId: number) => void;
  currencyFormatter?: (amount: number) => string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onTrace,
  onOpenFarmer,
  currencyFormatter = (amt: number) => `₹${amt.toLocaleString()}`,
}) => {
  const [selectedQty, setSelectedQty] = useState(product.min_order_qty || 1);
  const [isLiked, setIsLiked] = useState(false);
  const [showDirectContact, setShowDirectContact] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Normalize product name to support both `name` and `productName` (as in test spec)
  const displayName = product.productName || product.name || 'Fresh Produce';
  const displayCategory = product.crop_category || 'Vegetables';
  const displayPrice = product.price_per_unit || 40;
  const displayUnit = product.unit || 'kg';
  const displayRating = product.rating || 4.8;
  const displayReviews = product.review_count || 12;
  const displayLocation = product.farm_location 
    ? `${product.farm_location.village}, ${product.farm_location.district}`
    : 'Ludhiana, Punjab';
  const displayFarmer = product.farmer_name || 'Ramesh Kumar';
  const displayFarm = product.farm_name || 'Green Valley Organic Farm';

  const savingsPercent = product.retail_supermarket_price
    ? Math.round(((product.retail_supermarket_price - displayPrice) / product.retail_supermarket_price) * 100)
    : 28;

  const farmerBonusPercent = product.mandi_benchmark_price
    ? Math.round(((displayPrice - product.mandi_benchmark_price) / product.mandi_benchmark_price) * 100)
    : 35;

  const handleAdd = () => {
    if (onAddToCart && product.id) {
      onAddToCart(product as MarketplaceProduct, selectedQty);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-xl transition-shadow flex flex-col justify-between overflow-hidden group"
      data-testid="product-card"
    >
      {/* Produce Image & Top Floating Badges */}
      <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80'}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{product.freshness_label || 'Freshly Harvested Today'}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {product.is_organic && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600/95 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                <Award className="w-3 h-3" />
                <span>Certified Organic</span>
              </span>
            )}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-1.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:text-rose-500 transition-colors"
              title="Save to Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Direct Farmer Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div 
            onClick={() => onOpenFarmer && product.farmer_id && onOpenFarmer(product.farmer_id)}
            className="flex items-center gap-2 cursor-pointer group/farmer hover:underline"
          >
            <img
              src={product.farmer_avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
              alt={displayFarmer}
              className="w-7 h-7 rounded-full border border-white/60 object-cover"
            />
            <div className="text-left">
              <p className="text-[11px] font-bold leading-tight flex items-center gap-1">
                {displayFarmer}
                {product.farmer_verified !== false && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                )}
              </p>
              <p className="text-[9px] text-white/80 truncate max-w-[140px]">{displayFarm}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{displayRating}</span>
            <span className="text-white/60 text-[9px]">({displayReviews})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {displayCategory}
              </span>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white leading-snug">
                {displayName}
              </h3>
            </div>
            {product.batch_number && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500">
                {product.batch_number}
              </span>
            )}
          </div>

          {/* Location & Soil */}
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{displayLocation}</span>
          </div>

          {product.description && (
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Value comparison metrics */}
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-emerald-800 dark:text-emerald-300 font-bold block">
                Save {savingsPercent}% vs Retail
              </span>
              <span className="text-[10px] text-stone-500">Bypasses commission agents</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold block">
                +{farmerBonusPercent}%
              </span>
              <span className="text-[10px] text-stone-500">Farmer Profit Margin</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-black text-stone-900 dark:text-white">
                {currencyFormatter(displayPrice)}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {' '}/ {displayUnit}
              </span>
              {product.retail_supermarket_price && (
                <span className="ml-2 text-xs text-stone-400 line-through">
                  {currencyFormatter(product.retail_supermarket_price)}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">
                {product.quantity_available || 100} {displayUnit} available
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-2 py-1 text-xs">
              <span className="text-stone-400 text-[10px] mr-1">Qty:</span>
              <select
                value={selectedQty}
                onChange={(e) => setSelectedQty(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-stone-800 dark:text-stone-200 border-none focus:ring-0 p-0"
              >
                {[1, 2, 5, 10, 20, 50].map((qty) => (
                  <option key={qty} value={qty}>
                    {qty} {displayUnit}
                  </option>
                ))}
              </select>
            </div>

            {/* Traceability Modal Trigger */}
            {onTrace && product.id && (
              <button
                type="button"
                onClick={() => onTrace(product as MarketplaceProduct)}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="View Harvest Origin & Batch QR Traceability"
                aria-label="Inspect Batch Traceability"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
