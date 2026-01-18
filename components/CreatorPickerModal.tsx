"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Youtube, Music, Loader2, Users, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { inviteCreators } from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// --- Types ---
type Creator = {
  id: number;
  name: string;
  bio?: string;
  image?: string;
  followers_count: number;
  engagement_rate: string | number;
  platform?: string;
  instagram_username?: string;
  niches?: { id: number; name: string }[];
};

type CreatorPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number;
  creators: Creator[];
};

// --- Helpers ---
const formatEngagement = (rate: string | number) => {
  if (typeof rate === "string") return rate;
  return `${(rate * 100).toFixed(1)}%`;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

const getPlatformIcon = (platform: string = "Instagram") => {
  const p = platform.toLowerCase();
  if (p.includes("youtube")) return <Youtube className="w-4 h-4 text-red-600" />;
  if (p.includes("tiktok")) return <Music className="w-4 h-4 text-black" />;
  return <Instagram className="w-4 h-4 text-pink-500" />;
};

// --- Sub-Component: Creator Card ---
// Extracting this makes the main logic cleaner and the render loop more efficient
const CreatorCard = ({
  creator,
  isSelected,
  onToggle,
}: {
  creator: Creator;
  isSelected: boolean;
  onToggle: (id: number) => void;
}) => (
  <div
    onClick={() => onToggle(creator.id)}
    className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer hover:shadow-lg
      ${isSelected ? "border-[#823A5E] ring-2 ring-[#823A5E]/20" : "border-gray-200 hover:border-[#823A5E]/50"}
    `}
  >
    {/* Selection Indicator */}
    <div
      className={`absolute top-3 left-3 z-20 transition-all duration-200 
        ${isSelected ? "scale-100 opacity-100" : "scale-90 opacity-0 group-hover:opacity-100"}
      `}
    >
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-sm
          ${isSelected ? "bg-[#823A5E] border-[#823A5E]" : "bg-white border-gray-300"}
        `}
      >
        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
      </div>
    </div>

    {/* Image Section */}
    <div className="relative h-48 w-full bg-gray-100">
      {creator.image ? (
        <Image
          src={creator.image}
          alt={creator.name}
          fill
          className={`object-cover transition-opacity duration-300 ${isSelected ? "opacity-90" : "opacity-100"}`}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <Users className="w-12 h-12 opacity-20" />
        </div>
      )}
      {/* Platform Badge */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm border border-gray-100">
        {getPlatformIcon(creator.platform)}
        <span className="text-gray-700">{creator.platform || "Instagram"}</span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{creator.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
        {creator.bio || "No bio available."}
      </p>

      {/* Niches */}
      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
        {creator.niches?.slice(0, 3).map((n) => (
          <span
            key={n.id}
            className="text-[10px] uppercase tracking-wider font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
          >
            {n.name}
          </span>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="text-center">
          <div className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Followers</div>
          <span className="font-bold text-gray-900">{formatNumber(creator.followers_count)}</span>
        </div>
        <div className="text-center border-l border-gray-200">
          <div className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Eng. Rate</div>
          <span className="font-bold text-green-600">{formatEngagement(creator.engagement_rate)}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function CreatorPickerModal({
  isOpen,
  onClose,
  creators = [],
  campaignId,
}: CreatorPickerModalProps) {
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; msg: string }>({ type: null, msg: '' });

  const toggleSelect = (id: number) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    if (selectedCreators.length === 0) return;
    
    setIsSubmitting(true);
    setStatus({ type: null, msg: '' });

    try {
      // FIX: Ensure we are sending the expected shape. 
      // If your API expects just a list, change this back to `selectedCreators`.
      // But typically, APIs expect an object wrapper like below:
      const payload = { creator_ids: selectedCreators }; 

      // Note: pass 'payload' here instead of 'selectedCreators' if your utils/api
      // function simply stringifies the second argument.
      const res = await inviteCreators(campaignId, selectedCreators); 

      if (res.success) {
        setStatus({ type: 'success', msg: `Successfully invited ${selectedCreators.length} creators!` });
        // Optional: clear selection or close modal after delay
        setTimeout(() => {
           onClose();
           setSelectedCreators([]);
           setStatus({ type: null, msg: '' });
        }, 1500);
      } else {
        setStatus({ type: 'error', msg: "Failed to invite creators. Please try again." });
      }
    } catch (error) {
      console.error("Invite error:", error);
      setStatus({ type: 'error', msg: "An unexpected network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex justify-center items-end sm:items-center backdrop-blur-md bg-black/60 p-4 ${inter.className}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Suggested Creators</h2>
                <p className="text-gray-500 text-sm mt-1">Select creators to invite to your campaign</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Status Banner (Replaces Alert) */}
            {status.type && (
              <div className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                {status.msg}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 bg-gray-50/50 flex-1 overscroll-contain">
              {creators.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="bg-gray-200 p-6 rounded-full mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">No recommendations found</p>
                  <p className="text-gray-500 max-w-xs mx-auto mt-1">
                    Try adjusting your campaign targeting criteria to match more creators.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                  {creators.map((creator) => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      isSelected={selectedCreators.includes(creator.id)}
                      onToggle={toggleSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                    {selectedCreators.length} selected
                </span>
                <span className="text-xs text-gray-400">
                    {selectedCreators.length > 0 ? "Ready to invite" : "Select creators to continue"}
                </span>
              </div>

              <button
                onClick={handleInvite}
                disabled={isSubmitting || creators.length === 0 || selectedCreators.length === 0}
                className={`
                  px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm
                  ${selectedCreators.length > 0 && !isSubmitting
                    ? "bg-[#823A5E] text-white hover:bg-[#6d2e4f] hover:translate-y-[-1px] hover:shadow-md active:translate-y-[0px]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inviting...</span>
                  </>
                ) : (
                  <span>Invite Selected</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}