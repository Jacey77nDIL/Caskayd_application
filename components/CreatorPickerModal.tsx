"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Youtube, Music, Loader2, Users, Activity } from "lucide-react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { inviteCreators } from "@/utils/api"; // Import the new API function

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Normalized Creator Type (Matches your API better)
type Creator = {
  id: number;
  name: string;
  bio?: string;
  image?: string;
  // Flat properties are safer than nested arrays for display
  followers_count: number; 
  engagement_rate: string | number;
  platform?: string; // e.g. "Instagram"
  instagram_username?: string;
};

export default function CreatorPickerModal({
  isOpen,
  onClose,
  creators = [],
  campaignId,
}: {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number; // Changed to number to match ID types usually
  creators: Creator[];
}) {
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle select
  const toggleSelect = (id: number) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Platform icons helper
  const getPlatformIcon = (platform: string = "Instagram") => {
    const p = platform.toLowerCase();
    if (p.includes("youtube")) return <Youtube className="w-4 h-4 text-red-600" />;
    if (p.includes("tiktok")) return <Music className="w-4 h-4 text-black" />;
    return <Instagram className="w-4 h-4 text-pink-500" />; // Default to IG
  };

  const handleInvite = async () => {
    if (selectedCreators.length === 0) {
      onClose(); // Close if nothing selected
      return;
    }

    setIsSubmitting(true);
    
    // Call API
    const res = await inviteCreators(campaignId, selectedCreators);
    
    setIsSubmitting(false);
    
    if (res.success) {
      alert(`Successfully invited ${selectedCreators.length} creators!`);
      onClose();
    } else {
      alert("Failed to invite creators. Please try again.");
    }
  };

  // Format numbers (e.g. 15000 -> 15k)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-center items-end sm:items-center backdrop-blur-md bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Suggested Creators</h2>
                <p className="text-gray-500 text-sm">Select creators to invite to your campaign</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 bg-gray-50/50 flex-1">
              {creators.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="bg-gray-200 p-4 rounded-full mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium text-lg">No recommendations found.</p>
                  <p className="text-gray-500">Try adjusting your campaign targeting.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creators.map((creator) => {
                     const isSelected = selectedCreators.includes(creator.id);
                     return (
                      <div
                        key={creator.id}
                        onClick={() => toggleSelect(creator.id)}
                        className={`
                          group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer hover:shadow-lg
                          ${isSelected ? "border-[#823A5E] ring-2 ring-[#823A5E]/20" : "border-gray-200"}
                        `}
                      >
                        {/* Selection Overlay */}
                        <div className={`absolute top-3 left-3 z-10 transition-transform duration-200 ${isSelected ? "scale-100" : "scale-90 opacity-70 hover:opacity-100"}`}>
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? "bg-[#823A5E] border-[#823A5E]" : "bg-white/80 border-gray-400"}
                          `}>
                            {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                          </div>
                        </div>

                        {/* Image Header */}
                        <div className="relative h-48 w-full bg-gray-200">
                          {creator.image ? (
                             <Image
                              src={creator.image}
                              alt={creator.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                              <Users className="w-12 h-12" />
                            </div>
                          )}
                          
                          {/* Platform Badge */}
                          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-sm">
                            {getPlatformIcon(creator.platform)}
                            <span>{creator.platform || "Instagram"}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-900 truncate">{creator.name}</h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                            {creator.bio || `Content creator specializing in ${creator.platform || "lifestyle content"}.`}
                          </p>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-1">
                                <Users className="w-3 h-3" /> Followers
                              </div>
                              <span className="font-bold text-gray-900">{formatNumber(creator.followers_count)}</span>
                            </div>
                            <div className="text-center border-l border-gray-200">
                              <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-1">
                                <Activity className="w-3 h-3" /> Eng. Rate
                              </div>
                              <span className="font-bold text-green-600">
                                {typeof creator.engagement_rate === 'number' 
                                  ? `${(creator.engagement_rate * 100).toFixed(1)}%` 
                                  : creator.engagement_rate
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-white flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {selectedCreators.length} creator{selectedCreators.length !== 1 && "s"} selected
              </span>
              <button
                onClick={handleInvite}
                disabled={isSubmitting || creators.length === 0}
                className={`
                  ${inter.className} px-8 py-3 rounded-2xl font-medium transition-all duration-200
                  flex items-center gap-2
                  ${selectedCreators.length > 0 && !isSubmitting
                    ? "bg-[#823A5E] text-white hover:bg-[#6d2e4f] hover:scale-105 shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Inviting...
                  </>
                ) : (
                  "Invite Selected"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}