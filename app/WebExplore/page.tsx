"use client";

import { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import CreatorCard from "@/components/CreatorCard";
import FilterBar from "@/components/FilterBar"; 
import { getRecommendations, getAvailableNiches, Creator, FiltersState, NicheOption } from "@/utils/api";
import { Loader2 } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface RecommendationsResponse {
  recommendations: Creator[];
  pagination?: any;
}

// Helper: Convert "1k-10k" strings to numbers
const parseRange = (value: string | null) => {
  if (!value) return { min: null, max: null };
  const clean = (str: string) => 
    parseFloat(str.toLowerCase().replace(/k/g, '000').replace(/m/g, '000000').replace(/,/g, ''));

  if (value.includes('+')) {
    const min = clean(value.replace('+', ''));
    return { min, max: null };
  }
  const parts = value.split('-');
  if (parts.length === 2) {
    return { min: clean(parts[0]), max: clean(parts[1]) };
  }
  return { min: null, max: null };
};

export default function WebExplore() {
const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nicheOptions, setNicheOptions] = useState<{label: string, value: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  
  const [filters, setFilters] = useState<FiltersState>({
    niche: null, 
    reach: null,
    engagement_rate: null, // NEW
    followers: null,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch available Niches on Mount
  useEffect(() => {
    const loadNiches = async () => {
        const res = await getAvailableNiches();
        if (res.success && Array.isArray(res.data)) {
            // Map the API response (id, name) to FilterBar format (value, label)
            const options = res.data.map((n: NicheOption) => ({
                label: n.name,
                value: n.id.toString() // Convert ID to string for the filter state
            }));
            setNicheOptions(options);
        }
    };
    loadNiches();
  }, []);

  // 2. Fetch Creators
  const fetchCreators = async (search = "", currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        limit: 20,
        offset: 0,
      };

      if (search) params.search = search;

      // Handle Followers/Reach Range
      const rangeValue = currentFilters.followers || currentFilters.reach;
      if (rangeValue) {
        const { min, max } = parseRange(rangeValue);
        if (min !== null) params.min_followers = min;
        if (max !== null) params.max_followers = max;
      }

      // Handle Niche (Sends ID string)
      if (currentFilters.niche) {
        params.niche = currentFilters.niche;
      }

      // NEW: Handle Engagement Rate
      if (currentFilters.engagement_rate) {
        // The value from FilterBar is already a clean number string like "3"
        params.engagement_rate = currentFilters.engagement_rate;
      }

      const response = await getRecommendations(params);

      if (response.success && response.data) {
        const data = response.data as RecommendationsResponse;
        const list = Array.isArray(data) ? data : (data.recommendations || []);
        setCreators(list);
      } else {
        if (response.message === "Not authenticated") {
             setError("Please log in to view creators.");
        } else {
             setCreators([]);
             setError(response.message || "Failed to load creators");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch creators on mount
  useEffect(() => {
    fetchCreators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCreators(val, filters);
    }, 600);
  };

  const handleFilterChange = (key: keyof FiltersState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchCreators(searchTerm, newFilters);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-64 relative">
        <div className="sticky top-0 z-20 bg-gray-50 pt-6 px-4 sm:px-8 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h1 className={`${inter.className} text-3xl font-bold text-[#691D3D]`}>
              Explore
            </h1>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search creators..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#823A5E] outline-none"
              />
               <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {/* Passed nicheOptions here */}
          <FilterBar filters={filters} onFilterChange={handleFilterChange} nicheOptions={nicheOptions} />
          <div className="mt-4 border-t border-[#BDBDBD]" />
        </div>

        <div className="flex-1 px-4 sm:px-8 pb-10 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-[#823A5E]" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button onClick={() => fetchCreators(searchTerm, filters)} className="text-[#823A5E] font-medium hover:underline">
                Try Again
              </button>
            </div>
          ) : creators.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
              <p className="text-lg">No creators found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}