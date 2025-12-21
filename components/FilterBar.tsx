"use client";

import React, { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import { ChevronDown, Check, Users, Tag, Activity, MessageSquare } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { FiltersState } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

interface DropdownOption { label: string; value: string; }

interface FilterBarProps {
  filters: FiltersState;
  onFilterChange: (key: keyof FiltersState, value: string | null) => void;
  nicheOptions: DropdownOption[]; 
}

export default function FilterBar({ filters, onFilterChange, nicheOptions }: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtersConfig = [
    { key: "niche", label: "Niches", icon: <Tag size={14} />, options: nicheOptions },
    { key: "reach", label: "Reach", icon: <MessageSquare size={14} />, options: [{ label: "1k-10k", value: "1k-10k" }, { label: "10k-100k", value: "10k-100k" }, { label: "100k+", value: "100k-1M" }] },
    { key: "followers", label: "Followers", icon: <Users size={14} />, options: [{ label: "Micro", value: "1k-10k" }, { label: "Macro", value: "100k+" }] },
    { key: "engagement_rate", label: "Eng. Rate", icon: <Activity size={14} />, options: [{ label: "> 1%", value: "1" }, { label: "> 3%", value: "3" }, { label: "> 5%", value: "5" }] },
  ];

  return (
    <div ref={wrapperRef} className="w-full">
      <h2 className={`${inter.className} text-lg font-semibold text-black mb-3 px-1`}>Filters</h2>

      {/* ✅ REVERTED: Back to flex-wrap so it flows naturally like before */}
      <div className="flex flex-wrap gap-3 items-center">
        {filtersConfig.map((filter) => {
          const isActive = !!filters[filter.key as keyof FiltersState];

          return (
            <div key={filter.key} className="relative">
              <button
                onClick={() => setOpenFilter(openFilter === filter.key ? null : filter.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${isActive 
                    ? "bg-[#823A5E] text-white border-[#823A5E] shadow-md" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {filter.icon}
                {filter.label}
                <ChevronDown size={14} className={`transition-transform duration-200 ${openFilter === filter.key ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openFilter === filter.key && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    // ✅ FIXED: Added z-[60] so it definitely floats OVER the Creator Cards
                    className="absolute top-full mt-2 left-0 z-[60] w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto p-1">
                      {filter.options.length === 0 ? (
                        <div className="p-3 text-gray-400 text-xs text-center">No options</div>
                      ) : (
                        filter.options.map((option) => {
                          const isSelected = filters[filter.key as keyof FiltersState] === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                onFilterChange(filter.key as keyof FiltersState, isSelected ? null : option.value);
                                setOpenFilter(null);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <span className={`${isSelected ? "text-[#823A5E] font-semibold" : "text-gray-700"}`}>
                                {option.label}
                              </span>
                              {isSelected && <Check size={14} className="text-[#823A5E]" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        
        {Object.values(filters).some(Boolean) && (
           <button 
             onClick={() => {
                // Add your clear logic here
             }}
             className="text-xs text-gray-500 underline px-2"
           >
             Reset
           </button>
        )}
      </div>
    </div>
  );
}