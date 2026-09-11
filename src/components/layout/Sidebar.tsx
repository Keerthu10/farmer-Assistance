import React from 'react';
import { 
  LayoutDashboard, Sprout, CloudSun, TrendingUp, 
  Landmark, LifeBuoy, BookOpen, ShieldAlert, Users, 
  FileSpreadsheet, Sparkles, Globe, Store, PackagePlus, 
  PackageCheck, ShoppingBag, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const { currentRegion } = useRegion();
  const role = user?.role || 'farmer';

  const customerNavItems = [
    { label: 'Farm Marketplace', path: '/marketplace', icon: Store },
    { label: 'My Orders & Trace', path: '/orders', icon: PackageCheck },
    { label: 'AI Agronomy & Quality', path: '/ai-agronomy', icon: Sparkles },
    { label: 'Live Weather Forecast', path: '/weather', icon: CloudSun },
    { label: 'Knowledge & Nutrition', path: '/knowledge', icon: BookOpen },
    { label: 'Customer Support Desk', path: '/assistance', icon: LifeBuoy },
  ];

  const farmerNavItems = [
    { label: 'Farmer Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Direct Marketplace', path: '/marketplace', icon: Store },
    { label: 'My Produce & Inventory', path: '/farmer-products', icon: PackagePlus },
    { label: 'Direct Farm Orders', path: '/orders', icon: PackageCheck },
    { label: 'AI Yield & Pricing Suite', path: '/ai-agronomy', icon: Sparkles },
    { label: 'My Crops & Fields', path: '/crops', icon: Sprout },
    { label: 'Farming Advisory & Recs', path: '/recommendations', icon: Sparkles },
    { label: 'Live Weather & Forecast', path: '/weather', icon: CloudSun },
    { label: 'Mandi Market Prices', path: '/market', icon: TrendingUp },
    { label: 'Government Schemes', path: '/schemes', icon: Landmark },
    { label: 'Expert Assistance', path: '/assistance', icon: LifeBuoy },
    { label: 'Knowledge Center', path: '/knowledge', icon: BookOpen },
  ];

  const officerNavItems = [
    { label: 'Officer Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Farm Verification & Audit', path: '/admin-marketplace', icon: ShieldCheck },
    { label: 'Assistance Requests Queue', path: '/assistance', icon: LifeBuoy },
    { label: 'District Crops Directory', path: '/crops', icon: Sprout },
    { label: 'AI Yield & Agronomy Suite', path: '/ai-agronomy', icon: Sparkles },
    { label: 'Farming Recommendations', path: '/recommendations', icon: Sparkles },
    { label: 'Weather Forecast & Alerts', path: '/weather', icon: CloudSun },
    { label: 'Mandi Price Monitor', path: '/market', icon: TrendingUp },
    { label: 'Agri Advisory & Guides', path: '/knowledge', icon: BookOpen },
  ];

  const adminNavItems = [
    { label: 'Admin Analytics Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Marketplace & Escrow Desk', path: '/admin-marketplace', icon: ShieldCheck },
    { label: 'All Orders & Supply Chain', path: '/orders', icon: PackageCheck },
    { label: 'Browse Public Marketplace', path: '/marketplace', icon: Store },
    { label: 'Farmer & Officer Directory', path: '/admin-users', icon: Users },
    { label: 'Government Schemes Control', path: '/schemes', icon: Landmark },
    { label: 'National Crop Registry', path: '/crops', icon: Sprout },
    { label: 'AI Agronomy Protocols', path: '/ai-agronomy', icon: Sparkles },
    { label: 'Assistance Oversight', path: '/assistance', icon: LifeBuoy },
    { label: 'Mandi Market Registry', path: '/market', icon: TrendingUp },
    { label: 'Knowledge Hub', path: '/knowledge', icon: BookOpen },
  ];

  const navItems = role === 'admin' 
    ? adminNavItems 
    : role === 'customer'
      ? customerNavItems
      : role === 'officer' 
        ? officerNavItems 
        : farmerNavItems;

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-stone-900 border-r border-stone-200/80 dark:border-stone-800 transition-transform duration-200 flex flex-col justify-between shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleItemClick('/landing')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold mb-2 transition-all text-left ${
              currentPath === '/landing'
                ? 'bg-stone-800 text-white dark:bg-stone-700'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Platform Overview</span>
          </button>

          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            {role === 'admin' ? 'Administration Portal' : role === 'officer' ? 'Department Desk' : 'Farmer Workspace'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path === '/admin-users' && currentPath === '/admin');
            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-emerald-50/70 dark:hover:bg-stone-800/80 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Agricultural Helpline Widget */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentRegion.flag} {currentRegion.helplineName}</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
              Agro Advisory & Emergency Helpline:
            </p>
            <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
              📞 {currentRegion.helplineContact}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
