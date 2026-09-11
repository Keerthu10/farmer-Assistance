import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegionConfig } from '../types';
import { GLOBAL_REGIONS } from '../data/regionsData';

interface RegionContextType {
  currentRegion: RegionConfig;
  setRegionById: (id: string) => void;
  availableRegions: RegionConfig[];
  formatCurrency: (amount: number) => string;
  formatLand: (area: number) => string;
  formatWeight: (amount: number) => string;
  formatTemp: (celsius: number) => string;
  tempUnit: '°C' | '°F';
  toggleTempUnit: () => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const normalizeRegion = (r: RegionConfig): RegionConfig => ({
  ...r,
  helpline: r.helpline || {
    name: r.helplineName || 'Kisan Agricultural Extension Desk',
    contact: r.helplineContact || '1800-180-1551',
  },
});

const NORMALIZED_GLOBAL_REGIONS: RegionConfig[] = GLOBAL_REGIONS.map(normalizeRegion);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRegion, setCurrentRegion] = useState<RegionConfig>(() => {
    const saved = localStorage.getItem('agroassist_region_id');
    const match = NORMALIZED_GLOBAL_REGIONS.find(r => r.id === saved);
    return match || NORMALIZED_GLOBAL_REGIONS[0];
  });

  const [tempUnit, setTempUnit] = useState<'°C' | '°F'>(currentRegion.tempUnit);

  useEffect(() => {
    localStorage.setItem('agroassist_region_id', currentRegion.id);
    setTempUnit(currentRegion.tempUnit);
  }, [currentRegion]);

  const setRegionById = (id: string) => {
    const found = NORMALIZED_GLOBAL_REGIONS.find(r => r.id === id);
    if (found) {
      setCurrentRegion(found);
    }
  };

  const toggleTempUnit = () => {
    setTempUnit(prev => (prev === '°C' ? '°F' : '°C'));
  };

  const formatCurrency = (amount: number): string => {
    return `${currentRegion.currencySymbol} ${amount.toLocaleString()}`;
  };

  const formatLand = (area: number): string => {
    return `${area} ${currentRegion.landUnit}`;
  };

  const formatWeight = (amount: number): string => {
    return `${amount} ${currentRegion.weightUnit}`;
  };

  const formatTemp = (celsius: number): string => {
    if (tempUnit === '°F') {
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  return (
    <RegionContext.Provider
      value={{
        currentRegion,
        setRegionById,
        availableRegions: NORMALIZED_GLOBAL_REGIONS,
        formatCurrency,
        formatLand,
        formatWeight,
        formatTemp,
        tempUnit,
        toggleTempUnit,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
