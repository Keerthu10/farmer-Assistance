import React, { useEffect, useState } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  CloudSun, Droplets, Wind, Umbrella, Sun, 
  Compass, AlertTriangle, CheckCircle2, MapPin, 
  RefreshCw, CloudRain, CloudLightning, ShieldCheck, 
  Sparkles, Globe 
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { weatherApi } from '../../services/api';
import { WeatherData } from '../../types';
import { useRegion } from '../../context/RegionContext';

export const WeatherPage: React.FC = () => {
  const { currentRegion, availableRegions, setRegionById } = useRegion();
  const [district, setDistrict] = useState(currentRegion.defaultDistrict || 'Ludhiana');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync district when region changes
  useEffect(() => {
    if (currentRegion.defaultDistrict) {
      setDistrict(currentRegion.defaultDistrict);
    }
  }, [currentRegion.id]);

  const fetchWeather = async (targetDistrict: string) => {
    setIsLoading(true);
    try {
      const res = await weatherApi.getWeather(targetDistrict);
      if (res.data.success) {
        setWeather(res.data.weather);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('thunder')) return <CloudLightning className="w-8 h-8 text-amber-400" />;
    if (c.includes('rain') || c.includes('showers')) return <CloudRain className="w-8 h-8 text-sky-400" />;
    if (c.includes('cloud')) return <CloudSun className="w-8 h-8 text-amber-300" />;
    return <Sun className="w-8 h-8 text-amber-400" />;
  };

  const getSprayAdvisory = () => {
    if (!weather) return null;
    const isWindy = weather.wind_speed > 15;
    const isRainingSoon = weather.rain_prediction > 40;

    if (isRainingSoon) {
      return {
        allowed: false,
        level: 'Do Not Spray',
        reason: `High precipitation probability (${weather.rain_prediction}%). Foliar chemical washes off, wasting input and causing runoff.`,
        badgeVariant: 'rose' as const,
      };
    }

    if (isWindy) {
      return {
        allowed: false,
        level: 'High Drift Warning',
        reason: `Wind speed exceeds 15 km/h (${weather.wind_speed} km/h). Severe pesticide droplet drift into adjacent water bodies or non-target crops.`,
        badgeVariant: 'amber' as const,
      };
    }

    return {
      allowed: true,
      level: 'Optimal Spray Window',
      reason: `Calm wind (${weather.wind_speed} km/h), moderate humidity (${weather.humidity}%), and low rain probability. Safe for foliar bio-fertilizer and pesticide applications.`,
      badgeVariant: 'emerald' as const,
    };
  };

  const sprayAdvisory = getSprayAdvisory();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meteorological Advisory & Climate Intelligence"
        subtitle={`Real-time atmospheric readings, precipitation risk, and field spray timing for ${district} (${currentRegion.name})`}
        badge={
          <Badge variant="sky">
            {currentRegion.flag} {currentRegion.country} Agro-Met Station
          </Badge>
        }
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={currentRegion.id}
              onChange={(e) => setRegionById(e.target.value)}
              className="bg-transparent font-medium text-stone-700 dark:text-stone-300 focus:outline-none"
            >
              {availableRegions.map(r => (
                <option key={r.id} value={r.id}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* District selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-transparent font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              {currentRegion.districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchWeather(district)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 transition-colors"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </PageHeader>

      <AnimatePresence mode="wait">
        {weather && (
          <motion.div
            key={weather.district}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Current Weather Hero Card */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Live Telemetry
                    </span>
                    <span className="text-xs text-emerald-200">
                      Station: {weather.district}, {weather.state || currentRegion.name}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4 mt-4">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight">
                      {weather.temperature}{currentRegion.tempUnit}
                    </span>
                    <div className="flex items-center gap-2 text-emerald-100 font-semibold text-lg">
                      {getWeatherIcon(weather.condition)}
                      <span>{weather.condition}</span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-200/90 mt-2">
                    Updated {weather.last_updated} • Air Quality Index: <strong>{weather.air_quality}</strong>
                  </p>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <Droplets className="w-5 h-5 mx-auto text-sky-200 mb-1" />
                    <p className="text-[10px] uppercase text-emerald-200 font-bold">Relative Humidity</p>
                    <p className="text-base font-bold text-white mt-0.5">{weather.humidity}%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <Umbrella className="w-5 h-5 mx-auto text-teal-200 mb-1" />
                    <p className="text-[10px] uppercase text-emerald-200 font-bold">Rain Chance</p>
                    <p className="text-base font-bold text-white mt-0.5">{weather.rain_prediction}%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <Wind className="w-5 h-5 mx-auto text-amber-200 mb-1" />
                    <p className="text-[10px] uppercase text-emerald-200 font-bold">Wind Speed</p>
                    <p className="text-base font-bold text-white mt-0.5">{weather.wind_speed} km/h</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <Sun className="w-5 h-5 mx-auto text-amber-300 mb-1" />
                    <p className="text-[10px] uppercase text-emerald-200 font-bold">Solar UV Index</p>
                    <p className="text-base font-bold text-white mt-0.5">{weather.uv_index}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Spray & Chemical Application Advisory */}
            {sprayAdvisory && (
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
                sprayAdvisory.allowed 
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    sprayAdvisory.allowed 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}>
                    {sprayAdvisory.allowed ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        Pesticide & Foliar Spray Advisory
                      </h4>
                      <Badge variant={sprayAdvisory.badgeVariant}>
                        {sprayAdvisory.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {sprayAdvisory.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Agronomic Weather Advisory */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Agricultural Extension Climate Advisory
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  {weather.agri_advisory}
                </p>
              </div>
            </div>

            {/* 7-Day Extended Forecast */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  7-Day Meteorological Trajectory & Rainfall Risk
                </h3>
                <span className="text-[11px] text-stone-400 font-medium">
                  Refreshes every 4 hours
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weather.forecast.map((day, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                      idx === 0
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-stone-900 dark:text-white block">{day.day}</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>

                      <div className="my-3 flex justify-center">
                        {getWeatherIcon(day.condition)}
                      </div>

                      <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 leading-tight">
                        {day.condition}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-700/60">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-900 dark:text-white">
                        <span>{day.max_temp}{currentRegion.tempUnit}</span>
                        <span className="text-stone-400 font-normal">/ {day.min_temp}°</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
                        <Umbrella className="w-3 h-3" />
                        <span>{day.rain_prob}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
