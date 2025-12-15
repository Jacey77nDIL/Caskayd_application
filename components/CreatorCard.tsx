"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast"; // 1. Import Toast

// IMPORT: Use the centralized API functions (Uses cookies/fetchWithAuth internally)
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

  // State
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Fetch campaigns on mount using the API utility
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const res = await getCampaigns();
        
        if (res.success && Array.isArray(res.data)) {
          setCampaigns(res.data);
        } else {
          console.error("Failed to load campaigns:", res.message);
          toast.error("Could not load campaigns");
        }
      } catch (error) {
        console.error("Unexpected error fetching campaigns:", error);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleAddCreator = async () => {
    if (selectedCampaigns.length === 0) return;

    setIsSubmitting(true);
    // Optional: Loading toast
    const toastId = toast.loading("Adding creator...");

    try {
      // Create an array of API calls
      const requests = selectedCampaigns.map((campaignId) =>
        addCreatorToCampaign(campaignId, creator.id)
      );

      // Execute all in parallel
      const responses = await Promise.all(requests);

      // Check for errors (api.ts returns { success: boolean })
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        toast.dismiss(toastId);
        toast.error("Failed to add to some campaigns.");
        console.error("Some additions failed", failed);
        setIsSubmitting(false); // Allow retry
        return;
      }

      // Success path
      toast.dismiss(toastId);
      toast.success("Added to campaign successfully!");
      
      // Delay redirect slightly so user sees the success message
      setTimeout(() => {
        setShowModal(false);
        router.push("/WebMessages");
      }, 1500);
      
    } catch (err) {
      toast.dismiss(toastId);
      console.error("Critical error adding creator:", err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAddCampaign = () => {
    router.push("/WebCampaign?openAdd=true");
  };

  return (
    <div className="relative flex flex-col-reverse md:flex-row justify-between items-center p-6 sm:p-8 gap-8 transition">
      {/* 2. Add Toaster to the component (or ensure it's in your Root Layout) */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Section - Info */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {creator.name}
        </h3>
        <p className={`${inter.className} text-black font-semibold mb-6 text-lg`}>
          Followers: {creator.followers_count} | Engagement:{" "}
          {creator.engagement_rate}
        </p>

        {/* Stats Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-gray-700 bg-gray-50">
                <th className="text-white bg-black border border-gray-300 text-left py-2 px-4 font-semibold">
                  Platform
                </th>
                <th className="text-white bg-black border border-gray-300 text-left py-2 px-4 font-semibold">
                  Followers
                </th>
                <th className="text-white bg-black border border-gray-300 text-left py-2 px-4 font-semibold">
                  Avg Reach
                </th>
                <th className="text-white bg-black border border-gray-300 text-left py-2 px-4 font-semibold">
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="text-white bg-[#373737] border border-gray-300 py-2 px-4">
                  Instagram
                </td>
                <td className="text-white bg-[#373737] border border-gray-300 py-2 px-4">
                  {creator.followers_count}
                </td>
                <td className="text-white bg-[#373737] border border-gray-300 py-2 px-4">
                  {creator.reach_7d ?? "-"}
                </td>
                <td className="text-white bg-[#373737] border border-gray-300 py-2 px-4">
                  {creator.engagement_rate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-2 bg-[#823A5E] text-white text-sm rounded-lg hover:bg-[#692d4c] transition-transform duration-300 hover:shadow-lg hover:scale-105"
        >
          + Add to Campaign
        </button>
      </div>

      {/* Right Section - Image */}
      <div className="w-full md:w-auto flex justify-center md:justify-end">
        <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden shadow-md">
          <Image
            src="/images/ethan.jpg"
            alt={creator.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-lg w-[350px] sm:w-[400px] p-6"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold">Campaigns</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleAddCampaign();
                  }}
                  className="text-gray-600 hover:text-black hover:scale-110 duration-300 transition-transform text-xl font-bold"
                >
                  ADD +
                </button>
              </div>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {loadingCampaigns ? (
                  <p className="text-gray-500 text-sm text-center py-4">Loading campaigns...</p>
                ) : campaigns.length === 0 ? (
                  <p className="text-gray-500 text-sm">No campaigns found.</p>
                ) : (
                  campaigns.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns((prev) => [...prev, c.id]);
                          } else {
                            setSelectedCampaigns((prev) =>
                              prev.filter((item) => item !== c.id)
                            );
                          }
                        }}
                        className="w-7 h-7 rounded-full border-gray-400 focus:ring-[#823A5E]"
                      />
                      <span className={`${inter.className} text-black text-[15px]`}>
                        {c.title}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <div className="flex justify-center mt-8">
                <motion.button
                  disabled={selectedCampaigns.length === 0 || isSubmitting}
                  whileHover={
                    selectedCampaigns.length > 0 && !isSubmitting
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={
                    selectedCampaigns.length > 0 && !isSubmitting
                      ? { scale: 0.95 }
                      : {}
                  }
                  onClick={handleAddCreator}
                  className={`w-[50%] flex items-center justify-center py-2 rounded-lg transition-transform duration-300 ${
                    selectedCampaigns.length === 0 || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#823A5E] text-white hover:bg-[#692d4c]"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Done"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}