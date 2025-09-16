"use client";

import Image from "next/image";
import { useRouter,useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Eye, EyeOff, Link as LinkIcon, Upload } from "lucide-react";
import { useState,useEffect } from "react";
import Modal from "@/components/Modal";
import { storeToken } from "@/utils/auth";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function SignupPage() {
  const params = useSearchParams();
  const linked = params.get("linked");

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // modal states
  const [showModalStep1, setShowModalStep1] = useState(false);
  const [showModalStep2, setShowModalStep2] = useState(false);

  // step1: accounts
  const [accounts, setAccounts] = useState({
    tiktok: false,
    instagram: false,
  });

  // step2: setup
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return false;
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage("Password should contain at least 1 uppercase letter and 1 number");
      return false;
    }
    if (!userName.trim()) {
      setMessage("Please enter your business name");
      return false;
    }
   
    setMessage(null);
    return true;

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;
    setShowModalStep1(true);
  };

  const handleFinalSubmit = async () => {
    if (!niche || !region || !previewImage) {
  setApiError("Please complete all setup fields");
  return;
}
    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      email,
      password,
      userName,
      accounts,
      setup: {
        niche,
        region,
        previewImage,
      },
    };

    try {
      const token = localStorage.getItem("token");

const response = await fetch("https://caskayd-backend.onrender.com/signup/creator", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), //include JWT if available
  },
  body: JSON.stringify(payload),
});

      if (!response.ok) throw new Error("Failed to submit sign-up data");
      //parse JSON response
      const data: { token: string } = await response.json();
      //store JWT in localStorage
      if (data.token) {
        storeToken(data.token);
      }
      setShowModalStep2(false);
      router.push("/WebExplore");
    } catch (err) {
      console.error("Error submitting data:", err);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      
    }
  };

  // file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConnectInstagram = () => {
      const clientId = process.env.NEXT_PUBLIC_FB_APP_ID; 
      const redirectUri = "https://caskayd-application.vercel.app/auth/callback/facebook"; 
      const state = Math.random().toString(36).substring(7); // unique string for security

      const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code&state=${state}`;

      window.location.href = oauthUrl;
    };

    useEffect(() => {
    if (linked) {
      setShowModalStep1(true); // reopen modal step 1
      if (linked === "instagram") {
        setAccounts((prev) => ({ ...prev, instagram: true }));
      }
      if (linked === "tiktok") {
        setAccounts((prev) => ({ ...prev, tiktok: true }));
      }
    }
  }, [linked]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left side image */}
      <div className="relative hidden md:block bg-[#FFF8F8]">
        <Image
          src="/images/SignUpCreator.png"
          alt="Grow your brand"
          fill
          sizes="(max-width: 768px) 0px, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Form side */}
      <div className="flex flex-col items-center justify-center bg-white p-6 md:p-12 overflow-y-auto">
        <h1
          className={`${inter.className} text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}
        >
          Caskayd
        </h1>
        <p
          className={`${inter.className} text-black mt-5 text-center text-xl font-medium`}
        >
          Please provide us with the following information
        </p>

        {/* Error messages */}
        {message && (
          <div
            role="alert"
            className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
          >
            {message}
          </div>
        )}
        {apiError && (
          <div
            role="alert"
            className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
          >
            {apiError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mt-8 space-y-6 no-scrollbar"
        >
          {/* Username */}
          <div className="flex flex-col">
            <label className={`${inter.className} mb-1 font-medium text-black`}>
              Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Enter your name"
              className="border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163] text-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className={`${inter.className} mb-1 font-medium text-black`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your Email address"
              className="border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163] text-black"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className={`${inter.className} mb-1 font-medium text-black`}>
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full border text-black border-[#5E3345] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#843163]"
              />
              <button
                type="button"
                className="absolute right-3 text-black hover:text-gray-700"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <a href="/WebCreatorSignIn" className="mt-2 text-sm font-medium text-[#843163] hover:underline w-fit">
              Or pick up from where you left
            </a>
          </div>

          {/* Get Started */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${inter.className} w-[50%] bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl transition-transform duration-300 hover:shadow-lg ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-110"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Get Started"}
            </button>
          </div>
        </form>
      </div>

      {/* Step 1 Modal - Link Accounts */}
      <Modal isOpen={showModalStep1} onClose={() => setShowModalStep1(false)}>
        {/* Use full modal width from the Modal component (max-w-2xl) and add inner padding */}
        <div className="w-full px-8 py-6">
          <h2 className={`${inter.className} text-2xl font-bold mb-6 text-center text-black`}>
            Link Your Accounts
          </h2>

          {/* Rows container */}
          <div className="w-full max-w-md space-y-4">
            {/* TikTok row */}
            <div className="flex items-center justify-between ">
              
                <span className={`${inter.className} text-black text-lg`}>TikTok</span>
              

              
                <button
                  onClick={() =>
                    setAccounts((prev) => ({ ...prev, tiktok: !prev.tiktok }))
                  }
                  className={`${inter.className}  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-110 ${
                    accounts.tiktok ? "bg-green-500 text-white" : "bg-gray-500/80 text-white"
                  }`}
                >
                  {accounts.tiktok ? "Connected" : "Disconnected"}
                  <LinkIcon size={16} />
                </button>
              
            </div>

            {/* Instagram row */}
            <div className="flex items-center justify-between">
                <span className={`${inter.className} text-black text-lg`}>Instagram</span>

              <button
                onClick={() => handleConnectInstagram()}
                className={`${inter.className} flex items-left gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-110 ${
                  accounts.instagram ? "bg-green-500 text-white" : "bg-gray-500/80 text-white"
                }`}
              >
                {accounts.instagram ? "Connected" : "Connect Instagram"}
                <LinkIcon size={16} />
              </button>
            </div>
          </div>

          {/* Next button centered */}
          <div className="w-full mt-8 flex justify-center">
            <button
  onClick={() => {
    if (!accounts.tiktok && !accounts.instagram) return; // block if none linked
    setShowModalStep1(false);
    setShowModalStep2(true);
  }}
  disabled={!accounts.tiktok && !accounts.instagram} // disable if none linked
  className={`${inter.className} px-10 py-2 rounded-2xl transition-transform duration-200 ${
    !accounts.tiktok && !accounts.instagram
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-[#823A5E] text-white hover:bg-[#6d2e4f] hover:scale-110"
  }`}
>
  Next
</button>

          </div>
        </div>
      </Modal>

      {/* Step 2 Modal - Setup Account */}
      
      <Modal isOpen={showModalStep2} onClose={() => {setShowModalStep2(false);setShowModalStep1(true);}}>
        <div className="w-full max-h-[80vh] overflow-y-auto px-8 py-6 no-scrollbar">
          <h2 className={`${inter.className} text-2xl font-bold mb-6 text-center text-black`}>Set Up Your Account</h2>
          {apiError && (
      <div
        role="alert"
        className={`${inter.className} w-full mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-700 text-sm`}
      >
        {apiError}
      </div>
    )}

          {/* Niche */}
          <div className="mb-4">
            <label className={`${inter.className} text-black block mb-1 text-left`}>Select Your Niche</label>
            <select
              required
              id="category"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`${inter.className} w-full border rounded-lg text-black px-3 py-2 bg-[#C7B5C8] focus:outline-none focus:ring-2 focus:ring-[#843163]`}
            >
              <option value="" disabled >None selected</option>
              <option value="Primary Industry">Primary Industry</option>
              <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
              <option value="Construction & Infrastructure">Construction & Infrastructure</option>
              <option value="Consumer Goods & Retail">Consumer Goods & Retail</option>
              <option value="Finance & Insurance">Finance & Insurance</option>
              <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
              <option value="Technology & Innovation">Technology & Innovation</option>
              <option value="Transportation & Logistics">Transportation & Logistics</option>
            </select>
          </div>

          {/* Region */}
          <div className="mb-4">
            <label className={`text-black ${inter.className} block mb-1 text-left`}>What&apos;s Your Region (Location)?</label>
            <input
              required
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Enter your region"
              className={`text-black w-full border ${inter.className} rounded-lg px-3 py-2 border-[#5E3345] focus:outline-none focus:ring-2 focus:ring-[#843163]`}
            />
          </div>

          {/* Upload */}
          <div className="mb-6">
            <label className={`${inter.className} block mb-1 text-left text-black`}>
              How would you like businesses to see you? Upload an Image
            </label>
            <div className="w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              ) : (
                <Upload className="w-12 h-12 text-gray-500" />
              )}
              <input
                required
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="mt-2 text-sm text-blue-600 cursor-pointer"
              >
                {previewImage ? "Change Image" : "Upload Image"}
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="bg-[#823A5E] text-white px-6 py-2 rounded-2xl hover:bg-[#6d2e4f] transition-transform duration-300 hover:shadow-lg hover:scale-110"
            >
              {isSubmitting ? "Submitting..." : "Done"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
