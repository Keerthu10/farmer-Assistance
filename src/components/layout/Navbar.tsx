import React, { useState } from 'react';
import { 
  Sprout, Bell, Moon, Sun, LogOut, ChevronDown, 
  User as UserIcon, Shield, Layers, HelpCircle, CheckCircle2,
  Globe, ShoppingBag, Store 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useRegion } from '../../context/RegionContext';
import { useCart } from '../../context/CartContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenDocs: () => void;
  onOpenFlows?: () => void;
  onToggleSidebarMobile: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDocs, onOpenFlows, onToggleSidebarMobile, onNavigate }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { currentRegion, setRegionById, availableRegions } = useRegion();
  const { totalCount, openCart } = useCart();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'farmer': return 'Farmer';
      case 'customer': return 'Buyer / Customer';
      case 'officer': return 'Agri Officer';
      case 'admin': return 'System Admin';
      default: return 'Guest';
    }
  };

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'farmer': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300';
      case 'customer': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 border-teal-300';
      case 'officer': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 border-sky-300';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border-purple-300';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div 
            onClick={() => onNavigate ? onNavigate('/dashboard') : undefined}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            title="Go to Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-emerald-900 dark:text-emerald-400">
                  AgroAssist
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Gov Services
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                Digital Farmer Assistance Web Service
              </p>
            </div>
          </div>
        </div>

        {/* Right: Role Switcher, Specs Button, Notifs, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Farm Marketplace Direct Button */}
          <button
            onClick={() => onNavigate && onNavigate('/marketplace')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
            title="Browse Direct Farm-to-Customer Marketplace"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>

          {/* Cart Trigger Drawer Button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200/80 dark:border-stone-700"
            aria-label="Open Shopping Cart"
            title="View Cart & Direct Checkout"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm animate-pulse min-w-[18px] text-center">
                {totalCount}
              </span>
            )}
          </button>

          {/* Architecture & Deliverables Specs Button */}
          <button
            onClick={onOpenDocs}
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
            title="View full architecture, MySQL DDL, and ER diagrams"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>

          {/* User Flows Visualizer Button */}
          {onOpenFlows && (
            <button
              onClick={onOpenFlows}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-300 dark:border-sky-800/80 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 transition-colors"
              title="Interactive User Flows: Farmer, Customer, and Admin"
            >
              <span>User Flows</span>
            </button>
          )}

          {/* Global Region & Country Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegionMenu(!showRegionMenu);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:border-emerald-400 transition-all"
              title="Change country / regional agricultural station"
            >
              <span>{currentRegion.flag}</span>
              <span className="hidden sm:inline font-medium">{currentRegion.country}</span>
              <span className="text-[10px] text-stone-400">({currentRegion.currencySymbol})</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRegionMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in">
                <div className="px-2.5 py-1.5 font-bold text-stone-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Adapt Region / Country</span>
                  <Globe className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {availableRegions.map(reg => (
                    <button
                      key={reg.id}
                      onClick={() => {
                        setRegionById(reg.id);
                        setShowRegionMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors ${
                        currentRegion.id === reg.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-700 dark:text-emerald-300'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{reg.flag}</span>
                        <div>
                          <p className="font-semibold text-[11px] leading-tight">{reg.name}</p>
                          <p className="text-[10px] text-stone-400 font-normal">
                            {reg.currencyCode} ({reg.currencySymbol}) • {reg.landUnit} • {reg.tempUnit}
                          </p>
                        </div>
                      </div>
                      {currentRegion.id === reg.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifMenu(false);
                  setShowUserMenu(false);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${getRoleBadgeColor(user.role)}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role:</span> {getRoleLabel(user.role)}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in">
                  <div className="px-2.5 py-1.5 font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                    Quick Role Switcher (Demo)
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('farmer');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors ${
                      user.role === 'farmer' ? 'font-bold text-emerald-700 dark:text-emerald-300' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>🌾 Farmer (Ramesh Kumar)</span>
                    {user.role === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('customer');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors ${
                      user.role === 'customer' ? 'font-bold text-teal-700 dark:text-teal-300' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>🛒 Buyer / Restaurant (GreenTable)</span>
                    {user.role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('officer');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors ${
                      user.role === 'officer' ? 'font-bold text-sky-700 dark:text-sky-300' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>🔬 Agriculture Officer (Dr. Sunita)</span>
                    {user.role === 'officer' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors ${
                      user.role === 'admin' ? 'font-bold text-purple-700 dark:text-purple-300' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>🏛️ System Admin (Vikramaditya)</span>
                    {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Notifications Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 mb-2">
                    <span className="font-bold text-xs text-stone-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            n.is_read
                              ? 'border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400'
                              : 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">{n.title}</span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile & Logout */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowRoleMenu(false);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 hidden md:inline">
                  {(user.name || 'User').split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="font-bold text-stone-900 dark:text-white">{user.name || 'User'}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{user.district}, {user.state}</p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenDocs();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 mt-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Specs & Architecture
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Sign In
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
