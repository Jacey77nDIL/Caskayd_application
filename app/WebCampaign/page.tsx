"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Upload, Instagram, Music, Loader2 } from "lucide-react";
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

// API & Auth
import { getCampaigns, createCampaign, deleteCampaign } from "@/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// --- TYPES ---

// Data shape from API (reading)
interface ApiCampaignData {
  id: number;
  title: string;
  created_at: string;
  brief_file_url?: string;
  platform?: string;
  reach?: string;
  filters?: {
    niche_ids?: number[];
  };
}

// Data shape for API (creating response)
interface CreateCampaignResponse {
  campaign: ApiCampaignData;
  recommendations: Creator[];
}

// Frontend Display shape
type Campaign = {
  id: number;
  title: string;
  date: string;
  image?: string;
  options?: {
    dropdown1: string;
    dropdown2: string;
    dropdown3: string;
  };
};

// Creator shape
interface Creator {
  id: number;
  name: string;
  followers_count: number;
  engagement_rate: string;
  niches: { id: number; name: string }[];
}

// --- MAPPINGS ---
const NICHE_MAP: Record<string, number> = {
  "Technology": 1,
  "Healthcare": 2,
  "Finance": 3,
  "Retail": 4,
  "Fashion": 5,
};

export default function WebCampaign() {
  const searchParams = useSearchParams();

  // --- STATE ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal Visibility
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [showCreatorPicker, setShowCreatorPicker] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<number | null>(null);
  
  const [recommendedCreators, setRecommendedCreators] = useState<Creator[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    previewImage: null as string | null,
    niche: "",
    platform: "",
    reach: "",
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (searchParams.get("openAdd") === "true") {
      setStep(1);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const res = await getCampaigns();
      
      if (mounted) {
        if (res.success && Array.isArray(res.data)) {
          const mapped: Campaign[] = res.data.map((c: ApiCampaignData) => ({
            id: c.id,
            title: c.title,
            date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Just now",
            image: c.brief_file_url || "/placeholder.png",
            options: {
              dropdown1: c.filters?.niche_ids?.[0]?.toString() || "General",
              dropdown2: c.platform || "Any",
              dropdown3: c.reach || "Any",
            },
          }));
          setCampaigns(mapped);
        } else {
          setCampaigns([]);
        }
        setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // --- HANDLERS ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success("Campaign deleted");

    const res = await deleteCampaign(id);
    if (!res.success) {
      toast.error("Failed to delete campaign on server.");
      window.location.reload(); 
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.title || !formData.previewImage || !formData.niche || !formData.platform || !formData.reach) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    const toastId = toast.loading("Creating campaign...");

    const nicheId = NICHE_MAP[formData.niche] || 1; 
    
    const payload = {
      title: formData.title,
      description: `Campaign for ${formData.niche} on ${formData.platform}`,
      brief: "Generated via Web App",
      brief_file_url: " ", 
      budget: 1000, 
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      filters: {
        location: "Nigeria",
        min_followers: 1000,
        max_followers: 1000000,
        engagement_rate: 0.05,
        niche_ids: [nicheId],
      },
    };

    try {
        const res = await createCampaign(payload);

        if (res.success && res.data) {
          // 1. FIXED: Explicit Cast here to tell TS the shape
          const { campaign, recommendations } = res.data as CreateCampaignResponse;
          
          toast.success("Campaign created successfully!", { id: toastId });

          if (campaign) {
            const newCamp: Campaign = {
              id: campaign.id,
              title: campaign.title,
              date: new Date().toLocaleDateString(),
              image: formData.previewImage || "",
              options: {
                dropdown1: formData.niche,
                dropdown2: formData.platform,
                dropdown3: formData.reach
              }
            };
            setCampaigns(prev => [...prev, newCamp]);
            
            setCreatedCampaignId(campaign.id);
            setRecommendedCreators(recommendations || []);
            
            setStep(0); 
            setShowCreatorPicker(true);
            
            setFormData({ title: "", previewImage: null, niche: "", platform: "", reach: "" });
          }
        } else {
          toast.error(res.message || "Failed to create campaign", { id: toastId });
          setError(res.message || "Failed to create campaign");
        }
    } catch (err) {
        toast.error("Something went wrong.", { id: toastId });
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-center" reverseOrder={false} />

      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 py-6 gap-4">
          <h1 className={`${inter.className} text-3xl font-bold text-[#691D3D]`}>Campaigns</h1>
          <button
            onClick={() => setStep(1)}
            className={`${inter.className} font-medium text-xl transition-transform duration-300 hover:scale-105 text-[#691D3D] px-5 py-2 rounded-2xl border border-[#691D3D]/10 bg-white hover:shadow-md`}
          >
            ADD +
          </button>
        </div>

        <div className="mx-4 sm:mx-6 md:mx-8 border-t border-[#BDBDBD]" />

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-10 mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
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
            <div className="text-center text-gray-400 mt-10">
              <p className="text-xl font-medium">No campaigns found.</p>
              <p className="text-sm">Create your first campaign to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1 MODAL */}
      <Modal
        isOpen={step === 1}
        onClose={() => setStep(0)}
        title="Create Campaign — Step 1"
      >
        <div className="px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-2 rounded-full bg-[#823A5E]" />
            <div className="h-2 rounded-full bg-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign name</label>
            <input
              value={formData.title}
              onChange={(e) => updateForm("title", e.target.value)}
              className="w-full border border-[#5E3345] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#823A5E]"
              placeholder="Ex: Summer Launch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload brief</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
              {formData.previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.previewImage} alt="Preview" className="h-32 object-contain rounded" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
              <input type="file" id="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <label htmlFor="file" className="mt-2 text-[#823A5E] font-medium cursor-pointer hover:underline">
                {formData.previewImage ? "Change Image" : "Click to upload"}
              </label>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                if (!formData.title || !formData.previewImage) {
                  toast.error("Please complete all fields");
                  return;
                }
                setStep(2);
              }}
              className="bg-[#823A5E] text-white px-8 py-2 rounded-xl hover:scale-105 transition-transform"
            >
              Next
            </button>
          </div>
        </div>
      </Modal>

      {/* STEP 2 MODAL */}
      <Modal
        isOpen={step === 2}
        onClose={() => setStep(0)}
        title="Who are your ideal creators?"
      >
        <div className="px-4 py-4 space-y-5">
           <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-2 rounded-full bg-[#823A5E]" />
            <div className="h-2 rounded-full bg-[#823A5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niche</label>
            <Select value={formData.niche} onValueChange={(val) => updateForm("niche", val)}>
              <SelectTrigger className="w-full border-[#5E3345] bg-[#FCF4F3] text-black">
                <SelectValue placeholder="Select Niche" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.keys(NICHE_MAP).map((niche) => (
                  <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <Select value={formData.platform} onValueChange={(val) => updateForm("platform", val)}>
              <SelectTrigger className="w-full border-[#5E3345] bg-[#FCF4F3] text-black">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Instagram">
                  <div className="flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</div>
                </SelectItem>
                <SelectItem value="TikTok">
                  <div className="flex items-center gap-2"><Music className="w-4 h-4" /> TikTok</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reach</label>
            <Select value={formData.reach} onValueChange={(val) => updateForm("reach", val)}>
              <SelectTrigger className="w-full border-[#5E3345] bg-[#FCF4F3] text-black">
                <SelectValue placeholder="Select Follower Range" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1k-10k">Nano (1k - 10k)</SelectItem>
                <SelectItem value="10k-100k">Micro (10k - 100k)</SelectItem>
                <SelectItem value="100k-1M">Macro (100k - 1M)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black">
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="bg-[#823A5E] text-white px-8 py-2 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Submit"}
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