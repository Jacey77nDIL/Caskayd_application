"use client";

import { Search, Compass, Menu } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function TopBar({ searchQuery, setSearchQuery }: TopBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Left side: Title */}
      <div className="flex items-center space-x-2">
        <Compass size={28} className="text-[#823A5E]" />
        <h2 className={`${inter.className} text-3xl sm:text-4xl font-semibold text-[#823A5E]`}>
          Discover Creators
        </h2>
      </div>

      {/* Right side: Search */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search creators..."
          className={`${inter.className} w-full pl-10 pr-3 py-2 border bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#823A5E]`}
        />
        <Search className="absolute right-3 top-2.5 text-black" size={20} />
      </div>
    </div>
  );
}
