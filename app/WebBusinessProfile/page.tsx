"use client";

import { useState, useEffect, useRef } from "react"; // ✅ FIXED: Added useRef
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { 
  ArrowLeft, Camera, Loader2, Save, Trash2, Plus, 
  Instagram, Twitter, Music, Lock, ChevronDown, Tag
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// API
import { getCurrentUser, updateBusinessProfile, getIndustries } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Types
type Industry = { id: number; name: string };
type SocialPlatform = "instagram" | "x" | "tiktok";
type SocialLink = { platform: SocialPlatform; username: string };

const PLATFORMS: { value: SocialPlatform; icon: React.ReactNode }[] = [
  { value: "instagram", icon: <Instagram size={18} className="text-pink-600" /> },
  { value: "x", icon: <Twitter size={18} className="text-black" /> },
  { value: "tiktok", icon: <Music size={18} className="text-black" /> },
];

export default function WebBusinessProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data States
  const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<number[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "", 
    location: "", 
    bio: "", 
    image: "/images/profile.jpg",
    website: "",
    password: "", 
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, industriesRes] = await Promise.all([
          getCurrentUser(),
          getIndustries()
        ]);

        if (industriesRes.success) {
           const list = Array.isArray(industriesRes.data) ? industriesRes.data : industriesRes.data?.industries || [];
           setAvailableIndustries(list);
        }

        if (profileRes.success && profileRes.data) {
          const d = profileRes.data;
          
          setFormData({
            name: d.business_name || d.name || "",
            email: d.email || "",
            category: d.category || "", 
            location: d.location || "", 
            bio: d.business_bio || "", 
            website: d.website_url || "",
            image: d.image || "/images/profile.jpg",
            password: "", 
          });

          if (d.industries && Array.isArray(d.industries)) {
            setSelectedIndustryIds(d.industries.map((ind: Industry) => ind.id));
          }

          const loadedSocials: SocialLink[] = [];
          if (d.socials) {
            const xHandle = d.socials.x || d.socials.twitter;
            if (d.socials.instagram) loadedSocials.push({ platform: "instagram", username: d.socials.instagram });
            if (xHandle) loadedSocials.push({ platform: "x", username: xHandle });
            if (d.socials.tiktok) loadedSocials.push({ platform: "tiktok", username: d.socials.tiktok });
          }
          setSocialLinks(loadedSocials);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleIndustry = (id: number) => {
    setSelectedIndustryIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addSocialRow = () => {
    if (socialLinks.length >= 3) return;
    setSocialLinks([...socialLinks, { platform: "instagram", username: "" }]);
  };

  const removeSocialRow = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const updateSocialRow = (index: number, key: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [key]: value };
    setSocialLinks(newLinks);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
        const socialsObj: Record<string, string> = {};
        socialLinks.forEach(link => {
            if (link.username && link.username.trim() !== "") {
                socialsObj[link.platform] = link.username.trim();
            }
        });

        const payload = {
            ...formData,
            socials: socialsObj, 
            industry_ids: selectedIndustryIds,
        };

        if (!payload.password) delete (payload as any).password;

        const res = await updateBusinessProfile(payload);

        if (res.success) {
            toast.success("Profile updated successfully");
            router.refresh(); 
        } else {
            toast.error(res.message || "Failed to update");
        }
    } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#823A5E]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            aria-label="Go back" 
            onClick={() => router.back()} 
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm border border-gray-100"
          >
            <ArrowLeft className="text-gray-600" />
          </button>
          <h1 className={`${inter.className} text-2xl font-bold text-gray-900`}>Edit Business Profile</h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
          
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                <Image src={formData.image} alt="Profile" fill className="object-cover" />
              </div>
              <label className="absolute bottom-0 right-0 bg-[#823A5E] text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition border-2 border-white">
                <Camera size={18} />
                <input title="Upload profile picture" type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-sm text-gray-500 font-medium">Tap to update Logo</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                    />
                </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Automotive, Retail, Technology"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourbusiness.com"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-2">About Business</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition resize-none bg-gray-50 focus:bg-white"
                placeholder="What does your business do?"
              />
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Industries</h3>
             <div className="flex flex-wrap gap-2">
                {availableIndustries.length > 0 ? (
                    availableIndustries.map((ind) => {
                        const isSelected = selectedIndustryIds.includes(ind.id);
                        return (
                            <button
                                key={ind.id}
                                type="button"
                                onClick={() => toggleIndustry(ind.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                    ${isSelected 
                                        ? "bg-[#823A5E] text-white border-[#823A5E] shadow-md scale-105" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                    }
                                `}
                            >
                                {ind.name}
                            </button>
                        )
                    })
                ) : (
                    <p className="text-sm text-gray-400 italic">No industries loaded.</p>
                )}
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
                <span className="text-xs text-gray-500">{socialLinks.length}/3 Accounts</span>
             </div>

             <div className="space-y-3">
                {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <CustomSocialDropdown 
                            selected={link.platform} 
                            onChange={(val) => updateSocialRow(index, "platform", val)} 
                        />
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-3.5 text-gray-400 text-sm">@</span>
                            <input
                                value={link.username}
                                onChange={(e) => updateSocialRow(index, "username", e.target.value)}
                                placeholder="username"
                                className="w-full p-3 pl-7 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeSocialRow(index)}
                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Remove social"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {socialLinks.length < 3 && (
                    <button
                        type="button"
                        onClick={addSocialRow}
                        className="flex items-center gap-2 text-sm font-semibold text-[#823A5E] hover:text-[#6a2b4b] px-2 py-1"
                    >
                        <Plus size={16} /> Add Social Account
                    </button>
                )}
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Security</h3>
             <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Change Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password to change"
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">Leave blank to keep current password.</p>
             </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition"
            >
                Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#6b2e4d] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#823A5E]/20"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Custom Dropdown Helper
function CustomSocialDropdown({ selected, onChange }: { selected: SocialPlatform, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedIcon = PLATFORMS.find(p => p.value === selected)?.icon;

    return (
        <div className="relative w-16" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-[50px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition focus:ring-2 focus:ring-[#823A5E]/20"
            >
                {selectedIcon}
                <ChevronDown size={12} className="ml-1 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {PLATFORMS.map((p) => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                                onChange(p.value);
                                setIsOpen(false);
                            }}
                            className={`w-full p-2 flex items-center justify-center hover:bg-gray-50 ${selected === p.value ? 'bg-[#823A5E]/10' : ''}`}
                        >
                            {p.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}