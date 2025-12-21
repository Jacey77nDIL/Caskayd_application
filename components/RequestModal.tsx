"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CampaignInvitation } from "@/utils/api";
import { Loader2 } from "lucide-react";

type RequestModalProps = {
  show: boolean;
  onClose: () => void;
  data: CampaignInvitation | null;
  // ✅ New props
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
};

export default function RequestModal({ 
  show, 
  onClose, 
  data, 
  onAccept, 
  onDecline, 
  isProcessing 
}: RequestModalProps) {
  if (!data) return null;

  // Format dates for display
  const startDate = new Date(data.campaign_start_date).toLocaleDateString();
  const endDate = new Date(data.campaign_end_date).toLocaleDateString();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={onClose} // Close when clicking background
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
            className="bg-white p-6 rounded-xl max-w-[500px] w-full mx-4 relative shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                {data.business_name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-lg text-black">{data.campaign_title}</h2>
                <p className="text-sm text-gray-500">{data.business_name}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-sm text-gray-400 uppercase">Budget</h3>
                <p className="text-xl font-bold text-green-600">₦{data.campaign_budget.toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-400 uppercase">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{data.campaign_description}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-gray-400 uppercase">Start Date</h3>
                  <p className="text-black font-medium">{startDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-400 uppercase">End Date</h3>
                  <p className="text-black font-medium">{endDate}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div>
                <h3 className="font-semibold text-sm text-gray-400 uppercase mb-1">Status</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  data.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  data.status === 'declined' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {data.status}
                </span>
              </div>
            </div>

            {/* Actions - Only show if status is 'invited' */}
            {data.status === 'invited' && (
              <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
                {/* ACCEPT BUTTON */}
                <button 
                  onClick={onAccept}
                  disabled={isProcessing}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : "Accept Campaign"}
                </button>

                {/* DECLINE BUTTON */}
                <button 
                  onClick={onDecline}
                  disabled={isProcessing}
                  className="border border-red-200 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Decline
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}