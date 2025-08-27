"use client";
import React, { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import { Layers, MessageSquare, ChevronDown, Check } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface DropdownOption {
  label: string;
  value: string;
}

const filters = [
  {
    key: "platform",
    label: "Platform",
    icon: <Layers className="w-4 h-4 mr-2" />,
    options: [
      { label: "Facebook", value: "facebook" },
      { label: "TikTok", value: "tiktok" },
    ],
  },
  {
    key: "impressions",
    label: "Impressions",
    icon: <MessageSquare className="w-4 h-4 mr-2" />,
    options: [
      { label: "1k - 10k", value: "1k-10k" },
      { label: "11k - 100k", value: "11k-100k" },
    ],
  },
  {
    key: "price",
    label: "Price",
    icon: <span className="mr-2 font-bold">₦</span>,
    options: [
      { label: "5k", value: "5k" },
      { label: "5k - 10k", value: "5k-10k" },
    ],
  },
];

export default function FilterBar() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string | null>>({
    platform: null,
    impressions: null,
    price: null,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <h2
        className={`${inter.className} text-lg font-semibold text-white mb-4 sm:mb-0`}
      >
        Filter
      </h2>

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <div key={filter.key} className="relative">
            <button
              onClick={() =>
                setOpenFilter(openFilter === filter.key ? null : filter.key)
              }
              className={`${inter.className} flex items-center 
  px-2 sm:px-3 py-1 sm:py-1.5 
  bg-[#823A5E] text-white rounded-full 
  text-xs sm:text-sm 
  transition-all duration-200 hover:scale-105`}
            >
              {filter.icon}
              {filter.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {/* Dropdown */}
            {openFilter === filter.key && (
              <div className="absolute top-10 left-0 
  w-32 sm:w-40 md:w-48 
  bg-white rounded-xl shadow-lg p-2 z-50 text-xs sm:text-sm">
                {filter.options.map((option) => {
                  const isSelected = selected[filter.key] === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [filter.key]: option.value,
                        }))
                      }
                      className="flex items-center gap-2 px-3 py-2 text-black cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
