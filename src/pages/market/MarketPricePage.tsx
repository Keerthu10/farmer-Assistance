import React, { useEffect, useState } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  TrendingUp, Search, MapPin, Filter, ArrowUpRight, 
  ArrowDownRight, BarChart2, Calendar, RefreshCw, 
  Globe, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { marketApi } from '../../services/api';
import { MarketPrice } from '../../types';
import { useRegion } from '../../context/RegionContext';

export const MarketPricePage: React.FC = () => {
  const { currentRegion, availableRegions, setRegionById } = useRegion();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropTrend, setSelectedCropTrend] = useState<MarketPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        marketApi.getPrices({ search: searchQuery, district: selectedDistrict }),
        marketApi.getDistricts(),
      ]);
      if (pRes.data.success) {
        setPrices(pRes.data.prices);
        if (!selectedCropTrend && pRes.data.prices.length > 0) {
          setSelectedCropTrend(pRes.data.prices[0]);
        }
      }
      if (dRes.data.success) {
        setDistricts(dRes.data.districts);
      }
    } catch (err) {
      console.error('Failed to load market prices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedDistrict, searchQuery]);

  // Top gainer
  const topGainer = prices.slice().sort((a, b) => b.price_change_percent - a.price_change_percent)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commodity Spot Prices & Wholesale Mandi Trends"
        subtitle={`Live wholesale trading rates, mandi auction price spreads, and 30-day commodity price trajectories in ${currentRegion.currencyCode}`}
        badge={
          <Badge variant="emerald">
            {currentRegion.flag} {currentRegion.country} Trade Network
          </Badge>
        }
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Global Region Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={currentRegion.id}
              onChange={(e) => setRegionById(e.target.value)}
              className="bg-transparent font-semibold text-stone-700 dark:text-stone-300 focus:outline-none"
            >
              {availableRegions.map(r => (
                <option key={r.id} value={r.id}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchPrices}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 transition-colors"
            title="Refresh Quotes"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </PageHeader>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Tracked Commodities</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-white mt-0.5 block">
              {prices.length} Active Listings
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Top Monthly Mover</span>
            <span className="text-base font-extrabold text-stone-900 dark:text-white mt-0.5 block truncate max-w-[170px]">
              {topGainer ? `${topGainer.crop_name} (${topGainer.variety})` : 'Stable Market'}
            </span>
          </div>
          {topGainer && (
            <Badge variant={topGainer.price_change_percent >= 0 ? 'emerald' : 'rose'}>
              {topGainer.price_change_percent >= 0 ? `+${topGainer.price_change_percent}%` : `${topGainer.price_change_percent}%`}
            </Badge>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Measurement Standard</span>
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              {currentRegion.currencySymbol} / {currentRegion.weightUnit}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
            <TrendingUp className="w-5 h-5" />
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
            placeholder="Search crop, variety, or yard..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-stone-400" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
          >
            <option value="All">All Agricultural Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive 30-Day Historical Trend Visualizer */}
      {selectedCropTrend && selectedCropTrend.historical_trends && (
        <motion.div
          key={selectedCropTrend.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Historical Price Trajectory (Last 30 Days)
                </span>
                <Badge variant={selectedCropTrend.price_change_percent >= 0 ? 'emerald' : 'rose'}>
                  {selectedCropTrend.price_change_percent >= 0 ? `+${selectedCropTrend.price_change_percent}%` : `${selectedCropTrend.price_change_percent}%`}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                {selectedCropTrend.crop_name} ({selectedCropTrend.variety})
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Yard: {selectedCropTrend.market_name} • Modal Rate: {currentRegion.currencySymbol}{selectedCropTrend.modal_price} / {currentRegion.weightUnit}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block">Today's Trading Range</span>
              <span className="text-sm font-bold text-stone-900 dark:text-white">
                {currentRegion.currencySymbol}{selectedCropTrend.min_price} – {currentRegion.currencySymbol}{selectedCropTrend.max_price}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedCropTrend.historical_trends}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(d) => d.slice(5)} 
                  stroke="#9ca3af" 
                  fontSize={11} 
                />
                <YAxis 
                  domain={['dataMin - 100', 'dataMax + 100']} 
                  stroke="#9ca3af" 
                  fontSize={11} 
                  tickFormatter={(v) => `${currentRegion.currencySymbol}${v}`} 
                />
                <Tooltip
                  formatter={(val: any) => [`${currentRegion.currencySymbol}${val} / ${currentRegion.weightUnit}`, 'Modal Rate']}
                  labelFormatter={(lbl: any) => `Date: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="modal_price" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Commodity Rates Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Daily Mandi Price Board ({prices.length} Records)
          </h3>
          <span className="text-[11px] text-stone-400">
            Click any row to view 30-day analytics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-semibold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="py-3 px-4">Crop & Variety</th>
                <th className="py-3 px-4">Market Yard</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Min Rate</th>
                <th className="py-3 px-4">Max Rate</th>
                <th className="py-3 px-4">Modal Price</th>
                <th className="py-3 px-4">30D Trend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {prices.map((p) => {
                const isSelected = selectedCropTrend?.id === p.id;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedCropTrend(p)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30' 
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        {p.crop_name}
                        <span className="text-[11px] font-normal text-stone-400">({p.variety})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 font-medium">
                      {p.market_name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400">
                      {p.district}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">
                      {currentRegion.currencySymbol}{p.min_price}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">
                      {currentRegion.currencySymbol}{p.max_price}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                      {currentRegion.currencySymbol}{p.modal_price}
                      <span className="text-[10px] text-stone-400 font-normal"> / {currentRegion.weightUnit}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.price_change_percent >= 0 ? 'emerald' : 'rose'}>
                        {p.price_change_percent >= 0 ? `+${p.price_change_percent}%` : `${p.price_change_percent}%`}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCropTrend(p);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
