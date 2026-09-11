import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 py-6 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 dark:text-stone-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-stone-700 dark:text-stone-300">AgroAssist Digital Farmer Service</span>
          <span>•</span>
          <span>Ministry of Agriculture & Farmers Welfare</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MySQL 8.0 & JWT Encrypted
          </span>
          <span>•</span>
          <span>v2.4 Production Build</span>
        </div>
      </div>
    </footer>
  );
};
