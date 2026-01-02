"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Check, X } from "lucide-react";

type RequestCardProps = {
  logo: string; // This will now accept the campaign_image URL
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

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isProcessing) action();
  };

  return (
    <motion.div
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="group relative flex flex-col bg-white border border-gray-100 
                 rounded-2xl p-5 shadow-sm cursor-pointer overflow-hidden transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14 flex-shrink-0">
             {/* ✅ Improved Image handling */}
             <Image
               src={logo && logo !== " " ? logo : "/images/placeholder-logo.png"}
               alt={title}
               fill
               className="rounded-xl object-cover border border-gray-200"
             />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{title}</h3>
            <p className="text-sm text-green-600 font-bold mt-0.5">{price}</p>
          </div>
        </div>

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