"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation"; // 👈 import
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import ProfileCarousel from "@/components/ProfileCarousel";
import data from "@/data/influencers.json";

export default function Page() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId"); // 👈 grab from URL

  console.log("Campaign ID from URL:", campaignId); // 🐞 debug

  // 1️⃣ Define filters state here
  const [filters, setFilters] = useState({
    platform: null,
    impressions: null,
    price: null,
  });

  // 🔍 Define search query state
  const [searchQuery, setSearchQuery] = useState("");

  // 2️⃣ Apply filters + search to influencer data
  const filteredProfiles = useMemo(() => {
    return data.filter((profile) => {
      // filter by platform (from FilterBar)
      if (filters.platform) {
        const hasPlatform = profile.platforms.some(
          (p: any) => p.name.toLowerCase() === filters.platform
        );
        if (!hasPlatform) return false;
      }

      // filter by search query (name + platforms)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        const matchesName = profile.name.toLowerCase().includes(query);
        const matchesPlatform = profile.platforms.some((p: any) =>
          p.name.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesPlatform) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  return (
    <main className="min-h-screen bg-black text-white bg-[url('/images/backgroundImage.png')] bg-cover bg-center">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 mt-8">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-6">
          
          {/* 🔍 Search Bar */}
          <input
            type="text"
            placeholder="Search by name or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md text-black bg-white"
          />

          <FilterBar filters={filters} setFilters={setFilters} />
          

          {filteredProfiles.length > 0 ? (
            <ProfileCarousel
              profiles={filteredProfiles.map((p: any) => ({
                id: p.id,
                name: p.name,
                image: p.image,
                platforms: p.platforms ?? [],
              }))}
              campaignId={campaignId} // 👈 pass it down
            />
          ) : (
            <p>No profiles match your filters</p>
          )}
        </div>
      </div>
    </main>
  );
}
