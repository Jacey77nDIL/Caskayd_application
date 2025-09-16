"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: number;
  name: string;
  image: string;
  platforms: {
    name: string;
    followers: string;
    reach: string;
    engagementRate: string;
  }[];
}

interface ProfileCarouselProps {
  profiles: CarouselItem[];
  campaignId?: string | null; // 👈 add
}

export default function ProfileCarousel({ profiles, campaignId }: ProfileCarouselProps) {
  const [current, setCurrent] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const prev = () => setCurrent((current - 1 + profiles.length) % profiles.length);
  const next = () => setCurrent((current + 1) % profiles.length);

  if (!profiles.length) return <p>No profiles available</p>;

  const currentProfile = profiles[current];
  const nextProfile = profiles[(current + 1) % profiles.length];

  const mainWidth = isMobile ? 300 : 400;
  const mainHeight = isMobile ? 420 : 560;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Carousel */}
        <div className="relative flex items-center lg:items-end justify-center gap-6 flex-shrink-0 w-full px-8 sm:px-6 md:px-0 order-1 md:order-2">
          {/* Buttons + Cards */}
          <button onClick={prev} aria-label="Previous profile"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white border border-white rounded-md hover:bg-black/80 z-10 lg:hidden">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={next} aria-label="Next profile"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white border border-white rounded-md hover:bg-black/80 z-10 lg:hidden">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div key={currentProfile.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto">
              <ProfileCard
                name={currentProfile.name}
                image={currentProfile.image}
                checked={false}
                onCheckChange={() => {}}
                width={mainWidth}
                height={mainHeight}
              />
            </motion.div>
          </AnimatePresence>

          {/* Next card preview */}
          <AnimatePresence mode="wait">
            <motion.div key={nextProfile.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="opacity-80 hidden lg:block">
              <ProfileCard
                name={nextProfile.name}
                image={nextProfile.image}
                checked={false}
                onCheckChange={() => {}}
                width={Math.round(mainWidth / 2)}
                height={Math.round(mainHeight / 2)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop buttons */}
          <button onClick={prev} aria-label="Previous profile"
            className="hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 p-3 bg-black text-white border border-white rounded-md hover:bg-black/80 z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} aria-label="Next profile"
            className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 p-3 bg-black text-white border border-white rounded-md hover:bg-black/80 z-10">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Stats */}
        <div className="w-full md:flex-1 order-2 md:order-1 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div key={currentProfile.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}>
              <ProfileStats
                name={currentProfile.name}
                platforms={currentProfile.platforms}
                campaignId={campaignId} // 👈 pass down
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
