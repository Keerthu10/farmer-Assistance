import React, { useState } from 'react';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('farmer@agroassist.gov.in');
  const [password, setPassword] = useState('farmer123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await login({ email, password });
    setIsLoading(false);
    if (res.success) {
      onNavigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickLogin = async (role: 'farmer' | 'officer' | 'admin') => {
    setIsLoading(true);
    await switchDemoRole(role);
    setIsLoading(false);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-md pointer-events-none" />
          <div className="inline-flex p-3 rounded-2xl bg-white/15 backdrop-blur-xs mb-3 shadow-xs">
            <Sprout className="w-8 h-8 text-emerald-200" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">AgroAssist Portal</h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Empowering Farmers with Modern Agritech Services
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agroassist.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to AgroAssist'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Evaluator Demo Sign-In:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('farmer')}
                className="p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-100 transition-colors text-center"
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('officer')}
                className="p-2 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 text-[11px] font-semibold hover:bg-sky-100 transition-colors text-center"
              >
                🔬 Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-[11px] font-semibold hover:bg-purple-100 transition-colors text-center"
              >
                🏛️ Admin
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Register Farmer / Officer
              </button>
            </div>
            <button
              onClick={() => onNavigate('/landing')}
              className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors pt-1"
            >
              ← Back to Platform Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
