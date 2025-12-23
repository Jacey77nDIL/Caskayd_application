"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Upload, Loader2, MapPin, DollarSign, Sparkles, FolderPlus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Components
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import CreatorPickerModal from "@/components/CreatorPickerModal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// API
import { 
  getCampaigns, 
  createCampaign, 
  deleteCampaign, 
  uploadCampaignBrief, 
  updateCampaign,
  getRecommendations 
} from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// --- TYPES ---
interface ApiCampaignData {
  id: number;
  title: string;
  created_at: string;
  brief_file_url?: string;
  platform?: string;
  reach?: string;
  filters?: { niche_ids?: number[]; };
}

interface Creator {
  id: number;
  name: string;
  followers_count: number;
  engagement_rate: string;
  niches: { id: number; name: string }[];
}

interface CreateCampaignResponse {
  campaign: ApiCampaignData;
  recommendations: Creator[];
}

type Campaign = {
  id: number;
  title: string;
  date: string;
  image?: string;
};

// --- CONSTANTS ---
const NICHE_MAP: Record<string, number> = {
  "Technology": 1, "Healthcare": 2, "Finance": 3, "Retail": 4, "Fashion": 5,
};

const getFollowerRange = (reachString: string) => {
  if (reachString === "1k-10k") return { min: 1000, max: 10000 };
  if (reachString === "10k-100k") return { min: 10000, max: 100000 };
  if (reachString === "100k-1M") return { min: 100000, max: 1000000 };
  return { min: 0, max: 0 };
};

export default function WebCampaign() {
  const searchParams = useSearchParams();

  // --- STATE ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [showCreatorPicker, setShowCreatorPicker] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<number | null>(null);
  const [recommendedCreators, setRecommendedCreators] = useState<Creator[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "", description: "", budget: "", startDate: "", endDate: "",
    briefText: "", previewImage: null as string | null,
    niche: "", platform: "", reach: "", location: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (searchParams.get("openAdd") === "true") setStep(1);
    
    const loadData = async () => {
      setIsLoading(true);
      const res = await getCampaigns();
      if (res.success && Array.isArray(res.data)) {
        const mapped: Campaign[] = res.data.map((c: ApiCampaignData) => ({
          id: c.id,
          title: c.title,
          date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Just now",
          image: c.brief_file_url || "/placeholder.png",
        }));
        setCampaigns(mapped);
      }
      setIsLoading(false);
    };
    loadData();
  }, [searchParams]);

  // --- HANDLERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, previewImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success("Campaign deleted");
    await deleteCampaign(id);
  };

