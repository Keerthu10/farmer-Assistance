import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, ArrowRight, UserCheck, ShoppingBag, 
  ShieldAlert, Sprout, Truck, CreditCard, Star, Search, 
  Eye, BarChart3, Users, PackageCheck, Layers, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserFlowVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const UserFlowVisualizerModal: React.FC<UserFlowVisualizerModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'farmer' | 'customer' | 'admin'>('farmer');
  const { switchRole } = useAuth();

  if (!isOpen) return null;

  const flows = {
    farmer: {
      title: 'Farmer Business Flow',
      subtitle: 'Zero middlemen, transparent direct-to-buyer selling lifecycle',
      color: 'emerald',
      steps: [
        {
          title: '1. Login / Auth',
          desc: 'Grower signs into verified farm portal with regional credentials or quick demo switch.',
          icon: UserCheck,
          path: '/login',
          role: 'farmer' as const,
        },
        {
          title: '2. Dashboard',
          desc: 'Views live mandi benchmarks, incoming purchase inquiries, and weather advisory.',
          icon: BarChart3,
          path: '/dashboard',
          role: 'farmer' as const,
        },
        {
          title: '3. Add Product / Lot',
          desc: 'Uploads fresh harvest lot with batch code, soil profile, organic tag, and minimum order qty.',
          icon: Sprout,
          path: '/farmer-products',
          role: 'farmer' as const,
        },
        {
          title: '4. Manage Stock',
          desc: 'Adjusts available crates/quintals in real time and sets direct farm pricing.',
          icon: Layers,
          path: '/farmer-products',
          role: 'farmer' as const,
        },
        {
          title: '5. Receive Orders',
          desc: 'Escrow-secured purchase orders arrive with customer location and fulfillment window.',
          icon: PackageCheck,
          path: '/farmer-orders',
          role: 'farmer' as const,
        },
        {
          title: '6. Dispatch Products',
          desc: 'Packages produce in breathable crates, marks lot dispatched, and uploads cold-van tracking.',
          icon: Truck,
          path: '/farmer-orders',
          role: 'farmer' as const,
        },
        {
          title: '7. Receive Payment',
          desc: 'Instant escrow fund release upon customer delivery verification (+35% profit vs mandi).',
          icon: CreditCard,
          path: '/farmer-orders',
          role: 'farmer' as const,
        },
      ],
    },
    customer: {
      title: 'Customer / Buyer Flow',
      subtitle: 'Farm-fresh quality produce traced directly from harvest to doorstep',
      color: 'sky',
      steps: [
        {
          title: '1. Register / Login',
          desc: 'Creates account as Individual, Farm-to-Table Restaurant, Supermarket, or Wholesaler.',
          icon: UserCheck,
          path: '/register',
          role: 'customer' as const,
        },
        {
          title: '2. Browse Products',
          desc: 'Explores real-time regional produce with transparent price comparisons vs retail.',
          icon: Search,
          path: '/marketplace',
          role: 'customer' as const,
        },
        {
          title: '3. View Farmer Details',
          desc: 'Inspects grower credentials, soil health, water source, and NPOP organic certificates.',
          icon: Eye,
          path: '/marketplace',
          role: 'customer' as const,
        },
        {
          title: '4. Add to Cart',
          desc: 'Selects harvest quantity with automated savings calculator vs traditional middlemen.',
          icon: ShoppingBag,
          path: '/marketplace',
          role: 'customer' as const,
        },
        {
          title: '5. Checkout',
          desc: 'Completes order via UPI, Escrow Bank Transfer, or Card with money held in trust.',
          icon: CreditCard,
          path: '/marketplace',
          role: 'customer' as const,
        },
        {
          title: '6. Track Order',
          desc: 'Real-time 5-stage timeline from farm harvest to direct cold-chain van delivery.',
          icon: Truck,
          path: '/orders',
          role: 'customer' as const,
        },
        {
          title: '7. Receive & Review',
          desc: 'Inspects fresh produce, releases escrow to farmer, and posts 5-star quality review.',
          icon: Star,
          path: '/orders',
          role: 'customer' as const,
        },
      ],
    },
    admin: {
      title: 'Platform Admin & Agronomy Flow',
      subtitle: 'Marketplace governance, organic certification audit, and dispute escrow oversight',
      color: 'amber',
      steps: [
        {
          title: '1. Login',
          desc: 'Signs into administrative portal with supervisor privileges.',
          icon: UserCheck,
          path: '/login',
          role: 'admin' as const,
        },
        {
          title: '2. Admin Dashboard',
          desc: 'Monitors total marketplace GMV, volume moved, and middleman commission eliminated.',
          icon: BarChart3,
          path: '/admin/marketplace',
          role: 'admin' as const,
        },
        {
          title: '3. Manage Users & Verify Farmers',
          desc: 'Audits land documents, organic test reports, and grants verified grower badges.',
          icon: Users,
          path: '/admin/marketplace',
          role: 'admin' as const,
        },
        {
          title: '4. Manage Products & Quality Standards',
          desc: 'Monitors batch freshness, flags non-compliant listings, and audits pricing transparency.',
          icon: Sprout,
          path: '/admin/marketplace',
          role: 'admin' as const,
        },
        {
          title: '5. Manage Orders & Escrow Mediation',
          desc: 'Oversees trust accounts, inspects order disputes, and arbitrates fair settlements.',
          icon: ShieldAlert,
          path: '/admin/marketplace',
          role: 'admin' as const,
        },
        {
          title: '6. Reports & Agronomy Analytics',
          desc: 'Analyzes crop price trends, regional demand surges, and post-harvest loss prevention.',
          icon: BarChart3,
          path: '/admin/marketplace',
          role: 'admin' as const,
        },
      ],
    },
  };

  const currentFlow = flows[activeTab];

  const handleRunStep = (step: (typeof currentFlow.steps)[0]) => {
    switchRole(step.role);
    onClose();
    onNavigate(step.path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-6"
        >
          {/* Top Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                  Platform Architecture & User Flows
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Visualizing the direct Farm-to-Customer marketplace ecosystem across all three primary actors.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Flow Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('farmer')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <span>🌾 1. Farmer Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'customer'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <span>🛒 2. Customer Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <span>🛡️ 3. Admin Flow</span>
            </button>
          </div>

          {/* Flow Intro Banner */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-white">
                {currentFlow.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {currentFlow.subtitle}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {currentFlow.steps.length} Steps
            </span>
          </div>

          {/* Interactive Steps Visual Diagram */}
          <div className="relative space-y-3">
            {currentFlow.steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-extrabold text-stone-900 dark:text-white">
                        {step.title}
                      </h5>
                      <button
                        onClick={() => handleRunStep(step)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                      >
                        <span>Test this step live</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 text-xs">
            <span className="text-stone-500">
              Tip: Hover over any step and click <strong>Test this step live</strong> to immediately jump into that flow.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              Done Exploring
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
