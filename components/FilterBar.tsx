//FilterBar
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import { Layers, MessageSquare, ChevronDown, Check, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// 🧩 Filter Types
interface FiltersState {
  platform: string | null;
  reach: string | null; // renamed from impressions
  price: string | null;
  followers: string | null; // new filter
}

interface FilterBarProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: keyof FiltersState;
  label: string;
  icon: React.ReactNode;
  options: DropdownOption[];
}

// 🧠 Filter Configuration
const filtersConfig: FilterConfig[] = [
  {
    key: "platform",
    label: "Platform",
    icon: <Layers className="w-4 h-4 mr-2" />,
    options: [
      { label: "Facebook", value: "facebook" },
      { label: "TikTok", value: "tiktok" },
      { label: "Instagram", value: "Instagram" },
    ],
  },
  {
    key: "reach", // renamed key
    label: "Reach", // renamed label
    icon: <MessageSquare className="w-4 h-4 mr-2" />,
    options: [
      { label: "1k - 10k", value: "1k-10k" },
      { label: "11k - 100k", value: "11k-100k" },
      { label: "100k+", value: "100k+" },
    ],
  },
  {
    key: "followers", // new filter
    label: "Followers",
    icon: <Users className="w-4 h-4 mr-2" />, // 👤 people icon
    options: [
      { label: "1k - 10k", value: "1k-10k" },
      { label: "11k - 100k", value: "11k-100k" },
      { label: "100k+", value: "100k+" },
    ],
  },
  {
    key: "price",
    label: "Price",
    icon: <span className="mr-2 font-bold">₦</span>,
    options: [
      { label: "5k", value: "5k" },
      { label: "5k - 10k", value: "5k-10k" },
      { label: "10k+", value: "10k+" },
    ],
  },
];

// 🎛️ FilterBar Component
export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Header */}
      <h2 className={`${inter.className} text-lg font-semibold text-black mb-4`}>Filter</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
        {filtersConfig.map((filter) => (
          <div key={filter.key} className="relative">
            {/* Filter Button */}
            <button
              onClick={() => setOpenFilter(openFilter === filter.key ? null : filter.key)}
              className={`${inter.className} flex items-center px-3 py-1.5 
              bg-[#823A5E] text-white rounded-full text-sm transition-all duration-200 
              hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#823A5E]`}
            >
              {filter.icon}
              {filter.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
  {openFilter === filter.key && (
    <motion.div
      key={filter.key}
      initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-10 left-0 origin-top bg-white rounded-xl shadow-lg p-2 z-50 
      w-40 sm:w-48 text-sm border border-gray-100"
    >
      {filter.options.map((option) => {
        const isSelected = filters[filter.key] === option.value;
        return (
          <div
            key={option.value}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                [filter.key]: prev[filter.key] === option.value ? null : option.value,
              }))
            }
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
          >
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                isSelected ? "bg-[#823A5E] border-[#823A5E]" : "border-gray-400"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span>{option.label}</span>
          </div>
        );
      })}
    </motion.div>
  )}
</AnimatePresence>

          </div>
        ))}
      </div>
    </div>
  );
}
