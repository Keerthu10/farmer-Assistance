import React, { useEffect, useState } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  LifeBuoy, Plus, Search, Filter, MessageSquare, 
  Send, AlertTriangle, CheckCircle2, Clock, Image, 
  User, Calendar, ShieldCheck, Sparkles, PhoneCall, Globe 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge, getStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { assistanceApi, cropsApi } from '../../services/api';
import { AssistanceRequest, AssistanceCategory, UrgencyLevel, Crop } from '../../types';
import { useRegion } from '../../context/RegionContext';

export const AssistanceRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { currentRegion } = useRegion();
  const isOfficerOrAdmin = user?.role === 'officer' || user?.role === 'admin';

  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // New Request Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AssistanceCategory>('Pest Attack');
  const [newCropId, setNewCropId] = useState<number | undefined>(undefined);
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>('High');
  const [newDescription, setNewDescription] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80');

  // Detail / Response Drawer state
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [officerReplyText, setOfficerReplyText] = useState('');
  const [officerChemicalPlan, setOfficerChemicalPlan] = useState('');
  const [newStatusSelection, setNewStatusSelection] = useState<'Pending' | 'In Progress' | 'Resolved' | 'Closed'>('Resolved');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Common quick templates
  const quickSymptoms = [
    {
      title: 'Stem Borer larvae tunnels in central whorl',
      category: 'Pest Attack' as AssistanceCategory,
      urgency: 'High' as UrgencyLevel,
      desc: 'Central shoot wilting and drying (dead heart symptom) observed across 20% of the field. Frass found near exit holes.',
    },
    {
      title: 'Yellow / Brown Rust pustules on leaf surface',
      category: 'Crop Disease' as AssistanceCategory,
      urgency: 'Critical' as UrgencyLevel,
      desc: 'Bright yellow powdery stripes on leaf blades following foggy morning weather. Spreading rapidly downwind.',
    },
    {
      title: 'Bacterial Leaf Blight water-soaked lesions',
      category: 'Crop Disease' as AssistanceCategory,
      urgency: 'High' as UrgencyLevel,
      desc: 'Wavy margins turning straw-yellow on leaf tips, accompanied by milky bacterial ooze droplets in early morning.',
    },
    {
      title: 'Severe Nitrogen / Zinc chlorosis deficiency',
      category: 'Fertilizer Advice' as AssistanceCategory,
      urgency: 'Medium' as UrgencyLevel,
      desc: 'Lower leaves turning pale yellow starting from tip along midrib. Stunted vegetative tillering.',
    },
  ];

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const [reqRes, cropRes] = await Promise.all([
        assistanceApi.getRequests({ category: categoryFilter, status: statusFilter }),
        cropsApi.getCrops(),
      ]);
      if (reqRes.data.success) setRequests(reqRes.data.requests);
      if (cropRes.data.success) {
        setCrops(cropRes.data.crops);
        if (cropRes.data.crops.length > 0) setNewCropId(cropRes.data.crops[0].id);
      }
    } catch (err) {
      console.error('Failed to load assistance requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [categoryFilter, statusFilter]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCrop = crops.find(c => c.id === newCropId);
      const payload: Partial<AssistanceRequest> = {
        title: newTitle,
        category: newCategory,
        crop_id: newCropId,
        crop_name: selectedCrop?.name || 'Wheat',
        urgency: newUrgency,
        description: newDescription,
        photo_url: newPhotoUrl,
      };
      await assistanceApi.createRequest(payload);
      setIsNewModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      fetchRequests();
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !officerReplyText) return;
    setIsSubmittingReply(true);

    try {
      await assistanceApi.addResponse(selectedRequest.id, {
        message: officerReplyText,
        chemical_recommendation: officerChemicalPlan,
        status: newStatusSelection,
      });

      setOfficerReplyText('');
      setOfficerChemicalPlan('');
      
      const updatedList = await assistanceApi.getRequests();
      setRequests(updatedList.data.requests);
      const updatedCurrent = updatedList.data.requests.find((r: any) => r.id === selectedRequest.id);
      if (updatedCurrent) setSelectedRequest(updatedCurrent);
    } catch (err) {
      console.error('Failed to submit response:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const applyQuickSymptom = (s: typeof quickSymptoms[0]) => {
    setNewTitle(s.title);
    setNewCategory(s.category);
    setNewUrgency(s.urgency);
    setNewDescription(s.desc);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agricultural Assistance & Expert Triage Desk"
        subtitle="Direct communication channel with Agriculture Extension Officers for pest outbreaks, disease remediation, and soil advisory"
        badge={<Badge variant="sky">{requests.length} Open Inquiries</Badge>}
      >
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Assistance Ticket</span>
        </button>
      </PageHeader>

      {/* Regional Helpline Quick Contact Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-stone-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm block">
              Direct Farmer Extension Helpline: {currentRegion.helplineName || currentRegion.helpline?.name || 'Kisan Extension Call Center'}
            </span>
            <span className="text-emerald-200 text-xs">
              Call toll-free for emergency pest invasion advice, locust alerts, and canal water updates.
            </span>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 font-mono font-bold text-sm text-emerald-200 self-start sm:self-auto">
          {currentRegion.helplineContact || currentRegion.helpline?.contact || '1800-180-1551'}
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
          >
            <option value="All">All Problem Categories</option>
            <option value="Pest Attack">Pest Attack</option>
            <option value="Crop Disease">Crop Disease</option>
            <option value="Fertilizer Advice">Fertilizer Advice</option>
            <option value="Soil Health">Soil Health</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List of Assistance Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {requests.map(ticket => (
          <motion.div
            key={ticket.id}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    Ticket #{ticket.id}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    • {ticket.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {getStatusBadge(ticket.urgency)}
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              <h3 className="text-base font-bold text-stone-900 dark:text-white mt-1.5">
                {ticket.title}
              </h3>

              <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-1">
                <span>Farmer: <strong className="text-stone-700 dark:text-stone-300">{ticket.farmer_name}</strong> ({ticket.farmer_district})</span>
                <span>Crop: <strong className="text-stone-700 dark:text-stone-300">{ticket.crop_name}</strong></span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 line-clamp-2 leading-relaxed">
                {ticket.description}
              </p>

              {/* Photo preview thumbnail */}
              {ticket.photo_url && (
                <div className="mt-3 flex items-center gap-3 p-2 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <img
                    src={ticket.photo_url}
                    alt="Field evidence"
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                  />
                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700 dark:text-stone-300 block">Visual Field Evidence</span>
                    <span>High-resolution diagnostic photograph attached</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom response count and open button */}
            <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{ticket.responses?.length || 0} Officer Prescriptions</span>
              </div>

              <button
                onClick={() => setSelectedRequest(ticket)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-colors"
              >
                View Dialogue & Remedies
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Details & Officer Response Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Ticket #${selectedRequest.id}: ${selectedRequest.title}`}
          subtitle={`Raised by ${selectedRequest.farmer_name} • ${selectedRequest.farmer_district}, ${selectedRequest.farmer_state}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700 dark:text-stone-300">Category:</span>
                <Badge variant="emerald">{selectedRequest.category}</Badge>
                <span className="text-stone-400">|</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">Crop:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{selectedRequest.crop_name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRequest.urgency)}
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Farmer Symptom Description:</span>
              <p className="text-stone-700 dark:text-stone-300 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 leading-relaxed">
                {selectedRequest.description}
              </p>
            </div>

            {selectedRequest.photo_url && (
              <div>
                <span className="font-bold text-stone-900 dark:text-white block mb-1.5">Submitted Field Evidence:</span>
                <img
                  src={selectedRequest.photo_url}
                  alt="Crop issue"
                  className="w-full max-h-56 object-cover rounded-2xl border border-stone-200 dark:border-stone-700"
                />
              </div>
            )}

            {/* Conversation Timeline */}
            <div className="space-y-2 pt-2">
              <span className="font-bold text-stone-900 dark:text-white block">
                Official Remedies & Extension Records ({selectedRequest.responses?.length || 0})
              </span>

              {selectedRequest.responses && selectedRequest.responses.length > 0 ? (
                selectedRequest.responses.map((resp: any) => (
                  <div
                    key={resp.id}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">
                        {resp.officer_name} (Agriculture Extension Officer)
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(resp.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {resp.message}
                    </p>
                    {resp.chemical_recommendation && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                        <strong>Prescription:</strong> {resp.chemical_recommendation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-stone-400 italic text-center py-3">
                  No extension responses logged yet. Under priority review.
                </p>
              )}
            </div>

            {/* Response Composer */}
            <form onSubmit={handleAddResponse} className="pt-3 border-t border-stone-200 dark:border-stone-700 space-y-3">
              <label className="block font-bold text-stone-900 dark:text-white">
                {isOfficerOrAdmin ? 'Submit Official Officer Prescription' : 'Add Follow-up Inquiry'}
              </label>
              <textarea
                rows={2}
                required
                value={officerReplyText}
                onChange={(e) => setOfficerReplyText(e.target.value)}
                placeholder={isOfficerOrAdmin ? 'Specify pathogen analysis, irrigation alteration, or biological control actions...' : 'Describe any changes in symptoms...'}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />

              {isOfficerOrAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Prescription / Chemical Dosage
                    </label>
                    <input
                      type="text"
                      value={officerChemicalPlan}
                      onChange={(e) => setOfficerChemicalPlan(e.target.value)}
                      placeholder="e.g. Chlorantraniliprole 18.5% SC @ 60ml/acre"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Update Case Lifecycle Status
                    </label>
                    <select
                      value={newStatusSelection}
                      onChange={(e) => setNewStatusSelection(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
                    >
                      <option value="In Progress">In Progress (Under Review)</option>
                      <option value="Resolved">Resolved (Prescription Issued)</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? 'Dispatching...' : 'Dispatch Response'}</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Raise New Ticket Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Raise Agricultural Assistance Ticket"
        subtitle="Submit a photographic query to the District Agriculture Extension Center"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
          {/* Quick Symptoms Templates */}
          <div>
            <span className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              ⚡ 1-Click Common Symptom Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSymptoms.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyQuickSymptom(s)}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-[11px]"
                >
                  <span className="font-bold text-stone-900 dark:text-white block truncate">{s.title}</span>
                  <span className="text-stone-400 block">{s.category} • {s.urgency}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Issue Headline *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Severe yellow rust spots appearing on wheat flag leaf"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category *
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AssistanceCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Pest Attack">Pest Attack</option>
                <option value="Crop Disease">Crop Disease</option>
                <option value="Fertilizer Advice">Fertilizer Advice</option>
                <option value="Soil Health">Soil Health</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Affected Crop
              </label>
              <select
                value={newCropId}
                onChange={(e) => setNewCropId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Urgency Level *
              </label>
              <select
                value={newUrgency}
                onChange={(e) => setNewUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Immediate)</option>
                <option value="Critical">Critical (Severe)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Field Symptoms Description *
            </label>
            <textarea
              rows={3}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe color of lesions, percentage of field affected, weather conditions prior to onset, and any previous chemical sprays..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Field Evidence Photograph URL
            </label>
            <input
              type="text"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              Submit to District Triage Desk
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
