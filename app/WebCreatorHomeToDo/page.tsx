"use client";

import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import ActiveTaskCard from "@/components/ActiveTaskCard"; // ✅ Import new component
import RequestModal from "@/components/RequestModal"; 
import { getCampaignInvitations, CampaignInvitation } from "@/utils/api"; 
import { Loader2, CheckCircle2 } from "lucide-react";

// Helper type matching ActiveTaskCard expectations
type Task = {
  id: number;
  company: string;
  logo: string;
  title: string;
  status: string;
  deliverables: string[];
  price: number;
  dueDate: string;
  dateAdded: string;
};

export default function HomeWebCreatorHomeToDoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rawInvitations, setRawInvitations] = useState<CampaignInvitation[]>([]); 
  const [selectedTaskID, setSelectedTaskID] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAcceptedCampaigns() {
      setLoading(true);
      const res = await getCampaignInvitations(); 

      if (res.success && Array.isArray(res.data)) {
        // 1. Filter only "accepted" items
        const accepted = res.data.filter((inv: CampaignInvitation) => inv.status === 'accepted');
        
        setRawInvitations(accepted);

        // 2. Map to Task format
        const mappedTasks: Task[] = accepted.map((inv: CampaignInvitation) => ({
          id: inv.id, 
          company: inv.business_name,
          logo: "/images/placeholder-logo.png", // Replace with real logo if available
          title: inv.campaign_title,
          status: "In Progress",
          // You might fetch real deliverables from API later, hardcoded for now
          deliverables: ["Content Creation", "Story Post", "Reel Upload"], 
          price: inv.campaign_budget,
          dueDate: new Date(inv.campaign_end_date).toLocaleDateString(),
          dateAdded: new Date(inv.invited_at).toLocaleDateString(),
        }));

        setTasks(mappedTasks);
      }
      setLoading(false);
    }

    loadAcceptedCampaigns();
  }, []);

  // Find selected invitation for Modal
  const selectedInvitation = selectedTaskID 
    ? rawInvitations.find(inv => inv.id === selectedTaskID) || null 
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />

      <main className="pt-24 pb-12">
        <TabsNavbar />

        <div className="p-6 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Active Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track your progress and manage deliverables.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {/* Empty State */}
          {!loading && tasks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="opacity-50" />
                </div>
                <p className="font-medium">No active tasks</p>
                <p className="text-sm">Accepted campaigns will appear here.</p>
             </div>
          )}

          {/* Task Grid */}
          {!loading && tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <ActiveTaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => setSelectedTaskID(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal - Read Only View */}
      <RequestModal
        show={!!selectedInvitation}
        onClose={() => setSelectedTaskID(null)}
        data={selectedInvitation}
        onAccept={() => {}}
        onDecline={() => {}}
        isProcessing={false}
      />
    </div>
  );
}