"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CampaignInvitation } from "@/utils/api";
import { Loader2, FileText, ExternalLink, Calendar } from "lucide-react";
import Image from "next/image";

type RequestModalProps = {
  show: boolean;
  onClose: () => void;
  data: CampaignInvitation | null;
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

  const startDate = new Date(data.campaign_start_date).toLocaleDateString();
  const endDate = new Date(data.campaign_end_date).toLocaleDateString();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* ✅ NEW: Hero Image Area */}
            <div className="relative h-48 w-full bg-gray-100">
               {data.campaign_image && data.campaign_image !== " " ? (
                 <Image 
                   src={data.campaign_image} 
                   alt={data.campaign_title}
                   fill
                   className="object-cover"
                 />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                   <span className="text-sm font-medium">No Cover Image</span>
                 </div>
               )}
               <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 leading-tight">{data.campaign_title}</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">{data.business_name}</p>
                    </div>
                    <div className="text-right bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                        <p className="text-lg font-bold text-green-700">₦{data.campaign_budget.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Campaign</h3>
                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {data.campaign_description}
                        </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                             <div className="bg-blue-50 p-2 rounded-md text-blue-600"><Calendar size={18} /></div>
                             <div>
                                <span className="text-xs text-gray-400 uppercase block">Start</span>
                                <span className="font-semibold text-gray-800 text-sm">{startDate}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                             <div className="bg-purple-50 p-2 rounded-md text-purple-600"><Calendar size={18} /></div>
                             <div>
                                <span className="text-xs text-gray-400 uppercase block">End</span>
                                <span className="font-semibold text-gray-800 text-sm">{endDate}</span>
                             </div>
                        </div>
                    </div>

                    {/* ✅ NEW: Brief Download Section */}
                    {data.campaign_brief_file_url && data.campaign_brief_file_url !== " " && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resources</h3>
                            <a 
                                href={data.campaign_brief_file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900">Campaign Brief</p>
                                        <p className="text-xs text-blue-600">Download requirements</p>
                                    </div>
                                </div>
                                <ExternalLink size={18} className="text-blue-400 group-hover:text-blue-600" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
               {data.status === 'invited' ? (
                 <div className="flex gap-3">
                    <button 
                      onClick={onAccept}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 hover:shadow-md"
                    >
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Accept Campaign"}
                    </button>
                    <button 
                      onClick={onDecline}
                      disabled={isProcessing}
                      className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition disabled:opacity-50"
                    >
                      Decline
                    </button>
                 </div>
               ) : (
                 <div className="text-center py-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
                      data.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {data.status}
                    </span>
                 </div>
               )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}