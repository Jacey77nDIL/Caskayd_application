"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { Upload, Instagram, Music } from "lucide-react";
import Image from "next/image";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type Campaign = {
  id: number;
  title: string;
  date: string;
  image?: string;
  options?: {
    dropdown1: string; // niche
    dropdown2: string; // platform
    dropdown3: string; // reach
  };
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function WebCampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  // Form + UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Modal states
  const [showModalStep1, setShowModalStep1] = useState(false);
  const [showModalStep3, setShowModalStep3] = useState(false);

  // Modal data states
  const [campaignName, setCampaignName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [reach, setReach] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [showRedirectLoader, setShowRedirectLoader] = useState(false); // 🔹 new

  // Fetch campaigns
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to load campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setCampaignName("");
    setPreviewImage(null);
    setNiche("");
    setPlatform("");
    setReach("");
    setMessage(null);
  };

  // Step 1 validation
  const validateForm1 = (): boolean => {
    if (!campaignName.trim()) {
      setMessage("Please enter your campaign name");
      return false;
    }
    if (!previewImage) {
      setMessage("Please add an image to your campaign");
      return false;
    }
    setMessage(null);
    return true;
  };

  // Step 1 submit
  const handleSubmit1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm1()) return;
    setMessage(null);
    setShowModalStep1(false);
    setShowModalStep3(true);
  };

  // Step 3 validation
  const validateForm3 = (): boolean => {
    if (!niche.trim()) {
      setMessage("Please select a niche for your campaign");
      return false;
    }
    if (!platform.trim()) {
      setMessage("Please select a platform for your campaign");
      return false;
    }
    if (!reach.trim()) {
      setMessage("Please select a reach for your campaign");
      return false;
    }
    setMessage(null);
    return true;
  };

  // Final submit
  const handleFinalSubmit = async () => {
    if (!validateForm3()) return;

    setIsSubmitting(true);
    setApiError(null);

    const newCampaign = {
      title: campaignName,
      date: new Date().toLocaleDateString(),
      image: previewImage ?? "",
      options: {
        dropdown1: niche,
        dropdown2: platform,
        dropdown3: reach,
      },
    };

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });

      if (!res.ok) throw new Error("Failed to save campaign");

      const saved = await res.json();
      setCampaigns((prev) => [...prev, saved]);

      // Reset form & close modal
      resetForm();
      setShowModalStep3(false);

      // 🔹 Show redirect loader
      setShowRedirectLoader(true);

      // Wait 3s then redirect
      setTimeout(() => {
        // ✅ Redirect directly with campaignId
        setShowRedirectLoader(false);
        router.push(`/WebExplore?campaignId=${saved.id}`);
      }, 3000);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete campaign
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete campaign");
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white bg-[url('/images/backgroundImage.png')] bg-cover bg-center relative">
      <Navbar />

      {/* 🔹 Redirect Loader Overlay */}
      {showRedirectLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-xl font-semibold">Redirecting...</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className={`${inter.className} mt-5 ml-7 text-3xl text-white font-bold`}>
          Campaigns
        </h1>
        <button
          onClick={() => setShowModalStep1(true)}
          className={`mr-10 font-medium ${inter.className} text-2xl transition-transform duration-200 hover:scale-110 border border-white py-2 px-4 rounded-2xl`}
        >
          ADD +
        </button>
      </div>

      {/* Divider */}
      <div className="ml-5 items-center w-[96%] h-[1px] bg-white my-4"></div>

      {/* API error */}
      {apiError && <p className="text-red-500 ml-5">{apiError}</p>}

      {/* Campaigns grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 ml-5">
        {isLoading ? (
          <p className="text-gray-400 text-2xl font-extrabold col-span-full">Loading campaigns...</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              id={campaign.id}
              title={campaign.title}
              date={campaign.date}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className={`${inter.className} text-gray-400 text-2xl font-extrabold col-span-full`}>
            No campaigns yet. Add one!
          </p>
        )}
      </div>
      {/* Step 1 */}
      <Modal isOpen={showModalStep1} onClose={() => {setShowModalStep1(false);resetForm();}}>
        <div className="ml-10 grid grid-cols-2 md:grid-cols-2">
        <div className="items-center w-[80%] h-[10px] rounded-2xl bg-[#823A5E]  "></div>
        <div className="items-center w-[80%] h-[10px] rounded-2xl bg-[#ACA2A7]"></div>
        </div>
        <form onSubmit={handleSubmit1} className="w-full max-h-[80vh] overflow-y-auto px-8 py-6 no-scrollbar">
          <div>

            <label htmlFor="campaignName" className={`${inter.className} text-black font-medium block mb-1 text-left`}>
              Campaign name
            </label>
            <input id="campaignName" type="text"value={campaignName} onChange={(e) => setCampaignName(e.target.value)}placeholder="Pick a campaign name" className={`text-black w-full border ${inter.className} rounded-lg px-3 py-2 border-[#5E3345] focus:outline-none focus:ring-2 focus:ring-[#843163]`}/>
          </div>

          {/* Image input field */}
          <div className="mt-4">
            <label className={`${inter.className} text-black block mb-1 text-left`}>
              Upload brief
            </label>
          </div>
          {/*The thing am testing*/}
          <div className="w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6">
              {previewImage ? (
                <Image src={previewImage} alt="Preview" width={200} height={200} className="rounded-md"/>
              ) : (
                <Upload className="w-12 h-12 text-gray-500" />
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="fileUpload"/>
              <label htmlFor="fileUpload" className="mt-2 text-sm text-blue-600 cursor-pointer">
                {previewImage ? "Change Image" : "Upload Image"}
              </label>
            </div>
          {message && <p className="text-red-500 mt-2">{message}</p>}
          {/*Next Button*/}
          <div className="w-full mt-8 flex justify-center">
            <button type="submit" className={`${inter.className} bg-[#823A5E] text-white px-10 py-2 rounded-2xl hover:bg-[#6d2e4f] transition-transform duration-200 hover:scale-110`}>
              Next
            </button>
          </div>
        </form>
      </Modal>
      {/* Step 2 */}
      

{/* Step 3 */}
<Modal
  isOpen={showModalStep3}
  onClose={() => {
    setShowModalStep3(false);
    setShowModalStep1(true);
  }}
>
  <div className="ml-10 grid grid-cols-2 md:grid-cols-2">
    <div className="items-center w-[80%] h-[10px] rounded-2xl bg-[#823A5E]" />
    <div className="items-center w-[80%] h-[10px] rounded-2xl bg-[#823A5E]" />
  </div>

  <div className="w-full max-h-[80vh] overflow-y-auto px-8 py-6 no-scrollbar">
    <h2 className={`${inter.className} text-2xl font-bold text-center text-black`}>
      Who are your ideal creators?
    </h2>

    {/* Dropdowns */}
    <div className="flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto space-y-4">
      
      {/* Niche */}
      <div className="flex flex-col w-full">
        <label className={`${inter.className} text-black block mb-1 text-left`}>
          Niche
        </label>
        <Select value={niche} onValueChange={(value) => setNiche(value)}>
          <SelectTrigger className="w-full border rounded-lg text-black px-3 py-2 bg-[#C7B5C8]">
            <SelectValue placeholder="None selected" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform (with icons) */}
      <div className="flex flex-col w-full">
        <label className={`${inter.className} text-black block mb-1 text-left`}>
          Platform
        </label>
        <Select value={platform} onValueChange={(value) => setPlatform(value)}>
          <SelectTrigger className="w-full border rounded-lg text-black px-3 py-2 bg-[#C7B5C8]">
            <SelectValue placeholder="None selected" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Instagram">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </div>
            </SelectItem>
            
            <SelectItem value="TikTok">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-black" />
                TikTok
              </div>
            </SelectItem>
            
          </SelectContent>
        </Select>
      </div>

      {/* Reach */}
      <div className="flex flex-col w-full">
        <label className={`${inter.className} text-black block mb-1 text-left`}>
          Reach
        </label>
        <Select value={reach} onValueChange={(value) => setReach(value)}>
          <SelectTrigger className="w-full border rounded-lg text-black px-3 py-2 bg-[#C7B5C8]">
            <SelectValue placeholder="None selected" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1k-10k">1k - 10k</SelectItem>
            <SelectItem value="10k-100k">10k - 100k</SelectItem>
            <SelectItem value="100k-1M">100k - 1M</SelectItem>
            <SelectItem value="1M+">1M+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Error message */}
    {message && <p className="text-red-500 mt-2">{message}</p>}

    {/* Submit button */}
    <div className="w-full mt-8 flex justify-center">
      <button
        onClick={handleFinalSubmit}
        disabled={isSubmitting}
        className={`${inter.className} bg-[#823A5E] text-white px-10 py-2 rounded-2xl hover:bg-[#6d2e4f] transition-transform duration-200 hover:scale-110 disabled:opacity-50`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}
