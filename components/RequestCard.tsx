"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type RequestCardProps = {
  logo: string;
  title: string;
  price: string;
  onClick: () => void;
};

export default function RequestCard({ logo, title, price, onClick }: RequestCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col bg-gradient-to-r from-[#1d2766] to-[#25317e] 
                 text-white rounded-xl p-4 shadow-md cursor-pointer 
                 transition-all duration-300 overflow-hidden"
      layout // ✅ enables layout animations
      transition={{
        layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }, // smoother curve
      }}
      whileHover={{ scale: 1.02 }} // small grow for subtle feedback
    >
      {/* Top Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Image
            src={logo}
            alt={title}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h3 className="font-medium text-sm sm:text-base">{title}</h3>
        </div>

        {/* Right side buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2">
          <button className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
            Accept
          </button>
          <button className="border border-gray-400 text-gray-200 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
            Refine
          </button>
          <button className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
            Decline
          </button>
        </div>
      </div>

      {/* Expanding section */}
      <AnimatePresence initial={false}>
        {hovered && (
          <motion.div
            key="expand"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // easeOutCubic
            }}
            className="mt-3 pt-2 pl-[52px] text-sm text-gray-200"
          >
            <p>{price}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
