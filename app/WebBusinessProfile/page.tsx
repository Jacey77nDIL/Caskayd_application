"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { 
  ArrowLeft, Camera, Loader2, Save, Trash2, Plus, 
  Instagram, Twitter, Music, Lock, ChevronDown, Tag, Globe, Mail, User
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// API
import { getCurrentUser, updateBusinessProfile } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- Types ---
type SocialPlatform = "instagram" | "x" | "tiktok";
type SocialLink = { platform: SocialPlatform; username: string };

// Configuration for Social Icons
const PLATFORMS: { value: SocialPlatform; icon: React.ReactNode; label: string }[] = [
  { value: "instagram", label: "Instagram", icon: <Instagram size={18} className="text-pink-600" /> },
  { value: "x", label: "X (Twitter)", icon: <Twitter size={18} className="text-black" /> },
  { value: "tiktok", label: "TikTok", icon: <Music size={18} className="text-black" /> },
];

export default function WebBusinessProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI State for Socials
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Main Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "", 
    bio: "", 
    website: "",
    password: "", 
    image: "/images/profile.jpg", // Fallback image
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    async function loadData() {
      try {
        const response = await getCurrentUser();

        if (response.success && response.data) {
          const d = response.data;
          
          // Map API Response to Form State
          setFormData({
            name: d.business_name || "",
            email: d.email || "",
            category: d.category || "", 
            bio: d.business_bio || "", 
            website: d.website_url || "",
            password: "", // Always empty on load
            image: d.image || "/images/profile.jpg",
          });

          // Handle Socials Transformation (Object -> Array)
          const loadedSocials: SocialLink[] = [];
          if (d.socials && typeof d.socials === 'object') {
            Object.entries(d.socials).forEach(([key, value]) => {
              // Map 'twitter' to 'x' if necessary, otherwise pass through
              const platformKey = key === 'twitter' ? 'x' : key as SocialPlatform;
              if (value && typeof value === 'string') {
                loadedSocials.push({ platform: platformKey, username: value });
              }
            });
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

  // Social Handlers
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
    // @ts-ignore - dynamic key assignment
    newLinks[index] = { ...newLinks[index], [key]: value };
    setSocialLinks(newLinks);
  };

  // --- Save Handler ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
        // 1. Transform Socials Array -> Object
        const socialsObj: Record<string, string> = {};
        socialLinks.forEach(link => {
            if (link.username && link.username.trim() !== "") {
                socialsObj[link.platform] = link.username.trim();
            }
        });

        // 2. Construct Payload matching the PUT requirement
        // API Payload structure: { category, email, password, business_name, website_url, socials, business_bio }
        const payload = {
            business_name: formData.name,
            email: formData.email,
            category: formData.category,
            business_bio: formData.bio,
            website_url: formData.website,
            socials: socialsObj,
            password: formData.password || undefined // Only send if user typed something
        };

        // Remove password if undefined to keep payload clean
        if (!payload.password) delete payload.password;

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

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#823A5E]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm border border-gray-100"
          >
            <ArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className={`${inter.className} text-2xl font-bold text-gray-900`}>Edit Business Profile</h1>
            <p className="text-sm text-gray-500">Manage your public information</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
          
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4 group">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-100">
                 {/* Fallback if image fails to load or is empty */}
                <Image 
                    src={formData.image} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                    onError={(e) => { e.currentTarget.src = "/images/profile.jpg" }} // Simple fallback
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-[#823A5E] text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition border-2 border-white">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-sm text-gray-500 font-medium">Tap camera icon to update logo</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <User size={18} /> Basic Information
            </h3>
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="e.g. Acme Corp"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Automotive, Retail, Technology"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This is the main industry your business operates in.</p>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourbusiness.com"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">About Business</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition resize-none bg-gray-50 focus:bg-white"
                placeholder="Briefly describe your business..."
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{socialLinks.length}/3 Accounts</span>
             </div>

             <div className="space-y-3">
                {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {/* Custom Dropdown for Platform */}
                        <CustomSocialDropdown 
                            selected={link.platform} 
                            onChange={(val) => updateSocialRow(index, "platform", val)} 
                        />
                        
                        {/* Username Input */}
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-3.5 text-gray-400 text-sm font-medium">@</span>
                            <input
                                value={link.username}
                                onChange={(e) => updateSocialRow(index, "username", e.target.value)}
                                placeholder="username"
                                className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                            />
                        </div>

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => removeSocialRow(index)}
                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                            title="Remove account"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {socialLinks.length < 3 && (
                    <button
                        type="button"
                        onClick={addSocialRow}
                        className="flex items-center gap-2 text-sm font-semibold text-[#823A5E] hover:text-[#6a2b4b] px-2 py-2 hover:bg-[#823A5E]/5 rounded-lg transition w-fit"
                    >
                        <Plus size={16} /> Add Social Account
                    </button>
                )}
             </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock size={18} /> Security
             </h3>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Change Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password to change"
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition bg-gray-50 focus:bg-white"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">Leave blank to keep your current password.</p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 bg-white md:static z-10 pb-4 md:pb-0">
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
              className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#6b2e4d] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#823A5E]/20 disabled:opacity-70 disabled:cursor-not-allowed"
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

// --- Helper Components ---

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

    const selectedPlatform = PLATFORMS.find(p => p.value === selected);

    return (
        <div className="relative w-[140px] md:w-[160px]" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-[50px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between px-3 hover:bg-gray-100 transition focus:ring-2 focus:ring-[#823A5E]/20"
            >
                <div className="flex items-center gap-2">
                    {selectedPlatform?.icon}
                    <span className="text-sm font-medium text-gray-700">{selectedPlatform?.label}</span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {PLATFORMS.map((p) => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                                onChange(p.value);
                                setIsOpen(false);
                            }}
                            className={`w-full p-2.5 flex items-center gap-3 hover:bg-gray-50 text-left ${selected === p.value ? 'bg-[#823A5E]/5' : ''}`}
                        >
                            {p.icon}
                            <span className="text-sm text-gray-700">{p.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}