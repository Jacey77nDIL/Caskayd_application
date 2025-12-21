"use client";

import { useState, useEffect } from "react";
import TopNavbar from "@/components/TopNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import { 
  getCampaignInvitations, 
  acceptCampaignInvitation, 
  declineCampaignInvitation, 
  CampaignInvitation 
} from "@/utils/api";
import { Loader2, Inbox } from "lucide-react"; 

export default function HomeWebCreatorHomeRequestsPage() {
  const [selected, setSelected] = useState<CampaignInvitation | null>(null);
  const [invitations, setInvitations] = useState<CampaignInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadInvitations() {
      setLoading(true);
      const res = await getCampaignInvitations();
      
      if (res.success) {
        // ✅ FILTER: Only show 'invited' campaigns
        const activeInvites = res.data.filter((inv: CampaignInvitation) => inv.status === 'invited');
        setInvitations(activeInvites);
      } else {
        setError(res.message || "Failed to load requests");
      }
      setLoading(false);
    }
    loadInvitations();
  }, []);

  const handleAction = async (campaignId: number, action: 'accept' | 'decline') => {
    setProcessingId(campaignId);
    
    const apiCall = action === 'accept' ? acceptCampaignInvitation : declineCampaignInvitation;
    const result = await apiCall(campaignId);

    if (result.success) {
      // Remove the item from the list immediately since this page ONLY shows 'invited'
      setInvitations((prev) => prev.filter((inv) => inv.campaign_id !== campaignId));

      if (selected?.campaign_id === campaignId) {
        setSelected(null);
      }
    } else {
      console.error(result.message);
    }

    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <main className="pt-24 pb-12">
        <TabsNavbar />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">New Requests</h1>
            <p className="text-gray-500 text-sm">Review pending campaign invitations.</p>
          </div>
          
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl">{error}</div>
          )}

          {!loading && !error && invitations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="opacity-50" />
               </div>
               <p className="font-medium">No pending requests</p>
               <p className="text-sm">You're all caught up!</p>
            </div>
          )}

          {/* Grid Layout */}
          {!loading && invitations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((req) => (
                <RequestCard
                  key={req.id} 
                  logo="/images/placeholder-logo.png"
                  title={req.campaign_title} // Changed to just title for cleaner look
                  price={`₦${req.campaign_budget.toLocaleString()}`}
                  status={req.status}
                  onAccept={() => handleAction(req.campaign_id, 'accept')}
                  onDecline={() => handleAction(req.campaign_id, 'decline')}
                  isProcessing={processingId === req.campaign_id}
                  onClick={() => setSelected(req)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <RequestModal
        show={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        onAccept={() => selected && handleAction(selected.campaign_id, 'accept')}
        onDecline={() => selected && handleAction(selected.campaign_id, 'decline')}
        isProcessing={selected ? processingId === selected.campaign_id : false}
      />
    </div>
  );
}