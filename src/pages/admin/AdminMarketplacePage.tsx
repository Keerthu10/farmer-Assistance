import React, { useState } from 'react';
import { 
  ShieldCheck, Award, AlertTriangle, CheckCircle2, 
  DollarSign, Users, Store, ArrowUpRight, Check, X, 
  Search, Eye, RefreshCw, FileText 
} from 'lucide-react';
import { useRegion } from '../../context/RegionContext';
import { useCart } from '../../context/CartContext';
import { INITIAL_FARMS } from '../../data/marketplaceData';

export const AdminMarketplacePage: React.FC = () => {
  const { formatCurrency } = useRegion();
  const { orders, updateOrderStatus } = useCart();

  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [activeTab, setActiveTab] = useState<'verification' | 'escrow' | 'disputes'>('verification');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Escrow statistics
  const totalGMV = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalInEscrow = orders
    .filter((o) => o.payment_status === 'Escrow Held')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const totalDisbursed = orders
    .filter((o) => o.payment_status === 'Released to Farmer')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const handleVerifyFarmer = (farmId: number, verify: boolean) => {
    setFarms((prev) =>
      prev.map((f) =>
        f.id === farmId
          ? { ...f, is_verified: verify, organic_certified: verify }
          : f
      )
    );
    setActionMessage(`Farm #${farmId} verification status updated to ${verify ? 'VERIFIED' : 'PENDING'}`);
    setTimeout(() => setActionMessage(null), 2500);
  };

  const handleForceReleaseEscrow = (orderId: number) => {
    updateOrderStatus(orderId, 'Delivered');
    setActionMessage(`Escrow payment for Order #${orderId} disbursed directly to farmer bank account.`);
    setTimeout(() => setActionMessage(null), 2500);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Marketplace Integrity & Escrow Oversight</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
          Admin Trust, Verification & Escrow Desk
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Audit grower KYC land records, monitor escrow holdings, release farmer disbursements, and resolve buyer quality disputes
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* GMV & Escrow KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Total Marketplace GMV
          </span>
          <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
            {formatCurrency(totalGMV)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            100% Direct transactions
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Funds Held in Escrow
          </span>
          <span className="text-2xl font-extrabold text-amber-500">
            {formatCurrency(totalInEscrow)}
          </span>
          <span className="text-[11px] text-stone-400 block mt-1">
            Awaiting customer delivery OTP
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Disbursed to Farmers
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalDisbursed)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Zero intermediary deductions
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Verified Farm Producers
          </span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {farms.filter((f) => f.is_verified).length} / {farms.length}
          </span>
          <span className="text-[11px] text-purple-600 font-semibold block mt-1">
            NPOP / USDA Certified
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'verification'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
          }`}
        >
          Farmer Verification Queue ({farms.length})
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'escrow'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
          }`}
        >
          Escrow & Orders Oversight ({orders.length})
        </button>
      </div>

      {/* TAB 1: FARMER VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-3">
          {farms.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={f.avatar}
                  alt={f.farmer_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                      {f.farm_name}
                    </h4>
                    {f.is_verified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified Grower
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                        Pending Audit
                      </span>
                    )}
                  </div>
                  <p className="text-stone-500 text-xs">
                    Grower: <strong>{f.farmer_name}</strong> • {f.village}, {f.district}, {f.state}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Land Area: {f.land_area_total} Acres • Soil: {f.primary_soil_type} • Cert: {f.certifying_agency}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {f.is_verified ? (
                  <button
                    onClick={() => handleVerifyFarmer(f.id, false)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs"
                  >
                    Revoke Badge
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerifyFarmer(f.id, true)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Grant Organic Badge</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ESCROW OVERSIGHT */}
      {activeTab === 'escrow' && (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {ord.order_code}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold">
                    {ord.buyer_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.payment_status === 'Released to Farmer' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.payment_status}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300">
                  Buyer: <strong>{ord.customer_name}</strong> • Total: <strong>{formatCurrency(ord.total_amount)}</strong>
                </p>
                <p className="text-[11px] text-stone-400">
                  Status: {ord.order_status} • {ord.items.map((i) => `${i.product_name} (${i.quantity}${i.unit})`).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {ord.payment_status === 'Escrow Held' && (
                  <button
                    onClick={() => handleForceReleaseEscrow(ord.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Release Escrow to Farmer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
