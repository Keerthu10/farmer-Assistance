import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'emerald' | 'amber' | 'sky' | 'purple' | 'orange';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'emerald',
}) => {
  const iconBgMap = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl p-5 shadow-xs transition-all hover:shadow-sm hover:border-emerald-500/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1.5">{value}</p>
          {subtitle && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgMap[colorScheme]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-stone-500 dark:text-stone-400">vs last season</span>
        </div>
      )}
    </div>
  );
};
