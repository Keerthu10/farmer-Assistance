import React, { useEffect, useState } from 'react';
import { 
  Users, Shield, Landmark, Bell, BarChart3, 
  Plus, CheckCircle2, XCircle, Search, Trash2, 
  Send, Sparkles, AlertTriangle, Layers 
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { adminApi, schemesApi } from '../../services/api';
import { User, Scheme, UserRole } from '../../types';

export const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'schemes' | 'broadcast'>('analytics');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'farmers' | 'officers'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Scheme Create Modal state
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [schemeMinistry, setSchemeMinistry] = useState('Ministry of Agriculture & Farmers Welfare');
  const [schemeCategory, setSchemeCategory] = useState('Financial Support');
  const [schemeDesc, setSchemeDesc] = useState('');
  const [schemeBenefits, setSchemeBenefits] = useState('');
  const [schemeEligibility, setSchemeEligibility] = useState('');
  const [schemeDocs, setSchemeDocs] = useState('');
  const [schemeProcess, setSchemeProcess] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [sRes, uRes, schRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        schemesApi.getSchemes(),
      ]);
      if (sRes.data.success) setStats(sRes.data.stats);
      if (uRes.data.success) setUsers(uRes.data.users);
      if (schRes.data.success) setSchemes(schRes.data.schemes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await adminApi.updateUserStatus(userId, !currentStatus);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.sendBroadcast({
        title: broadcastTitle,
        message: broadcastMessage,
        target_role: broadcastTarget,
      });
      setBroadcastSent(true);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setTimeout(() => setBroadcastSent(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schemesApi.createScheme({
        name: schemeName,
        ministry: schemeMinistry,
        category: schemeCategory,
        description: schemeDesc,
        benefits: schemeBenefits,
        eligibility: schemeEligibility.split('\n').filter(Boolean),
        required_documents: schemeDocs.split(',').map(s => s.trim()).filter(Boolean),
        application_process: schemeProcess,
        is_active: true,
      });
      setIsSchemeModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="National Central Administration Portal"
        subtitle="Department oversight, user verification status, official scheme promulgation, and emergency broadcast dispatch"
        badge={<Badge variant="purple">Root Administrator Access</Badge>}
      >
        <button
          onClick={() => setIsSchemeModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Scheme</span>
        </button>
      </PageHeader>

      {/* Admin KPI Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Accounts"
            value={stats.total_users}
            subtitle={`${stats.active_farmers} Farmers • ${stats.total_officers} Officers`}
            icon={Users}
            colorScheme="emerald"
          />
          <StatCard
            title="Cultivated Plots Tracked"
            value={stats.total_crops}
            subtitle="Current national Kharif/Rabi cycle"
            icon={Layers}
            colorScheme="sky"
          />
          <StatCard
            title="Assistance Requests"
            value={stats.total_requests}
            subtitle={`${stats.pending_requests} Pending • ${stats.resolved_requests} Resolved`}
            icon={Shield}
            colorScheme="amber"
          />
          <StatCard
            title="Resolution Efficiency"
            value={`${stats.resolution_rate}%`}
            subtitle="Officer advisory turnaround rate"
            icon={BarChart3}
            colorScheme="purple"
          />
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'analytics'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Platform Analytics & Breakdown
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          User & Officer Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'schemes'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Government Schemes Registry ({schemes.length})
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'broadcast'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Emergency System Broadcast
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-4">
              Cultivated Crop Category Distribution
            </h3>
            <div className="space-y-3 text-xs">
              {stats.crop_breakdown?.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-stone-800 dark:text-stone-200">{item.type}</span>
                    <span className="text-stone-500">{item.count} registered crops ({Math.round((item.count / stats.total_crops) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(item.count / stats.total_crops) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-2">
                Operational Compliance Status
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                National agricultural IT system health and uptime integrity
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">MySQL Database Cluster</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">99.98% Healthy</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">JWT Token Rotation & RBAC</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Active (HS256)</span>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                  <span className="font-semibold text-sky-900 dark:text-sky-300">IMD Weather Sync Interval</span>
                  <span className="font-bold text-sky-700 dark:text-sky-400">Every 60 Minutes</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 mt-4 rounded-xl bg-stone-50 dark:bg-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Next System Audit: Mar 31, 2026</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">Auditor: CERT-In</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase text-[10px] font-bold border-b border-stone-100 dark:border-stone-800 pb-2">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="py-3.5">
                      <span className="font-bold text-stone-900 dark:text-white block">{u.name}</span>
                      <span className="text-stone-400 text-[11px]">{u.email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'officer'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-stone-600 dark:text-stone-400">
                      {u.district}, {u.state}
                    </td>
                    <td className="py-3.5 font-mono text-stone-600 dark:text-stone-400">
                      {u.phone}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                        u.is_active ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {u.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.is_active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {u.is_active ? 'Suspend Account' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEMES MANAGEMENT */}
      {activeTab === 'schemes' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Active Government Schemes</h3>
            <button
              onClick={() => setIsSchemeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Scheme
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {schemes.map(s => (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-white">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5">{s.ministry} • Benefits: {s.benefits}</p>
                </div>
                <Badge variant={s.is_active ? 'emerald' : 'stone'}>
                  {s.is_active ? 'Published' : 'Draft'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST DISPATCH */}
      {activeTab === 'broadcast' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">National Farmer / Officer Broadcast Dispatcher</h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            Push high-priority weather warnings, pest outbreak advisories, or subsidy deadline alerts directly to user dashboards.
          </p>

          {broadcastSent && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Broadcast dispatched successfully to registered subscribers!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Recipient Target *
              </label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
              >
                <option value="all">All Subscribers (Farmers + Agriculture Officers)</option>
                <option value="farmers">All Registered Farmers Only</option>
                <option value="officers">All Agriculture Officers Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Alert Title *
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. URGENT: Hailstorm Warning & PMFBY Crop Loss Protocol"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Broadcast Body Text *
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Compose full advisory text with protective measures and hotline instructions..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast to Subscribers</span>
            </button>
          </form>
        </div>
      )}

      {/* Publish Scheme Modal */}
      <Modal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
        title="Promulgate New Agricultural Scheme"
        subtitle="Publish to the national Direct Benefit Transfer (DBT) citizen portal"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateScheme} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Scheme Name *</label>
              <input
                type="text"
                required
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                placeholder="e.g. National Solar Pump Subsidy (KUSUM-B)"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category *</label>
              <select
                value={schemeCategory}
                onChange={(e) => setSchemeCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Financial Support">Financial Support</option>
                <option value="Crop Insurance">Crop Insurance</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Soil & Nutrition">Soil & Nutrition</option>
                <option value="Farm Machinery">Farm Machinery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Nodal Ministry *</label>
            <input
              type="text"
              required
              value={schemeMinistry}
              onChange={(e) => setSchemeMinistry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={schemeDesc}
              onChange={(e) => setSchemeDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Direct Benefits *</label>
            <input
              type="text"
              required
              value={schemeBenefits}
              onChange={(e) => setSchemeBenefits(e.target.value)}
              placeholder="e.g. 60% capital cost subsidy for standalone solar pumps"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Eligibility (1 per line) *</label>
            <textarea
              rows={2}
              value={schemeEligibility}
              onChange={(e) => setSchemeEligibility(e.target.value)}
              placeholder="Individual farmers or water user associations&#10;Cultivable land record in applicant's name"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Required Documents (Comma separated) *</label>
            <input
              type="text"
              value={schemeDocs}
              onChange={(e) => setSchemeDocs(e.target.value)}
              placeholder="Aadhaar Card, Land Record 7/12, Bank Passbook"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSchemeModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Publish Scheme
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
