import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { RegionProvider } from './context/RegionContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { CartDrawer } from './components/marketplace/CartDrawer';

// Public Landing Page
import { LandingPage } from './pages/landing/LandingPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Main Application Pages
import { FarmerDashboard } from './pages/dashboard/FarmerDashboard';
import { OfficerDashboard } from './pages/dashboard/OfficerDashboard';
import { CropManagementPage } from './pages/crops/CropManagementPage';
import { FarmingRecommendationsPage } from './pages/recommendations/FarmingRecommendationsPage';
import { WeatherPage } from './pages/weather/WeatherPage';
import { MarketPricePage } from './pages/market/MarketPricePage';
import { SchemesPage } from './pages/schemes/SchemesPage';
import { AssistanceRequestsPage } from './pages/assistance/AssistanceRequestsPage';
import { KnowledgeCenterPage } from './pages/knowledge/KnowledgeCenterPage';
import { AdminPanelPage } from './pages/admin/AdminPanelPage';

// Marketplace & AI Agronomy Pages
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { FarmerProductsPage } from './pages/marketplace/FarmerProductsPage';
import { OrdersPage } from './pages/marketplace/OrdersPage';
import { AIAgronomyPage } from './pages/ai/AIAgronomyPage';
import { AdminMarketplacePage } from './pages/admin/AdminMarketplacePage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/marketplace');

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
          Initializing AgroAssist Farm Marketplace Gateway...
        </p>
      </div>
    );
  }

  // Public Landing Page (accessible both when logged in or out)
  if (currentPath === '/landing') {
    return <LandingPage onNavigate={navigate} />;
  }

  // If not authenticated and on auth pages
  if (!isAuthenticated) {
    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }
    return <LoginPage onNavigate={navigate} />;
  }

  // Active view router based on user role and path
  const renderContent = () => {
    switch (currentPath) {
      case '/dashboard':
        if (user?.role === 'customer') {
          return <MarketplacePage onNavigate={navigate} />;
        }
        if (user?.role === 'officer') {
          return <OfficerDashboard onNavigate={navigate} />;
        }
        if (user?.role === 'admin') {
          return <AdminPanelPage />;
        }
        return <FarmerDashboard onNavigate={navigate} />;

      // Farm-to-Customer Marketplace & Orders
      case '/marketplace':
        return <MarketplacePage onNavigate={navigate} />;

      case '/farmer-products':
        return <FarmerProductsPage onNavigate={navigate} />;

      case '/orders':
        return <OrdersPage onNavigate={navigate} />;

      // AI Agronomy Suite
      case '/ai-agronomy':
        return <AIAgronomyPage onNavigate={navigate} />;

      // Admin Marketplace Oversight
      case '/admin-marketplace':
        return <AdminMarketplacePage />;

      case '/crops':
        return <CropManagementPage />;

      case '/recommendations':
        return <FarmingRecommendationsPage onNavigate={navigate} />;

      case '/weather':
        return <WeatherPage />;

      case '/market':
        return <MarketPricePage />;

      case '/schemes':
        return <SchemesPage />;

      case '/assistance':
        return <AssistanceRequestsPage />;

      case '/knowledge':
        return <KnowledgeCenterPage />;

      case '/admin':
      case '/admin-users':
        return <AdminPanelPage />;

      default:
        return <MarketplacePage onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentPath={currentPath} onNavigate={navigate}>
      {renderContent()}
      <CartDrawer onNavigate={navigate} />
    </Layout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RegionProvider>
          <NotificationProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </NotificationProvider>
        </RegionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
