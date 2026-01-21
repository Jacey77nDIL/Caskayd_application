"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText, Download, Calendar, X, Building2, ExternalLink } from "lucide-react";
import Image from "next/image";

// Define the type (if not imported)
type CampaignInvitation = {
  campaign_title: string;
  business_name: string;
  campaign_image?: string;
  campaign_budget: number;
  campaign_description: string;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_brief_file_url?: string;
  status: string;
};

type RequestModalProps = {
  show: boolean;
  onClose: () => void;
  data: CampaignInvitation | null;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
};

// HELPER: Force Cloudinary to download file instead of viewing it
const getDownloadUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    // Inject 'fl_attachment' flag to force download header
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
};

export default function RequestModal({ 
  show, 
  onClose, 
  data, 
  onAccept, 
  onDecline, 
  isProcessing 
}: RequestModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!data) return null;

  const startDate = new Date(data.campaign_start_date).toLocaleDateString("en-GB", {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const endDate = new Date(data.campaign_end_date).toLocaleDateString("en-GB", {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const downloadUrl = data.campaign_brief_file_url 
    ? getDownloadUrl(data.campaign_brief_file_url) 
    : "";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4 font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- Hero Image Section --- */}
            <div className="relative h-48 w-full bg-gray-100 shrink-0">
              {!imgError && data.campaign_image && data.campaign_image.trim() !== "" ? (
                <Image 
                  src={data.campaign_image} 
                  alt={data.campaign_title}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)} // Handle 401/Broken images gracefully
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                  <Building2 size={40} className="mb-2 opacity-20" />
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-60">No Cover Image</span>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-600 hover:text-black rounded-full p-2 transition-all shadow-sm z-10"
              >
                <X size={20} />
              </button>

              {/* Status Badge (Overlay) */}
              <div className="absolute bottom-4 left-4">
                 <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm border ${
                   data.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 
                   data.status === 'declined' ? 'bg-red-100 text-red-700 border-red-200' : 
                   'bg-white text-gray-900 border-gray-200'
                 }`}>
                   {data.status}
                 </span>
              </div>
            </div>

            {/* --- Scrollable Content --- */}
            <div className="p-6 overflow-y-auto flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 leading-tight">{data.campaign_title}</h2>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                           <Building2 size={14} />
                           <span className="text-sm font-medium">{data.business_name}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                        <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {data.campaign_description || "No description provided."}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Calendar size={18} /></div>
                             <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Start Date</span>
                                <span className="font-semibold text-gray-900 text-sm">{startDate}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                             <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Calendar size={18} /></div>
                             <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">End Date</span>
                                <span className="font-semibold text-gray-900 text-sm">{endDate}</span>
                             </div>
                        </div>
                    </div>

                    {/* Brief Download - Enhanced */}
                    {downloadUrl && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Campaign Brief</h3>
                            <a 
                                href={downloadUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 border border-blue-100 bg-blue-50/30 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2.5 rounded-lg text-red-500 shadow-sm group-hover:scale-110 transition-transform border border-red-100">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Download Brief PDF</p>
                                        <p className="text-xs text-gray-500">Click to view full requirements</p>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-full text-gray-400 group-hover:text-blue-600 shadow-sm transition-colors">
                                    <Download size={18} />
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Sticky Footer --- */}
            {data.status === 'invited' && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-md flex gap-3">
                    <button 
                      onClick={onDecline}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={onAccept}
                      disabled={isProcessing}
                      className="flex-[2] px-4 py-3 rounded-xl font-bold text-white bg-[#823A5E] hover:bg-[#6d2e4f] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Accept Campaign"}
                    </button>
                </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}