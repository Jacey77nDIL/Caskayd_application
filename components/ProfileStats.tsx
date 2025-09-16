"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface Platform {
  name: string;
  followers: string;
  reach: string;
  engagementRate: string;
}

interface ProfileStatsProps {
  name: string;
  platforms: Platform[];
  campaignId?: string | null;
}

export default function ProfileStats({
  name,
  platforms,
  campaignId,
}: ProfileStatsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAddToCampaign() {
    if (!campaignId) {
      alert("No campaign selected!");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          creatorName: name,
        }),
      });

      if (!response.ok) {
        // try to get error text from body for better feedback
        let text;
        try {
          text = await response.text();
        } catch {
          text = "Unknown server error";
        }
        throw new Error(text || "Failed to create conversation");
      }

      const data = await response.json();

      // Accept multiple possible id field names from different backends
      const conversationId =
        data?.id ?? data?.conversation_id ?? data?.conversationId ?? null;

      if (!conversationId) {
        console.error("API returned no conversation id:", data);
        throw new Error("No conversation id returned from server");
      }

      setSuccess(true);

      // Redirect to WebMessages with conversationId
      // Convert to string in case id is numeric
      router.push(`/WebMessages?conversationId=${String(conversationId)}`);
    } catch (err: any) {
      console.error("Error adding to campaign:", err);
      alert(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-transparent text-white p-6">
      <h2 className="text-3xl font-bold mb-6">{name}</h2>

      <div className="overflow-x-auto">
        <table
          className={`${inter.className} w-full text-left border border-gray-700 rounded-md overflow-hidden`}
        >
          <thead>
            <tr className="bg-[#121212] text-white">
              <th className="p-4 border-r border-gray-700">Platform</th>
              <th className="p-4 border-r border-gray-700">Followers</th>
              <th className="p-4 border-r border-gray-700">Average reach</th>
              <th className="p-4">Engagement Rate</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p, i) => (
              <tr key={i} className="bg-[#1E1E1E] border-t border-gray-700">
                <td className="p-4 border-r border-gray-700">{p.name}</td>
                <td className="p-4 border-r border-gray-700">{p.followers}</td>
                <td className="p-4 border-r border-gray-700">{p.reach}</td>
                <td className="p-4">{p.engagementRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddToCampaign}
        disabled={loading || success}
        className={`mt-6 w-full sm:w-[40%] py-3 rounded-2xl transition-transform duration-300 hover:shadow-lg hover:scale-105 
          ${loading ? "bg-gray-500 text-white" : "bg-white text-black hover:bg-gray-200"} ${
          success ? "opacity-80 cursor-default" : ""
        }`}
      >
        {loading ? "Adding..." : success ? "Started ✓" : "+ Add to Campaign"}
      </button>
    </div>
  );
}
