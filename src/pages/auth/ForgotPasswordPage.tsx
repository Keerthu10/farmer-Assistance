import React, { useState } from 'react';
import { Sprout, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../services/api';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; token?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await authApi.forgotPassword(email);
      setSuccessInfo({ message: res.data.message, token: res.data.recovery_token });
    } catch (err: any) {
      setError('Failed to initiate password reset. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white text-center">
          <div className="inline-flex p-3 rounded-2xl bg-white/15 mb-2">
            <Sprout className="w-7 h-7 text-emerald-200" />
          </div>
          <h2 className="text-xl font-bold">Reset Your Password</h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Enter your registered email to receive an instant verification PIN
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {successInfo ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reset Authorization Issued</span>
                </div>
                <p className="leading-relaxed">{successInfo.message}</p>
                <div className="mt-3 p-2.5 bg-white dark:bg-stone-900 rounded-lg border border-emerald-300 dark:border-emerald-700 font-mono text-center font-bold text-sm text-stone-900 dark:text-white">
                  Recovery OTP: 849201
                </div>
              </div>

              <button
                onClick={() => onNavigate('/login')}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Return to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@agroassist.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Instructions...' : 'Request Password Reset'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
