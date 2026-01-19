"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { Link as LinkIcon, Megaphone, Plus, Eye, EyeOff, Loader2, Trash2, ChevronDown } from "lucide-react";
import { FaXTwitter, FaInstagram, FaTiktok } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

// Auth & API
import { storeToken, getToken } from "@/utils/auth";
import { getIndustries, setupBusinessProfile } from "@/utils/api"; // Ensure these exist
import Modal from "@/components/Modal";
import LoadingOverlay from "@/components/LoadingOverlay";

// Forms
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- 1. Validation Schema ---
const socialSchema = z.object({
  id: z.enum(["x", "instagram", "tiktok"]),
  username: z.string().min(1, "Username required"),
});

const signupSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Must be a valid URL (include https://)"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  socials: z.array(socialSchema).min(1, "Add at least one social media account").max(3, "Max 3 accounts"),
  // These fields are filled in the Modal step
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

// Social Media Options
const SOCIAL_OPTIONS = [
  { id: "x", icon: <FaXTwitter />, label: "X" },
  { id: "instagram", icon: <FaInstagram />, label: "Instagram" },
  { id: "tiktok", icon: <FaTiktok />, label: "TikTok" },
] as const;

const INDUSTRIES = [
  "Automotive", "Education & Training", "Entertainment",
  "Fashion & Apparel", "Finance & Investment", "Food & Beverage",
  "Health & Wellness", "Home & Garden", "Parenting & Family",
  "Pet Care", "Real Estate", "Technology", "Travel & Tourism",
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // UI States for custom inputs
  const [selectedSocial, setSelectedSocial] = useState<"x" | "instagram" | "tiktok">("x");
  const [socialInput, setSocialInput] = useState("");
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  // Global Loading/Error State
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  // --- 2. Form Setup ---
  const {
    register,
    trigger,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      socials: [],
      category: "",
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  const watchedSocials = watch("socials");
  const watchedCategory = watch("category");

  // --- 3. Handlers ---

  const handleAddSocial = () => {
    if (!socialInput.trim()) return;
    if (watchedSocials.length >= 3) return;
    
    // Check duplicate platform
    if (watchedSocials.some((s) => s.id === selectedSocial)) {
      setGlobalError(`You already added ${selectedSocial}`);
      return;
    }

    append({ id: selectedSocial, username: socialInput.trim() });
    setSocialInput("");
    setGlobalError(null);
  };

  const onPreSubmit = async () => {
    // Validate Step 1 fields before opening modal
    const valid = await trigger(["businessName", "email", "website", "password", "socials"]);
    if (valid) {
      setGlobalError(null);
      setShowModal(true);
    }
  };

  const onFinalSubmit = async (data: SignupFormData) => {
    setLoadingMessage("Creating your account...");
    setGlobalError(null);

    try {
      const apiUrl = "http://127.0.0.1:8000";
      const existingToken = getToken();

      // 1. Prepare Payload
      const payload = {
        business_name: data.businessName,
        email: data.email,
        website_url: data.website, 
        password: data.password,
        business_bio: data.description,
        category: data.category,
        socials: data.socials.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.username }), {}),
      };

      // 2. Call Signup API
      const res = await fetch(`${apiUrl}/signup/business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(existingToken ? { Authorization: `Bearer ${existingToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || responseData.message || "Signup failed");
      }

      // 3. Store Token
      if (responseData.access_token) {
        storeToken(responseData.access_token);
      }

      // 4. Industry Setup
      setLoadingMessage("Setting up your profile...");
      
      const industriesResp = await getIndustries();
      const industriesList = industriesResp?.data?.industries || [];
      
      const matchedIndustry = industriesList.find(
        (ind: any) => ind.name.toLowerCase() === data.category.toLowerCase()
      );

      if (matchedIndustry) {
        await setupBusinessProfile([matchedIndustry.id]);
      } else {
        console.warn("Industry match failed, skipping profile setup step.");
      }

      // 5. Success
      setShowModal(false);
      router.push("/WebExplore");

    } catch (err: any) {
      setGlobalError(err.message || "Something went wrong.");
      setLoadingMessage(null); // Hide overlay to show error
    }
  };

  const currentSocialIcon = SOCIAL_OPTIONS.find(s => s.id === selectedSocial)?.icon;

  return (
    <>
      {loadingMessage && <LoadingOverlay message={loadingMessage} />}

      <div className={`grid grid-cols-1 md:grid-cols-2 min-h-screen ${inter.className}`}>
        
        {/* Left Illustration */}
        <div className="relative hidden md:block bg-[#FCF4F3]">
          <Image
            src="/images/signup-illustration.png"
            alt="Grow your brand"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right Form */}
        <div className="flex flex-col items-center justify-center bg-white p-4 sm:p-6 md:p-12 overflow-y-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent">
            Caskayd
          </h1>
          <p className="text-black mt-3 text-center text-base sm:text-xl font-medium">
            Create your business account
          </p>

          {/* Global Error */}
          <AnimatePresence>
            {globalError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-lg mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {globalError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-lg mt-8 space-y-6">
            
            {/* ROW 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-black">Business Name</label>
                <input
                  {...register("businessName")}
                  placeholder="Enter business name"
                  className="border border-[#5E3345] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#843163] outline-none"
                />
                {errors.businessName && <span className="text-red-500 text-xs mt-1">{errors.businessName.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-black">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter email"
                  className="border border-[#5E3345] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#843163] outline-none"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black flex items-center gap-2">
                Website URL <LinkIcon className="w-4 h-4" />
              </label>
              <input
                {...register("website")}
                placeholder="https://example.com"
                className="border border-[#5E3345] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#843163] outline-none"
              />
              {errors.website && <span className="text-red-500 text-xs mt-1">{errors.website.message}</span>}
            </div>

            {/* Socials Section */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black flex items-center gap-2">
                Socials <Megaphone className="w-4 h-4" />
              </label>

              {/* Added Socials List */}
              <div className="flex flex-col gap-2 mb-2">
                <AnimatePresence>
                  {fields.map((field, index) => {
                    const icon = SOCIAL_OPTIONS.find(s => s.id === field.id)?.icon;
                    return (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between border border-[#5E3345] rounded-lg px-3 py-2 bg-gray-50"
                      >
                        <div className="flex items-center gap-2 text-black">
                          <span className="text-gray-600">{icon}</span>
                          <span className="font-medium">{field.username}</span>
                        </div>
                        <button onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {errors.socials && <span className="text-red-500 text-xs">{errors.socials.message}</span>}
              </div>

              {/* Add Social Input */}
              {fields.length < 3 && (
                <div className="flex relative">
                  {/* Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                      className="px-3 py-2 bg-[#E6D8DF] border border-r-0 border-[#5E3345] rounded-l-lg flex items-center gap-1 h-full"
                    >
                      <span className="text-black">{currentSocialIcon}</span>
                      <ChevronDown className="w-4 h-4 text-black" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isSocialDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border shadow-lg rounded-md z-10 w-32">
                        {SOCIAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSelectedSocial(opt.id);
                              setIsSocialDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-black text-sm"
                          >
                            {opt.icon} {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    value={socialInput}
                    onChange={(e) => setSocialInput(e.target.value)}
                    placeholder="Username"
                    className="flex-1 border border-[#5E3345] px-3 py-2 outline-none text-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="px-4 bg-gray-100 border border-l-0 border-[#5E3345] rounded-r-lg hover:bg-[#823A5E] hover:text-white transition-colors text-black"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full border border-[#5E3345] text-black rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-[#843163] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-black hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
              
              <Link href="/WebBusinessSignIn" className="mt-2 text-sm font-medium text-[#843163] hover:underline w-fit">
                Or pick up from where you left
              </Link>
            </div>

            {/* Submit Step 1 */}
            <div className="flex justify-center">
              <button
                type="button" // Important: Not submit yet
                onClick={onPreSubmit}
                className="w-full sm:w-1/2 bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl hover:scale-105 transition-transform shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Step 2 */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Business Category">
          <div className="flex flex-col gap-6 pt-2">
            
            {/* Category Dropdown */}
            <div className="relative">
              <label className="font-medium text-black mb-1 block">Industry</label>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full border px-3 py-2 rounded bg-[#C7B5C8] text-black border-[#823A5E] flex justify-between items-center"
              >
                {watchedCategory || "Select Industry"}
                <ChevronDown className={`w-5 h-5 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute w-full bg-white border border-[#823A5E] rounded-lg mt-1 shadow-lg z-20 max-h-48 overflow-y-auto">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black text-sm"
                      onClick={() => {
                        setValue("category", ind);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              )}
              {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
            </div>

            {/* Description */}
            <div>
              <label className="font-medium text-black mb-1 block">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full border border-[#823A5E] px-3 py-2 rounded resize-none text-black focus:ring-2 focus:ring-[#843163] outline-none"
                placeholder="Tell us about your business..."
              />
              {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
            </div>

            {/* Final Submit */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit(onFinalSubmit)}
                disabled={isSubmitting}
                className="bg-[#823A5E] text-white py-2 px-10 rounded-2xl font-medium hover:bg-[#6b264f] disabled:opacity-70 transition-transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Processing...</div>
                ) : (
                  "Done"
                )}
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </>
  );
}