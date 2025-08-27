"use client";
import React from "react";
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
}

export default function ProfileStats({ name, platforms }: ProfileStatsProps) {
  return (
    <div className="bg-transparent text-white p-6">
      {/* Name */}
      <h2 className="text-3xl font-bold mb-6">{name}</h2>

      {/* Table wrapper */}
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
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#1E1E1E]"
                } border-t border-gray-700`}
              >
                <td className="p-4 border-r border-gray-700">{p.name}</td>
                <td className="p-4 border-r border-gray-700">{p.followers}</td>
                <td className="p-4 border-r border-gray-700">{p.reach}</td>
                <td className="p-4">{p.engagementRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button */}
      <button className="mt-6 w-full sm:w-[40%] bg-white text-black py-3 rounded-2xl 
             transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:bg-gray-200">
        + Add to Campaign
      </button>
    </div>
  );
}