const handleFinalSubmit = async () => {
    // 1. Validation
    const required = [
      formData.title, formData.description, formData.budget, 
      formData.startDate, formData.endDate, formData.niche
    ];
    if (required.some(f => !f)) {
      setError("Please fill in all fields.");
      toast.error("Missing required fields.");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating campaign...");

    try {
      // --- STEP 1: Create Campaign ---
      const { min, max } = getFollowerRange(formData.reach);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        brief: formData.briefText || " ",
        // ✅ FIX: Added this back. The backend likely expects this field to exist.
        // If your backend specifically wants "campaign_image", change this key to "campaign_image"
        brief_file_url: " ", 
        budget: parseInt(formData.budget),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        filters: {
          location: formData.location,
          min_followers: min,
          max_followers: max,
          engagement_rate: 0.05,
          niche_ids: [NICHE_MAP[formData.niche] || 1],
        },
      };

      const res = await createCampaign(payload);

      if (res.success && res.data) {
        const { campaign, recommendations } = res.data as CreateCampaignResponse;
        let finalBriefUrl = "";
        
        // [LOGIC] Logic to handle missing recommendations
        let finalRecommendations = recommendations || [];

        // --- STEP 2: Upload File ---
        if (selectedFile) {
          toast.loading("Uploading brief...", { id: toastId });
          const uploadRes = await uploadCampaignBrief(campaign.id, selectedFile);
          if (uploadRes.success && uploadRes.data) {
            finalBriefUrl = uploadRes.data.brief_url;
            
            // --- STEP 3: Update Campaign with URL ---
            // Ensure this key matches what your backend expects (brief_file_url vs campaign_image)
            await updateCampaign(campaign.id, { 
                ...campaign, 
                brief_file_url: finalBriefUrl 
            });
          }
        }

        // --- STEP 4: Fallback Recommendations ---
        if (finalRecommendations.length === 0) {
          toast.loading("Finding best creators...", { id: toastId });
          const recRes = await getRecommendations({
            min_followers: min,
            max_followers: max,
            niches: NICHE_MAP[formData.niche] || 1,
            location: formData.location,
            limit: 10
          });
          if (recRes.success && Array.isArray(recRes.data)) {
            finalRecommendations = recRes.data;
          }
        }

        toast.success("Campaign created!", { id: toastId });
        
        // Update UI
        setCampaigns(prev => [...prev, {
          id: campaign.id,
          title: campaign.title,
          date: new Date().toLocaleDateString(),
          image: finalBriefUrl
        }]);

        setCreatedCampaignId(campaign.id);
        setRecommendedCreators(finalRecommendations);
        setStep(0);
        setShowCreatorPicker(true);
        
        // Reset
        setSelectedFile(null);
        setFormData({ 
            title: "", description: "", budget: "", startDate: "", endDate: "",
            briefText: "", previewImage: null, briefFileUrl: "", 
            niche: "", platform: "", reach: "", location: ""
        });
      } else {
        throw new Error(res.message || "Failed to create");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating campaign", { id: toastId });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar />

      <main className="flex-1 flex flex-col md:ml-64 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`${inter.className} text-3xl font-bold text-[#691D3D]`}>Campaigns</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your marketing efforts</p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 bg-[#823A5E] text-white px-5 py-2.5 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Sparkles size={18} />
            Create New
          </button>
        </div>

        <div className="border-t border-gray-200 mb-8" />

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((c) => (
                <Card
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  date={c.date}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <FolderPlus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No campaigns yet</h3>
              <p className="text-gray-500 max-w-xs mt-2 mb-6">
                Start by creating your first campaign to connect with creators.
              </p>
              <button 
                onClick={() => setStep(1)}
                className="text-[#823A5E] font-semibold hover:underline"
              >
                Create Campaign
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- STEP 1 MODAL --- */}
      <Modal isOpen={step === 1} onClose={() => setStep(0)} title="Step 1: Details">
        <div className="space-y-5">
           <div className="flex gap-2 mb-6">
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign Title</label>
            <input
              value={formData.title}
              onChange={(e) => updateForm("title", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] transition-all"
              placeholder="e.g. Summer Launch 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] min-h-[100px] resize-none"
              placeholder="Describe your campaign goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Budget (₦)</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => updateForm("budget", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E]"
                    placeholder="500000"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#823A5E]/20"
                />
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#823A5E]/20"
                />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!formData.title || !formData.budget) {
                   toast.error("Title and Budget are required"); 
                   return;
                }
                setStep(2);
              }}
              className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Next Step
            </button>
          </div>
        </div>
      </Modal>

      {/* --- STEP 2 MODAL --- */}
      <Modal isOpen={step === 2} onClose={() => setStep(0)} title="Step 2: Targeting">
        <div className="space-y-5">
           <div className="flex gap-2 mb-6">
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Niche</label>
            <Select value={formData.niche} onValueChange={(val) => updateForm("niche", val)}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl">
                <SelectValue placeholder="Select Niche" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(NICHE_MAP).map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label>
                <Select value={formData.platform} onValueChange={(val) => updateForm("platform", val)}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Creator Size</label>
                <Select value={formData.reach} onValueChange={(val) => updateForm("reach", val)}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1k-10k">Nano (1k+)</SelectItem>
                    <SelectItem value="10k-100k">Micro (10k+)</SelectItem>
                    <SelectItem value="100k-1M">Macro (100k+)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Location</label>
            <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                    value={formData.location}
                    onChange={(e) => updateForm("location", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20"
                    placeholder="e.g. Lagos, Nigeria"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reference File (Optional)</label>
            {/* ✅ FIXED: Added 'relative' class below so the absolute label stays inside */}
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-[#823A5E]/50 transition-all cursor-pointer">
               {formData.previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.previewImage} alt="Preview" className="h-32 object-contain rounded-lg" />
               ) : (
                  <div className="text-center">
                    <div className="bg-gray-100 p-3 rounded-full inline-block mb-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Click to upload brief PDF or Image</p>
                  </div>
               )}
               <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
               <label onClick={(e) => {
                 const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                 input.click();
               }} className="absolute inset-0 cursor-pointer" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">{error}</p>}

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium px-4">
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </div>
      </Modal>

      <CreatorPickerModal
        isOpen={showCreatorPicker}
        onClose={() => setShowCreatorPicker(false)}
        campaignId={createdCampaignId ?? 0}
        creators={recommendedCreators}
      />
    </div>
  );
}