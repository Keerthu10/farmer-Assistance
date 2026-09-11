import React, { useEffect, useState } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Landmark, Search, Filter, CheckCircle2, FileText, 
  ArrowRight, ShieldCheck, DollarSign, Calendar, ExternalLink, 
  AlertCircle, HelpCircle, Globe, Sparkles 
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { schemesApi } from '../../services/api';
import { Scheme } from '../../types';
import { useRegion } from '../../context/RegionContext';

export const SchemesPage: React.FC = () => {
  const { currentRegion, availableRegions, setRegionById } = useRegion();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [schemeToApply, setSchemeToApply] = useState<Scheme | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Application form fields
  const [applicantName, setApplicantName] = useState('Ramesh Kumar');
  const [farmerIdNumber, setFarmerIdNumber] = useState('9876-5432-1098');
  const [bankAccount, setBankAccount] = useState('0982348572019');
  const [routingOrIfsc, setRoutingOrIfsc] = useState('SBIN0001824');
  const [landParcelReference, setLandParcelReference] = useState('Survey Plot 442/12, Agro-Zone');

  const categories = [
    'All',
    'Financial Support',
    'Crop Insurance',
    'Irrigation & Infra',
    'Farm Mechanization',
    'Organic & Sustainable',
  ];

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await schemesApi.getSchemes({ search: searchQuery, category: categoryFilter });
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [categoryFilter, searchQuery]);

  const handleOpenApply = (scheme: Scheme) => {
    setSchemeToApply(scheme);
    setApplicationSubmitted(false);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeToApply) return;

    try {
      const payload = {
        applicant_name: applicantName,
        farmer_id: farmerIdNumber,
        bank_account: bankAccount,
        routing_code: routingOrIfsc,
        land_parcel: landParcelReference,
      };
      await schemesApi.applyForScheme(schemeToApply.id, payload);
      setApplicationSubmitted(true);
    } catch (err) {
      console.error('Scheme application failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Government Schemes, Direct Subsidies & Grants"
        subtitle={`Agricultural support programs, crop insurance, and direct benefit transfer (DBT) funds available in ${currentRegion.country}`}
        badge={
          <Badge variant="purple">
            {currentRegion.flag} {currentRegion.country} Portal Connected
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={currentRegion.id}
            onChange={(e) => setRegionById(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300"
          >
            {availableRegions.map(r => (
              <option key={r.id} value={r.id}>
                {r.flag} {r.name}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheme name or ministry..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schemes.map(scheme => (
          <motion.div
            key={scheme.id}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 shadow-xs flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {scheme.category}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {scheme.sponsor}
                </span>
              </div>

              <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-2 leading-snug">
                {scheme.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                {scheme.description}
              </p>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs mb-4">
                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Direct Benefit</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mt-0.5">
                  {Array.isArray(scheme.benefits) ? scheme.benefits[0] : scheme.benefits}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600 transition-colors"
              >
                View Guidelines
              </button>
              <button
                onClick={() => handleOpenApply(scheme)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scheme Detail Guidelines Modal */}
      {selectedScheme && (
        <Modal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          title={selectedScheme.title}
          subtitle={`Administered by: ${selectedScheme.sponsor || selectedScheme.ministry || 'Government of India'}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Scheme Overview</span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">Direct Benefits</span>
              {Array.isArray(selectedScheme.benefits) ? (
                <ul className="space-y-1 list-disc list-inside text-stone-800 dark:text-stone-200 font-medium">
                  {selectedScheme.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              ) : (
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">{selectedScheme.benefits}</p>
              )}
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white block mb-2">Eligibility Criteria</span>
              <ul className="space-y-1.5 list-disc list-inside text-stone-600 dark:text-stone-300">
                {(selectedScheme.eligibility_criteria || selectedScheme.eligibility || []).map((crit: string, idx: number) => (
                  <li key={idx} className="leading-snug">{crit}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white block mb-2">Required Verification Documents</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedScheme.required_documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-stone-800 dark:text-stone-200 font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = selectedScheme;
                  setSelectedScheme(null);
                  handleOpenApply(s);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Proceed to Apply
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct DBT Apply Modal */}
      {schemeToApply && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Direct Benefit Enrollment: ${schemeToApply.title}`}
          subtitle="Direct bank transfer beneficiary identification & land verification"
          maxWidth="lg"
        >
          {applicationSubmitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Application Successfully Logged!
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                Reference ID: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">DBT-{Date.now().toString().slice(-6)}</span>
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Your dossier has been routed to the District Agriculture Officer for fast-track verification.
              </p>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Return to Schemes
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Farmer Beneficiary Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {currentRegion.idTypeLabel || 'National Farmer ID / Aadhaar'}
                </label>
                <input
                  type="text"
                  required
                  value={farmerIdNumber}
                  placeholder={currentRegion.idTypePlaceholder || 'XXXX-XXXX-XXXX'}
                  onChange={(e) => setFarmerIdNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    IFSC / Routing Code
                  </label>
                  <input
                    type="text"
                    required
                    value={routingOrIfsc}
                    onChange={(e) => setRoutingOrIfsc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Cadastral Survey / Parcel Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={landParcelReference}
                  onChange={(e) => setLandParcelReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300">
                Direct Benefit Transfer (DBT) will be credited directly to your registered bank account upon biometric or land registry verification.
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Submit Beneficiary Dossier
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
