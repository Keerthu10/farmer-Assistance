import React, { useEffect, useState } from 'react';
import { 
  Sprout, CloudSun, TrendingUp, LifeBuoy, PlusCircle, 
  Calendar, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2, 
  Droplet, Wind, RefreshCw, Sparkles, Globe 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge, getStatusBadge } from '../../components/common/Badge';
import { cropsApi, weatherApi, marketApi, assistanceApi } from '../../services/api';
import { Crop, WeatherData, MarketPrice, AssistanceRequest } from '../../types';
import { FARMING_RECOMMENDATIONS } from '../../data/regionsData';

interface FarmerDashboardProps {
  onNavigate: (path: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { currentRegion } = useRegion();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cropsRes, weatherRes, marketRes, assistRes] = await Promise.all([
        cropsApi.getCrops(),
        weatherApi.getWeather(user?.district || 'Ludhiana'),
        marketApi.getPrices(),
        assistanceApi.getRequests(),
      ]);

      if (cropsRes.data.success) setCrops(cropsRes.data.crops);
      if (weatherRes.data.success) setWeather(weatherRes.data.weather);
      if (marketRes.data.success) setMarketPrices(marketRes.data.prices.slice(0, 4));
      if (assistRes.data.success) setAssistanceRequests(assistRes.data.requests);
    } catch (err) {
      console.error('Failed to load farmer dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.district]);

  const totalAcres = crops.reduce((acc, c) => acc + (Number(c.land_area) || 0), 0);
  const activeCrops = crops.filter(c => c.crop_status !== 'completed');
  const pendingAssistance = assistanceRequests.filter(r => r.status === 'Pending' || r.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'Farmer'}`}
        subtitle={`${user?.village ? user.village + ', ' : ''}${user?.district || 'Ludhiana'}, ${user?.state || 'Punjab'} • Kharif & Rabi Season Operations`}
        badge={
          <Badge variant="emerald" size="md">
            Verified Farmer Account
          </Badge>
        }
      >
        <button
          onClick={() => onNavigate('/crops')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Crop</span>
        </button>
        <button
          onClick={() => onNavigate('/assistance')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 transition-colors"
        >
          <LifeBuoy className="w-4 h-4 text-emerald-600" />
          <span>Raise Ticket</span>
        </button>
      </PageHeader>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Crops Cultivated"
          value={activeCrops.length}
          subtitle={`${crops.length} total seasonal registrations`}
          icon={Sprout}
          colorScheme="emerald"
        />
        <StatCard
          title="Total Cultivated Land"
          value={`${totalAcres.toFixed(1)} ${currentRegion.landUnit}`}
          subtitle={`Profile capacity: ${profile?.land_area_total || 14.5} ${currentRegion.landUnit}`}
          icon={Calendar}
          colorScheme="sky"
        />
        <StatCard
          title="Live Temperature"
          value={weather ? `${weather.temperature}°C` : '31°C'}
          subtitle={weather ? `${weather.condition}` : 'Partly Cloudy'}
          icon={CloudSun}
          colorScheme="amber"
        />
        <StatCard
          title="Assistance Tickets"
          value={pendingAssistance.length}
          subtitle={`${assistanceRequests.filter(r => r.status === 'Resolved').length} resolved by officer`}
          icon={LifeBuoy}
          colorScheme="purple"
        />
      </div>

      {/* Weather Snapshot + Agro Advisory Alert */}
      {weather && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-amber-300" />
                <span className="font-bold text-sm tracking-wide uppercase text-emerald-200">
                  Agri-Meteorological Advisory • {weather.district}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-emerald-50 max-w-3xl leading-relaxed">
                "{weather.agri_advisory}"
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div>
                <p className="text-emerald-200 text-[10px]">Precipitation</p>
                <p className="font-bold text-white text-sm">{weather.rain_prediction}% Chance</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-emerald-200 text-[10px]">Humidity</p>
                <p className="font-bold text-white text-sm">{weather.humidity}%</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-emerald-200 text-[10px]">Wind Velocity</p>
                <p className="font-bold text-white text-sm">{weather.wind_speed} km/h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Crops Overview & Current Season Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Active Crops Table */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Active Crops & Growth Stages</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Real-time status tracking and harvest scheduling</p>
            </div>
            <button
              onClick={() => onNavigate('/crops')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {crops.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              No crop records registered yet. Click "Add New Crop" above to start tracking.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-stone-400 uppercase text-[10px] font-bold border-b border-stone-100 dark:border-stone-800 pb-2">
                    <th className="pb-2.5">Crop Name</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Area</th>
                    <th className="pb-2.5">Irrigation</th>
                    <th className="pb-2.5">Stage</th>
                    <th className="pb-2.5 text-right">Harvest Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {crops.slice(0, 4).map(crop => (
                    <tr key={crop.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 font-semibold text-stone-900 dark:text-white">
                        {crop.name}
                      </td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">
                        {crop.type}
                      </td>
                      <td className="py-3 text-stone-900 dark:text-stone-200 font-medium">
                        {crop.land_area} {currentRegion.landUnit}
                      </td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">
                        {crop.irrigation_type}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(crop.crop_status)}
                      </td>
                      <td className="py-3 text-right font-medium text-stone-700 dark:text-stone-300">
                        {new Date(crop.expected_harvest_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Current Season Activities & Timeline */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Seasonal Activities Calendar</h3>
              <Badge variant="amber">Rabi Transition</Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    1
                  </div>
                  <div className="w-0.5 flex-1 bg-stone-200 dark:bg-stone-800 my-1" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-white">Wheat Foliar Spray Window</p>
                  <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                    Recommended Propiconazole prophylactic spray before flag leaf emergence.
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">Due in 2 days</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold text-[10px]">
                    2
                  </div>
                  <div className="w-0.5 flex-1 bg-stone-200 dark:bg-stone-800 my-1" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-white">Mustard Harvest Preparation</p>
                  <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                    Siliqua pods turning yellow-brown. Ready for swathing within 10 days.
                  </p>
                  <span className="text-[10px] text-sky-600 font-medium">Target: Mar 20</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold text-[10px]">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-bold text-stone-900 dark:text-white">PMFBY Claim Verification</p>
                  <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                    District Agriculture Officer scheduled village survey for localized hail damage.
                  </p>
                  <span className="text-[10px] text-stone-400 font-medium">Pending survey</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/knowledge')}
            className="w-full mt-4 py-2 px-3 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
          >
            <span>Read Season Agronomy Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Regional Agronomy Advisory & Protection Hub Widget */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  Regional Agronomy Advisory & Support
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <span>{currentRegion.flag}</span>
                  <span>{currentRegion.name}</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Targeted protocols for pest management, irrigation scheduling, and soil fertilization
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/recommendations')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 self-start sm:self-center transition-colors"
          >
            <span>View All Regional Protocols</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {FARMING_RECOMMENDATIONS.filter(r => r.regionId === currentRegion.id || r.regionId === 'in').slice(0, 3).map(rec => (
            <div
              key={rec.id}
              onClick={() => onNavigate('/recommendations')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-emerald-400 bg-stone-50/50 dark:bg-stone-800/40 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    🌱 {rec.crop}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                    {rec.category}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-stone-800 dark:text-stone-200 line-clamp-1">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {rec.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[10px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {rec.stage}
                </span>
                <span className="text-stone-400">Read Protocol →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Prices Ticker Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Daily Mandi Trade Ticker</h3>
            <span className="text-[11px] text-stone-400">({user?.district || 'Ludhiana'} & Nearby Yards)</span>
          </div>
          <button
            onClick={() => onNavigate('/market')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Explore all commodities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {marketPrices.map(item => (
            <div
              key={item.id}
              onClick={() => onNavigate('/market')}
              className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 hover:border-emerald-400 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-stone-900 dark:text-white">{item.crop_name}</span>
                <span className={`text-[11px] font-bold ${item.price_change_percent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {item.price_change_percent >= 0 ? `+${item.price_change_percent}%` : `${item.price_change_percent}%`}
                </span>
              </div>
              <p className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                ₹{item.modal_price.toLocaleString()} <span className="text-xs font-normal text-stone-400">/ Quintal</span>
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">{item.market_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
