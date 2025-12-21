"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { Instagram, Users, Activity, BarChart, Plus } from "lucide-react"; // Added Icons

import { getCampaigns, addCreatorToCampaign } from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface CreatorCardProps {
  creator: {
    id: number;
    name: string;
    followers_count: number;
    engagement_rate: string;
    instagram_username?: string | null;
    reach_7d?: number | null;
    niches: { id: number; name: string }[];
  };
}

interface Campaign {
  id: number;
  title: string;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // ... (API Fetching Logic remains the same) ...
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const res = await getCampaigns();
        if (res.success && Array.isArray(res.data)) setCampaigns(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCampaigns(false);
      }
    };
    if (showModal) fetchCampaigns(); // Optimization: Only fetch when modal opens
  }, [showModal]);

  const handleAddCreator = async () => {
    if (selectedCampaigns.length === 0) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Adding creator...");

    try {
      const requests = selectedCampaigns.map((campaignId) =>
        addCreatorToCampaign(campaignId, creator.id)
      );
      await Promise.all(requests);
      toast.success("Added successfully!", { id: toastId });
      setTimeout(() => {
        setShowModal(false);
        router.push("/WebMessages");
      }, 1000);
    } catch (err) {
      toast.error("Error adding creator", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format numbers (e.g. 15000 -> 15k)
  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "-";
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  return (
    // [MOBILE] Changed flex-col-reverse to flex-col for better image flow, added border/shadow
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow duration-300"
    >
      <Toaster position="top-center" />

      {/* 1. Image Section (Mobile: Top, Desktop: Right) */}
      {/* We use order-first md:order-last to put image on top on mobile but right on desktop */}
      <div className="w-full md:w-auto flex justify-center md:justify-end order-first md:order-last shrink-0">
        <div className="relative w-full h-64 md:w-48 md:h-64 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
          <Image
            src="/images/ethan.jpg" // Fallback or dynamic image
            alt={creator.name}
            fill
            className="object-cover"
          />
          {/* Badge Overlay */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Instagram size={12} className="text-pink-600" />
            Instagram
          </div>
        </div>
      </div>

      {/* 2. Info Section */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-4 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {creator.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Lifestyle & Fashion Content Creator
          </p>
        </div>

        {/* 3. [MOBILE FIX] Replaced Table with CSS Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox 
            label="Followers" 
            value={formatNumber(creator.followers_count)} 
            icon={<Users size={16} className="text-[#823A5E]" />} 
          />
          <StatBox 
            label="Engagement" 
            value={creator.engagement_rate} 
            icon={<Activity size={16} className="text-green-600" />} 
          />
          <StatBox 
            label="Reach (7d)" 
            value={formatNumber(creator.reach_7d)} 
            icon={<BarChart size={16} className="text-blue-600" />} 
          />
          {/* Niches as a Stat Box */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center md:items-start">
             <span className="text-xs text-gray-400 mb-1 font-medium">Niche</span>
             <div className="flex flex-wrap justify-center md:justify-start gap-1">
               {creator.niches.slice(0, 2).map(n => (
                 <span key={n.id} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                   {n.name}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto self-start px-6 py-3 bg-[#823A5E] text-white text-sm font-semibold rounded-xl hover:bg-[#692d4c] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#823A5E]/20"
        >
          <Plus size={18} />
          Add to Campaign
        </button>
      </div>

      {/* 4. [MOBILE FIX] Bottom Sheet Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              // Slide up on mobile, Scale on desktop
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:w-[450px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Select Campaign</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {loadingCampaigns ? (
                  <div className="flex justify-center py-4"><div className="animate-spin w-6 h-6 border-2 border-[#823A5E] border-t-transparent rounded-full"/></div>
                ) : campaigns.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No active campaigns.</p>
                ) : (
                  campaigns.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCampaigns.includes(c.id) 
                          ? "border-[#823A5E] bg-[#823A5E]/5" 
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCampaigns.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCampaigns(prev => [...prev, c.id]);
                          else setSelectedCampaigns(prev => prev.filter(id => id !== c.id));
                        }}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedCampaigns.includes(c.id) ? "border-[#823A5E] bg-[#823A5E]" : "border-gray-300"}`}>
                        {selectedCampaigns.includes(c.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="font-medium text-gray-900">{c.title}</span>
                    </label>
                  ))
                )}
              </div>

              <button
                onClick={handleAddCreator}
                disabled={selectedCampaigns.length === 0 || isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#823A5E] text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                {isSubmitting ? "Adding..." : "Confirm & Add"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper component for the Grid stats
function StatBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center md:items-start text-center md:text-left">
      <div className="flex items-center gap-1 mb-1 text-xs text-gray-400 font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <span className="text-gray-900 font-bold text-sm sm:text-base">{value}</span>
    </div>
  );
}