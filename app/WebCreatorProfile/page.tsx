"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { ArrowLeft, Camera, Loader2, Save } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// API
import { getCreatorProfile } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function WebCreatorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    image: "/images/profile.jpg",
  });

  // Fetch data on load
  useEffect(() => {
    async function loadProfile() {
      const res = await getCreatorProfile();
      if (res.success && res.data) {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          location: res.data.location || "",
          bio: res.data.bio || "",
          image: res.data.profile_picture || "/images/profile.jpg",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // TODO: Replace with actual API call when endpoint is ready
    // await updateCreatorProfile(formData);
    
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated (Mock)");
    }, 1000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#823A5E]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-full hover:bg-gray-100 transition">
            <ArrowLeft className="text-gray-600" />
          </button>
          <h1 className={`${inter.className} text-2xl font-bold text-gray-900`}>Edit Profile</h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4">
              <Image 
                src={formData.image} 
                alt="Profile" 
                fill 
                className="object-cover rounded-full border-4 border-gray-100" 
              />
              <label className="absolute bottom-0 right-0 bg-[#823A5E] text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-sm text-gray-500">Tap icon to change photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                name="email"
                value={formData.email}
                disabled
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] outline-none transition resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#823A5E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#6b2e4d] active:scale-95 transition-all flex items-center gap-2"
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