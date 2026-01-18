"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Upload, Loader2, MapPin, DollarSign, Sparkles, FolderPlus, Image as ImageIcon } from "lucide-react";
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
  uploadCampaignImage,
  getRecommendations 
} from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// --- DATA TYPES ---
interface ApiCampaignData {
  id: number;
  title: string;
  created_at: string;
  brief_file_url?: string;
  campaign_image?: string;
}

interface Creator {
  id: number;
  name: string;
  followers_count: number;
  engagement_rate: string | number;
  image?: string;
  platform?: string;
  bio?: string;
  niches?: { id: number; name: string }[];
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

// --- HELPER: Normalize Creator Data ---
// Ensures data matches what CreatorPickerModal expects
const normalizeCreator = (c: any): Creator => ({
    id: c.id,
    name: c.name || "Unknown Creator",
    followers_count: c.followers_count || 0,
    // Handle specific backend quirk: sometimes string "4.3%", sometimes number 0.043
    engagement_rate: c.engagement_rate || 0, 
    image: c.image || undefined,
    bio: c.bio || "",
    platform: c.platform || "Instagram",
    niches: c.niches || []
});

export default function WebCampaign() {
  const searchParams = useSearchParams();

  // --- STATE ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stepper: 0=None, 1=Details, 2=Targeting, 3=Image
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  
  // Modal State
  const [showCreatorPicker, setShowCreatorPicker] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<number | null>(null);
  const [recommendedCreators, setRecommendedCreators] = useState<Creator[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "", description: "", budget: "", startDate: "", endDate: "",
    briefText: "", niche: "", platform: "", reach: "", location: "",
  });

  // Files
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [briefPreview, setBriefPreview] = useState<string | null>(null);
  
  const [campaignImageFile, setCampaignImageFile] = useState<File | null>(null);
  const [campaignImagePreview, setCampaignImagePreview] = useState<string | null>(null);

