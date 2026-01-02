"use client";

import { Trash2 } from "lucide-react"; 
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; 
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type CardProps = {
  id: number;
  title: string;
  date: string;
  onDelete: (id: number) => void;
};

/**
 * Card Component
 * Displays a single campaign summary.
 * - Handles navigation to details page on click.
 * - Handles deletion logic.
 */
export default function Card({ id, title, date, onDelete }: CardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from triggering card navigation
    if (confirm("Are you sure you want to delete this campaign?")) {
      setIsDeleting(true);
      onDelete(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }} // Subtle zoom effect for interactivity
      className="w-full"
    >
      <p className={`${inter.className} text-xs text-gray-400 mb-2 pl-1`}>
        Created: {date}
      </p>

      <div
        onClick={() => router.push(`/WebCampaign/${id}`)}
        className="group relative w-full bg-white rounded-2xl shadow-sm border border-gray-200 
        p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between 
        gap-4 cursor-pointer hover:shadow-md transition-all duration-300"
      >
        {/* Left: Title & Hint */}
        <div className="flex-1">
          <h2 className={`${inter.className} text-gray-900 text-lg font-bold group-hover:text-[#823A5E] transition-colors`}>
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tap to view details</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Removed 'Fund' button as requested */}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "..." : <Trash2 size={16} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}