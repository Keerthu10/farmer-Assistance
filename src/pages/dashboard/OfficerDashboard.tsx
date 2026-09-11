import React, { useEffect, useState } from 'react';
import { 
  LifeBuoy, AlertTriangle, CheckCircle2, Clock, 
  Sprout, Users, ArrowRight, Shield, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge, getStatusBadge } from '../../components/common/Badge';
import { assistanceApi, cropsApi } from '../../services/api';
import { AssistanceRequest, Crop } from '../../types';

interface OfficerDashboardProps {
  onNavigate: (path: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const [reqRes, cropsRes] = await Promise.all([
          assistanceApi.getRequests(),
          cropsApi.getCrops(),
        ]);
        if (reqRes.data.success) setRequests(reqRes.data.requests);
        if (cropsRes.data.success) setCrops(cropsRes.data.crops);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOfficerData();
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const criticalRequests = requests.filter(r => r.urgency === 'Critical' || r.urgency === 'High');
  const resolvedRequests = requests.filter(r => r.status === 'Resolved' || r.status === 'Closed');

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Officer Desk: ${user?.name || 'Dr. Officer'}`}
        subtitle={`District Jurisdiction: ${user?.district || 'Ludhiana'} • Department of Agriculture & Farmers Welfare`}
        badge={
          <Badge variant="sky" size="md">
            Agricultural Officer PB-AGRI-0492
          </Badge>
        }
      >
        <button
          onClick={() => onNavigate('/assistance')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Assistance Desk Queue</span>
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Farmer Inquiries"
          value={pendingRequests.length}
          subtitle="Awaiting diagnosis & response"
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Critical / High Urgency"
          value={criticalRequests.length}
          subtitle="Pest outbreak & disease risks"
          icon={AlertTriangle}
          colorScheme="orange"
        />
        <StatCard
          title="Resolved Cases"
          value={resolvedRequests.length}
          subtitle="Successfully remediated"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Monitored District Crops"
          value={crops.length}
          subtitle="Total seasonal records"
          icon={Sprout}
          colorScheme="sky"
        />
      </div>

      {/* Urgent Ticket Queue */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Active Farmer Assistance Requests</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Prioritized by severity in your district</p>
          </div>
          <button
            onClick={() => onNavigate('/assistance')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Open Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {requests.map(req => (
            <div
              key={req.id}
              onClick={() => onNavigate('/assistance')}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-sky-400 bg-stone-50/50 dark:bg-stone-900/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={req.photo_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=150&q=80'}
                  alt="Symptom Evidence"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-stone-900 dark:text-white">#{req.id}: {req.title}</span>
                    {getStatusBadge(req.urgency)}
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-1">
                    {req.description}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Farmer: <span className="font-semibold text-stone-700 dark:text-stone-300">{req.farmer_name}</span> ({req.farmer_phone}) • Crop: <span className="font-semibold">{req.crop_name}</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <span className="text-[11px] text-stone-400">
                  {new Date(req.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{req.responses?.length || 0} Replies</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
