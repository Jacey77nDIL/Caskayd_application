"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from "next/font/google";
import { ArrowLeft, Loader2, Users, Search, TrendingUp, DollarSign } from "lucide-react";
import { FaYoutube, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import { useRouter, useParams } from 'next/navigation';
// import Image from "next/image"; // Uncomment if using Next Image

// Import API utilities
import { 
  getCampaignById, 
  getRecommendations, 
  addCreatorToCampaign, 
  removeCreatorFromCampaign 
} from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface Creator {
  id: string; 
  name: string;
  avatar: string;
  status: string;
  platform?: string;
  followers?: string;
  reach?: string;
  engRate?: string;
  adding?: boolean;
  removing?: boolean;
}

// --- Helper Components ---

function getPlatformIcon(platform: string = "") {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <FaYoutube className="text-red-600 text-lg" />;
  if (p.includes('instagram')) return <FaInstagram className="text-pink-600 text-lg" />;
  if (p.includes('tiktok')) return <FaTiktok className="text-black text-lg" />;
  if (p.includes('twitter') || p.includes('x')) return <FaTwitter className="text-sky-500 text-lg" />;
  return <span className="text-gray-300 text-xs">-</span>;
}

function StatusBadge({ status }: { status?: string }) {
  const lower = (status || 'invited').toLowerCase();
  let styles = 'bg-gray-100 text-gray-600 border-gray-200';
  
  if (lower === 'accepted') styles = 'bg-green-50 text-green-700 border-green-200';
  else if (lower === 'declined') styles = 'bg-red-50 text-red-700 border-red-200';
  else if (lower === 'invited') styles = 'bg-blue-50 text-blue-700 border-blue-200';
  
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${styles}`}>
      {status || 'Invited'}
    </span>
  );
}

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams(); 
  const campaignId = params?.id as string;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [campaignCreators, setCampaignCreators] = useState<Creator[]>([]);
  const [suggested, setSuggested] = useState<Creator[]>([]);
  const [campaignDetails, setCampaignDetails] = useState<any>(null);
  
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const isInCampaign = useCallback((id: string) => {
    return campaignCreators.some(c => c.id === id);
  }, [campaignCreators]);

  // 1. Load Campaign Details & Current Creators
  useEffect(() => {
    if (!campaignId) return;

    async function loadCampaign() {
      setLoading(true);
      const res = await getCampaignById(campaignId);
      setErrorMessage(null);

      if (res.success && res.data) {
        setCampaignDetails(res.data);
        
        const mappedCreators = (res.data.creators || []).map((c: any) => ({
          id: c.creator_id.toString(),
          name: c.creator_name || "Unknown Creator",
          avatar: "/images/placeholder-avatar.jpg",
          status: c.status || "invited",
          platform: "Instagram", 
          followers: "-",
          reach: "-",
          engRate: "-"
        }));
        setCampaignCreators(mappedCreators);
      } else {
        setErrorMessage(res.message || "Failed to load campaign.");
      }
      setLoading(false);
    }
    loadCampaign();
  }, [campaignId]);

  // 2. Load Suggested Creators
  const loadSuggestions = useCallback(async (isLoadMore = false) => {
    if (isLoadMore && !hasMore) return;
    setSuggestionsLoading(true);
    
    const currentOffset = isLoadMore ? offset : 0;
    
    const res = await getRecommendations({ 
        offset: currentOffset, 
        limit: 5 
    });

    if (res.success && res.data) {
      let rawRecs = [];
      if (Array.isArray(res.data)) {
         rawRecs = res.data;
      } else if (res.data.recommendations && Array.isArray(res.data.recommendations)) {
         rawRecs = res.data.recommendations;
      }

      const mappedRecs = rawRecs.map((c: any) => ({
        id: c.id?.toString(),
        name: c.name || "Unknown",
        avatar: c.image || "/images/placeholder-avatar.jpg",
        followers: c.followers_count?.toLocaleString() || "0",
        reach: c.reach_7d?.toLocaleString() || "0",
        engRate: typeof c.engagement_rate === 'string' ? c.engagement_rate : `${(c.engagement_rate || 0) * 100}%`,
        platform: c.platform || "Instagram",
        status: "suggestion"
      }));

      const filteredRecs = mappedRecs.filter((c: Creator) => !isInCampaign(c.id));
      const returnedCount = rawRecs.length;
      const hasMoreRecs = res.data.pagination?.has_more ?? (returnedCount === 5);

      if (isLoadMore) {
        setSuggested(prev => [...prev, ...filteredRecs]);
        setOffset(prev => prev + 5);
      } else {
        setSuggested(filteredRecs);
        setOffset(5);
      }
      setHasMore(hasMoreRecs);
    } else {
      console.error("Failed to load recommendations:", res.message);
    }
    setSuggestionsLoading(false);
  }, [offset, hasMore, isInCampaign]);

  useEffect(() => {
    loadSuggestions(false);
  }, [campaignCreators.length]);

  // 3. Handlers
  const handleAddCreator = async (creator: Creator) => {
    if (isInCampaign(creator.id)) return;
    setSuggested(prev => prev.map(c => c.id === creator.id ? { ...c, adding: true } : c));

    const res = await addCreatorToCampaign(campaignId, Number(creator.id));

    if (res.success) {
      const newCreator = { ...creator, status: 'invited', adding: false };
      setCampaignCreators(prev => [...prev, newCreator]);
      setSuggested(prev => prev.filter(c => c.id !== creator.id));
    } else {
      alert("Failed to add creator. " + (res.message || ""));
      setSuggested(prev => prev.map(c => c.id === creator.id ? { ...c, adding: false } : c));
    }
  };

  const handleRemoveCreator = async (creatorId: string) => {
    setCampaignCreators(prev => prev.map(c => c.id === creatorId ? { ...c, removing: true } : c));
    const res = await removeCreatorFromCampaign(campaignId, creatorId);

    if (res.success) {
      setCampaignCreators(prev => prev.filter(c => c.id !== creatorId));
      loadSuggestions(false);
    } else {
      alert("Failed to remove creator.");
      setCampaignCreators(prev => prev.map(c => c.id === creatorId ? { ...c, removing: false } : c));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-[#823A5E]" />
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen bg-gray-50/50 pb-20 ${inter.className}`}
      >
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {campaignDetails?.title || "Campaign Details"}
                        </h1>
                        <p className="text-xs text-gray-500">Manage creators and insights</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <div className="p-1 bg-green-100 rounded-full">
                        <DollarSign className="w-3 h-3 text-green-700" />
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-0.5">Budget</span>
                        <span className="block text-sm font-bold text-gray-900 leading-none">
                        ${campaignDetails?.budget?.toLocaleString() || "0"}
                        </span>
                    </div>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
          
          {/* Section 1: Active Creators */}
          <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#823A5E]" /> 
                Active Creators 
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{campaignCreators.length}</span>
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaignCreators.map(c => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={c.id} 
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex-shrink-0 flex items-center justify-center border border-gray-200 text-gray-400">
                       <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm">{c.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveCreator(c.id)}
                    disabled={c.removing}
                    className="ml-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {c.removing ? <Loader2 className="w-4 h-4 animate-spin"/> : "Remove"}
                  </button>
                </motion.div>
              ))}
              
              {campaignCreators.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <Users className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-medium">No creators invited yet</p>
                  <p className="text-sm text-gray-500">Select from the recommendations below to get started.</p>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Suggestions */}
          <section className="relative">
             <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-[#823A5E]/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[#823A5E]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div className="relative -mx-4 px-4 md:-mx-0 md:px-0">
                <div className="flex gap-5 overflow-x-auto pb-8 pt-2 snap-x hide-scrollbar">
                {suggested.map(c => (
                    <div 
                        key={c.id} 
                        className="snap-center flex-shrink-0 w-[280px] bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                    >
                    {/* FIXED UI: Image Top, Name Bottom */}
                    <div className="h-32 bg-gray-100 relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
                        <Users className="w-10 h-10 text-gray-300 opacity-50" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                            {getPlatformIcon(c.platform)}
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 text-lg truncate leading-tight" title={c.name}>
                                {c.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Content Creator</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Followers</span>
                                <span className="block text-sm font-bold text-gray-900">{c.followers}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Eng. Rate</span>
                                <span className="block text-sm font-bold text-green-600">{c.engRate}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAddCreator(c)}
                            disabled={c.adding}
                            className="mt-auto w-full py-2.5 bg-[#823A5E] text-white rounded-xl text-sm font-semibold hover:bg-[#6d2e4f] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {c.adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite to Campaign"}
                        </button>
                    </div>
                    </div>
                ))}
                
                 {/* Load More Card */}
                 {hasMore && (
                    <div className="flex-shrink-0 w-[150px] flex items-center justify-center">
                         <button
                            onClick={() => loadSuggestions(true)}
                            disabled={suggestionsLoading}
                            className="group flex flex-col items-center gap-3 text-gray-400 hover:text-[#823A5E] transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-[#823A5E] transition-colors bg-white">
                                {suggestionsLoading ? <Loader2 className="animate-spin w-5 h-5"/> : <ArrowLeft className="w-5 h-5 rotate-180"/>}
                            </div>
                            <span className="text-sm font-medium">Load More</span>
                        </button>
                    </div>
                 )}
                </div>
            </div>
          </section>

        </main>

        {errorMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-red-200 shadow-xl rounded-xl p-4 flex items-start gap-3 text-red-800 animate-in slide-in-from-bottom-5">
            <div className="p-2 bg-red-100 rounded-full shrink-0">
                <Loader2 className="w-4 h-4" /> 
            </div>
            <div>
                <h4 className="font-bold text-sm">Error</h4>
                <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}