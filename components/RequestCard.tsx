"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";

type RequestCardProps = {
  logo: string;
  title: string;
  price: string;
  status: string;
  onClick: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
};

export default function RequestCard({ 
  logo, 
  title, 
  price, 
  status,
  onClick, 
  onAccept, 
  onDecline, 
  isProcessing 
}: RequestCardProps) {
  const [hovered, setHovered] = useState(false);

  // Stop click propagation so clicking a button doesn't open the modal
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isProcessing) action();
  };

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="group relative flex flex-col bg-white border border-gray-100 
                 rounded-2xl p-5 shadow-sm cursor-pointer overflow-hidden
                 transition-all duration-300"
    >
      {/* Decorative Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 flex-shrink-0">
             <Image
              src={logo}
              alt={title}
              fill
              className="rounded-full object-cover border border-gray-200"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 font-medium">{price}</p>
          </div>
        </div>

        {/* Action Buttons - Only show if invited */}
        {status === 'invited' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleActionClick(e, onAccept)}
              disabled={isProcessing}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
              title="Accept"
            >
              {isProcessing ? <Loader2 className="animate-spin w-4 h-4"/> : <Check size={18} />}
            </button>
            
            <button 
              onClick={(e) => handleActionClick(e, onDecline)}
              disabled={isProcessing}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
              title="Decline"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}