"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from "next/font/google";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { FaYoutube, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";

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

// Interface matches your "Good Response" JSON
interface Creator {
  id: string; // This will store the 'creator_id'
  name: string;
  avatar: string;
  status: string;
  // Optional fields (Backend doesn't send these on detail view yet)
  platform?: string;
  followers?: string;
  reach?: string;
  engRate?: string;
  
  // UI states
  adding?: boolean;
  removing?: boolean;
}

function getPlatformIcon(platform: string = "") {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <FaYoutube className="text-red-500 text-xl" />;
  if (p.includes('instagram')) return <FaInstagram className="text-pink-500 text-xl" />;
  if (p.includes('tiktok')) return <FaTiktok className="text-black text-xl" />;
  if (p.includes('twitter') || p.includes('x')) return <FaTwitter className="text-sky-500 text-xl" />;
  return <span className="text-gray-300 text-sm">-</span>;
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
      setErrorMessage(null); // Reset error

      console.log("Fetching campaign:", campaignId); // DEBUG LOG

      
      console.log("Campaign API Response:", res); // DEBUG LOG
      
      if (res.success && res.data) {
        setCampaignDetails(res.data);
        
        // MAPPING FIX: Robustly handle your backend JSON structure
        const mappedCreators = (res.data.creators || []).map((c: any) => ({
          id: c.creator_id.toString(), // Use the creator_id, not the association id
          name: c.creator_name || "Unknown Creator",
          avatar: "/images/placeholder-avatar.jpg", // Fallback since API doesn't send avatar yet
          status: c.status || "invited",
          platform: "Instagram", // Defaulting for now
          followers: "-",
          reach: "-",
          engRate: "-"
        }));
        setCampaignCreators(mappedCreators);
      } else {
        // SHOW THE ERROR ON SCREEN
        setErrorMessage(res.message || "Failed to load campaign.");
        console.error("Error loading campaign:", res.message);
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
    const res = await getRecommendations({ offset: currentOffset, limit: 5 });

    if (res.success && res.data) {
      const rawRecs = res.data.recommendations || [];
      const hasMoreRecs = res.data.pagination?.has_more ?? false;

      const mappedRecs = rawRecs.map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        avatar: c.image || "/images/placeholder-avatar.jpg",
        followers: c.followers_count?.toLocaleString() || "0",
        reach: c.reach_7d?.toLocaleString() || "0",
        engRate: c.engagement_rate || "0",
        platform: c.platform || "Instagram",
        status: "suggestion"
      }));

      const filteredRecs = mappedRecs.filter((c: Creator) => !isInCampaign(c.id));

      if (isLoadMore) {
        setSuggested(prev => [...prev, ...filteredRecs]);
        setOffset(prev => prev + 5);
      } else {
        setSuggested(filteredRecs);
        setOffset(5);
      }
      setHasMore(hasMoreRecs);
    }
    setSuggestionsLoading(false);
  }, [offset, hasMore, isInCampaign]);

  useEffect(() => {
    loadSuggestions(false);
  }, [campaignCreators.length]);

  // 3. Add Creator Handler
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

  // 4. Remove Creator Handler
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
        className="min-h-screen bg-gradient-to-b from-pink-50 to-gray-100 p-4 md:p-10"
      >
        {/* Header */}
        <header className="flex items-center justify-between max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-lg shadow-sm hover:shadow">
              <ArrowLeft className="text-gray-700" size={24} />
            </button>
            <h1 className={`${inter.className} text-3xl font-bold text-gray-900`}>
              {campaignDetails?.title || "Campaign Details"}
            </h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
             <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Budget</span>
             <span className="block text-xl font-bold text-[#823A5E]">
               ${campaignDetails?.budget?.toLocaleString() || "0"}
             </span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto space-y-10">
          
          {/* Active Creators Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#823A5E]" /> 
              Creators ({campaignCreators.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaignCreators.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                       {/* Since avatar might be missing from backend, we use a reliable fallback */}
                       <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{c.name}</p>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveCreator(c.id)}
                    disabled={c.removing}
                    className="text-red-500 text-sm font-medium hover:underline disabled:text-gray-400"
                  >
                    {c.removing ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
              
              {campaignCreators.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <p className="text-gray-500 font-medium">No creators in this campaign yet.</p>
                  <p className="text-sm text-gray-400">Add from the suggestions below.</p>
                </div>
              )}
            </div>
          </section>

          {/* Suggestions Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested for You</h2>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4">
                {suggested.map(c => (
                  <div key={c.id} className="min-w-[280px] bg-white rounded-xl border border-gray-200 shadow-sm">
                    {/* Header Image */}
                    <div className="relative h-32 bg-gray-200">
                       <div className="absolute inset-0 flex items-center justify-center">
                          {/* Fallback image */}
                          <Users className="w-12 h-12 text-gray-400" />
                       </div>
                       <p className="absolute bottom-2 left-3 text-black font-bold text-lg bg-white/80 px-2 rounded backdrop-blur-sm">
                         {c.name}
                       </p>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Followers</span>
                        <span className="font-bold text-gray-900">{c.followers}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Platform</span>
                        <span>{getPlatformIcon(c.platform)}</span>
                      </div>

                      <button
                         onClick={() => handleAddCreator(c)}
                         disabled={c.adding}
                         className="w-full py-2 bg-[#823A5E] text-white rounded-lg font-medium hover:bg-[#6d2e4f] disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {c.adding && <Loader2 className="w-4 h-4 animate-spin" />}
                        {c.adding ? "Adding..." : "Add to Campaign"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => loadSuggestions(true)}
                  disabled={suggestionsLoading}
                  className="text-[#823A5E] font-medium hover:underline flex items-center gap-2"
                >
                  {suggestionsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Load More Suggestions
                </button>
              </div>
            )}
          </section>
        </main>
        {errorMessage && (
          <div className="max-w-7xl mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const lower = (status || 'invited').toLowerCase();
  let colorClass = 'bg-gray-100 text-gray-600';
  
  if (lower === 'accepted') colorClass = 'bg-green-100 text-green-700';
  else if (lower === 'declined') colorClass = 'bg-red-100 text-red-700';
  else if (lower === 'invited') colorClass = 'bg-blue-50 text-blue-700 border border-blue-200';
  
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
      {status || 'Invited'}
    </span>
  );
}