  // --- INITIAL FETCH ---
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
          image: c.campaign_image || c.brief_file_url || "/placeholder.png",
        }));
        setCampaigns(mapped);
      }
      setIsLoading(false);
    };
    loadData();
  }, [searchParams]);

  // --- HANDLERS ---
  const handleBriefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBriefFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBriefPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCampaignImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCampaignImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCampaignImagePreview(reader.result as string);
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

  // --- SUBMISSION LOGIC ---
  const handleFinalSubmit = async () => {
    if (!formData.title || !formData.budget || !formData.niche) {
      setError("Please fill in required fields.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating campaign...");

    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const { min, max } = getFollowerRange(formData.reach);
      const nicheId = NICHE_MAP[formData.niche] || 1;

      // 1. Create Base Campaign
      const payload = {
        title: formData.title,
        description: formData.description,
        brief: formData.briefText || " ",
        budget: parseInt(formData.budget),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        filters: {
          location: formData.location,
          min_followers: min,
          max_followers: max,
          engagement_rate: 0.05,
          niche_ids: [nicheId],
        },
      };

      const res = await createCampaign(payload);

      if (res.success && res.data) {
        const responseData = res.data as CreateCampaignResponse;
        const campaign = responseData.campaign;
        const campaignRecommendations = responseData.recommendations;
        console.log("Campaign response: ",campaignRecommendations)
        let rawRecommendations = campaignRecommendations || [];
        console.log("Creator recommendations: ",rawRecommendations)
        // 2. Upload Brief
        if (briefFile) {
          toast.loading("Uploading brief...", { id: toastId });
          await uploadCampaignBrief(campaign.id, briefFile);
        }

        // 3. Upload Cover Image
        if (campaignImageFile) {
          toast.loading("Uploading cover image...", { id: toastId });
          await uploadCampaignImage(campaign.id, campaignImageFile);
        }

        // 4. Fallback Recommendations if initial creation returns empty list
        if (rawRecommendations.length === 0) {
          toast.loading("Finding best creators...", { id: toastId });
          const recRes = await getRecommendations({
            min_followers: min,
            max_followers: max,
            niche: nicheId,
            location: formData.location,
            limit: 10
          });
          
          if (recRes.success && Array.isArray(recRes.data)) {
            rawRecommendations = recRes.data;
          }
        }

        // 5. Normalize Data for Modal
        const normalizedRecs = rawRecommendations.map(normalizeCreator);

        toast.success("Campaign created!", { id: toastId });

        // Update List UI
        setCampaigns(prev => [...prev, {
          id: campaign.id,
          title: campaign.title,
          date: new Date().toLocaleDateString(),
          image: campaignImagePreview || "/placeholder.png"
        }]);

        // State Setup for Modal
        setCreatedCampaignId(campaign.id);
        setRecommendedCreators(normalizedRecs); // ✅ Store normalized data

        // Close wizard, open Picker
        setStep(0);
        setTimeout(() => setShowCreatorPicker(true), 200);

        // Reset Form
        setBriefFile(null); setBriefPreview(null);
        setCampaignImageFile(null); setCampaignImagePreview(null);
        setFormData({ 
            title: "", description: "", budget: "", startDate: "", endDate: "",
            briefText: "", niche: "", platform: "", reach: "", location: ""
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
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((c) => (
                <Card key={c.id} id={c.id} title={c.title} date={c.date} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <FolderPlus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No campaigns yet</h3>
              <p className="text-gray-500 max-w-xs mt-2 mb-6">Start by creating your first campaign to connect with creators.</p>
              <button onClick={() => setStep(1)} className="text-[#823A5E] font-semibold hover:underline">
                Create Campaign
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- STEP 1: Details --- */}
      <Modal isOpen={step === 1} onClose={() => setStep(0)} title="Step 1: Details">
        <div className="space-y-5">
           <div className="flex gap-2 mb-6">
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign Title</label>
            <input value={formData.title} onChange={(e) => updateForm("title", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20" placeholder="e.g. Summer Launch 2025" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => updateForm("description", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20 resize-none min-h-[100px]" placeholder="Describe your campaign goals..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Budget (₦)</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input type="number" value={formData.budget} onChange={(e) => updateForm("budget", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20" placeholder="500000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label><input type="datetime-local" value={formData.startDate} onChange={(e) => updateForm("startDate", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#823A5E]/20" /></div>
             <div><label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label><input type="datetime-local" value={formData.endDate} onChange={(e) => updateForm("endDate", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#823A5E]/20" /></div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => { if (!formData.title || !formData.budget) { toast.error("Required fields missing"); return; } setStep(2); }} className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:scale-105 transition-all">Next Step</button>
          </div>
        </div>
      </Modal>

      {/* --- STEP 2: Targeting --- */}
      <Modal isOpen={step === 2} onClose={() => setStep(0)} title="Step 2: Targeting">
        <div className="space-y-5">
           <div className="flex gap-2 mb-6">
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Niche</label>
            <Select value={formData.niche} onValueChange={(val) => updateForm("niche", val)}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl"><SelectValue placeholder="Select Niche" /></SelectTrigger>
              <SelectContent>{Object.keys(NICHE_MAP).map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label><Select value={formData.platform} onValueChange={(val) => updateForm("platform", val)}><SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Instagram">Instagram</SelectItem><SelectItem value="TikTok">TikTok</SelectItem></SelectContent></Select></div>
             <div><label className="block text-sm font-semibold text-gray-700 mb-1">Size</label><Select value={formData.reach} onValueChange={(val) => updateForm("reach", val)}><SelectTrigger className="w-full bg-gray-50 border-gray-200 py-6 rounded-xl"><SelectValue placeholder="Size" /></SelectTrigger><SelectContent><SelectItem value="1k-10k">Nano</SelectItem><SelectItem value="10k-100k">Micro</SelectItem><SelectItem value="100k-1M">Macro</SelectItem></SelectContent></Select></div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
             <input value={formData.location} onChange={(e) => updateForm("location", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#823A5E]/20" placeholder="e.g. Lagos" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Brief (PDF)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer">
               {briefPreview ? <img src={briefPreview} alt="Preview" className="h-16 mx-auto object-contain" /> : <Upload className="w-6 h-6 text-gray-400 mx-auto" />}
               <span className="text-xs text-gray-500 block mt-1">{briefFile ? briefFile.name : "Upload Brief"}</span>
               <input type="file" className="hidden" accept="application/pdf,image/*" onChange={handleBriefUpload} />
               <label onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement).click()} className="absolute inset-0 cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium px-4">Back</button>
            <button onClick={() => setStep(3)} className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:scale-105 transition-all">Next Step</button>
          </div>
        </div>
      </Modal>

      {/* --- STEP 3: Image --- */}
      <Modal isOpen={step === 3} onClose={() => setStep(0)} title="Step 3: Cover Image">
        <div className="space-y-5">
           <div className="flex gap-2 mb-6">
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#823A5E]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign Cover</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-all cursor-pointer">
               {campaignImagePreview ? (
                  <img src={campaignImagePreview} alt="Preview" className="h-40 object-cover rounded-lg w-full" />
               ) : (
                  <div className="text-center"><ImageIcon className="w-8 h-8 text-[#823A5E] mx-auto mb-2" /><p className="text-sm">Upload Cover Image</p></div>
               )}
               <input type="file" className="hidden" accept="image/*" onChange={handleCampaignImageUpload} />
               <label onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement).click()} className="absolute inset-0 cursor-pointer" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">{error}</p>}
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black font-medium px-4">Back</button>
            <button onClick={handleFinalSubmit} disabled={isSubmitting} className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {isSubmitting ? "Creating..." : "Launch"}
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