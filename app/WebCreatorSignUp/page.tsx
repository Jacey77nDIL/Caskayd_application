  //WebCreatorSignUp

  "use client";

  import Image from "next/image";
  import { useRouter, useSearchParams } from "next/navigation";
  import { Inter } from "next/font/google";
  import { 
    Eye, 
    EyeOff, 
    Link as LinkIcon, 
    Upload, 
    Loader2, 
    ChevronDown, 
    CreditCard 
  } from "lucide-react";
  import { useState, useEffect } from "react";
  import Modal from "@/components/Modal";
  import { storeToken } from "@/utils/auth";
  import { AnimatePresence, motion } from "framer-motion";
  import LoadingOverlay from "@/components/LoadingOverlay";
  import Link from "next/link";

  // ✅ Import getBanks and submitAccountDetails
  import { 
    signupCreator, 
    getNiches, 
    setupCreatorProfile, 
    getTikTokAuthUrl, 
    submitAccountDetails, 
    getBanks,
    uploadProfilePicture // <--- Add this import
  } from "@/utils/api";

  const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
  });

  export default function CreatorSignupPage() {
    const router = useRouter();
    const params = useSearchParams();
    const linked = params.get("linked");

    // --- STATE ---
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
    
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      niche: "",
      region: "",
      previewImage: null as string | null,
      imageFile: null as File | null, // <--- Add this to store the raw file
    });

    const [bankData, setBankData] = useState({
      account_name: "",
      account_number: "",
      bank_code: "",
      bank_name_display: "" 
    });

    const [showPassword, setShowPassword] = useState(false);
    const [accounts, setAccounts] = useState({ tiktok: false, instagram: false });
    
    const [nicheOpen, setNicheOpen] = useState(false);
    const [bankListOpen, setBankListOpen] = useState(false);
    
    const [availableNiches, setAvailableNiches] = useState<{ id: number; name: string }[]>([]);
    // ✅ NEW: State for Banks
    const [availableBanks, setAvailableBanks] = useState<{ name: string; code: string }[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // --- 1. Fetch Niches & Banks on Load ---
    useEffect(() => {
      async function loadData() {
        // Load Niches
        const nicheRes = await getNiches();
        if (nicheRes.success) setAvailableNiches(nicheRes.data);

        // ✅ Load Banks (Live or Fallback)
        const bankRes = await getBanks();
        if (bankRes.success) {
          // Sort alphabetically for better UX
          const sorted = bankRes.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
          setAvailableBanks(sorted);
        }
      }
      loadData();
    }, []);

    // --- 2. Handle Social Linking Return ---
    useEffect(() => {
      if (linked) {
        setStep(1);
        setAccounts((prev) => ({ ...prev, [linked]: true }));
      }
    }, [linked]);

    const updateForm = (key: string, value: any) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setValidationError(null);
    };

    const updateBankForm = (key: string, value: any) => {
      setBankData((prev) => ({ ...prev, [key]: value }));
      setGlobalError(null);
    };

    // --- 3. HANDLE SIGNUP (Step 1) ---
    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.email.trim() || formData.password.length < 6) {
        setValidationError("Please fill in all fields correctly (Password 6+ chars).");
        return;
      }

      setLoadingMessage("Creating your account...");
      setIsLoading(true);
      setValidationError(null);

      const res = await signupCreator({
        category: "General",
        email: formData.email,
        password: formData.password,
        name: formData.name,
        bio: "New Creator",
      });

      setIsLoading(false);

      if (res.success && res.data?.access_token) {
        storeToken(res.data.access_token);
        setStep(1); 
      } else {
        setValidationError(res.message || "Signup failed. Email might be taken.");
      }
    };

    const handleConnectTikTok = async () => {
      setLoadingMessage("Connecting to TikTok...");
      setIsLoading(true);
      const res = await getTikTokAuthUrl();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setGlobalError("Could not start TikTok connection.");
        setIsLoading(false);
      }
    };

  // CreatorSignupPage.tsx

 // CreatorSignupPage.tsx

// CreatorSignupPage.tsx

const handleProfileSetup = async () => {
    if (!formData.niche || !formData.region) {
      setGlobalError("Please complete all profile fields.");
      return;
    }
    if (!formData.imageFile) {
        setGlobalError("Please upload a profile picture.");
        return;
    }

    setLoadingMessage("Uploading image & setting up...");
    setIsLoading(true);
    setGlobalError(null);

try {
        // --- STEP 1: Upload ---
        const uploadRes = await uploadProfilePicture(formData.imageFile);
        
        if (!uploadRes.success) {
            setIsLoading(false);
            setGlobalError(uploadRes.message || "Failed to upload image.");
            return;
        }

        // ✅ FIX: Extract the URL from the specific structure you provided
        const backendResponse = uploadRes.data;
        let finalImageUrl = "";

        // Check the exact path from your debug log: data -> data -> profile_picture_url
        if (backendResponse?.data?.profile_picture_url) {
            finalImageUrl = backendResponse.data.profile_picture_url;
        } 
        // Fallback: Check if it's directly at the top level (just in case)
        else if (backendResponse?.profile_picture_url) {
            finalImageUrl = backendResponse.profile_picture_url;
        }
        // Fallback: Check for standard keys
        else if (typeof backendResponse === 'string') {
            finalImageUrl = backendResponse;
        }

        if (!finalImageUrl) {
            console.error("URL Extraction Failed. Response:", backendResponse);
            setGlobalError("Could not find 'profile_picture_url' in response.");
            setIsLoading(false);
            return;
        }

        // --- STEP 2: Setup Profile ---
        const selectedNiche = availableNiches.find((n) => n.name === formData.niche);
        
        const res = await setupCreatorProfile({
            name: formData.name,
            bio: "Content Creator",
            location: formData.region,
            followers_count: 0,
            engagement_rate: "0", 
            profile_image: finalImageUrl, // ✅ Sending the string URL now
            niche_ids: selectedNiche ? [selectedNiche.id] : [],
        });

        setIsLoading(false);

        if (res.success) {
            setStep(3); 
        } else {
            setGlobalError(res.message || "Profile setup failed.");
        }

    } catch (error: any) {
        setIsLoading(false);
        setGlobalError(error.message || "An unexpected error occurred.");
    }
};

    // --- 4. HANDLE BANK SUBMIT (Step 3) ---
    const handleBankSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!bankData.account_name || !bankData.account_number || !bankData.bank_code) {
        setGlobalError("Please fill in all bank details.");
        return;
      }

      if (bankData.account_number.length < 10) {
        setGlobalError("Account number looks too short.");
        return;
      }

      setLoadingMessage("Securing details...");
      setIsLoading(true);
      
      const res = await submitAccountDetails({
        account_name: bankData.account_name,
        account_number: bankData.account_number,
        bank_code: bankData.bank_code
      });

      setIsLoading(false);

      if (res.success) {
        router.push("/WebCreatorHomeRequests");
      } else {
        setGlobalError(res.message || "Could not verify bank details.");
      }
    };

    const handleConnectInstagram = () => {
      const clientId = process.env.NEXT_PUBLIC_FB_APP_ID;
      const redirectUri = "https://caskayd-application.vercel.app/auth/callback/facebook";
      const state = Math.random().toString(36).substring(7);
      const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code&state=${state}`;
      window.location.href = oauthUrl;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // 1. Create Preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ 
              ...prev, 
              previewImage: reader.result as string, 
              imageFile: file // <--- Save the raw file here
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen overflow-hidden">
        {isLoading && <LoadingOverlay message={loadingMessage} />}

        <div className="relative hidden lg:block bg-[#FFF8F8]">
          <Image
            src="/images/SignUpCreator.png"
            alt="Grow your brand"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white px-4 sm:px-6 md:px-10 lg:px-12 py-6 overflow-y-auto h-screen">
          <h1 className={`${inter.className} text-4xl sm:text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}>
            Caskayd
          </h1>
          <p className={`${inter.className} text-black mt-3 sm:mt-5 text-center text-base sm:text-lg md:text-xl font-medium`}>
            Join as a Creator
          </p>

          {validationError && (
            <div className="w-full max-w-md mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {validationError}
            </div>
          )}

          {/* --- MAIN FORM (Step 0) --- */}
          <form onSubmit={handleSignup} className="w-full max-w-sm sm:max-w-md mt-8 space-y-5">
            <div>
              <label className="block mb-1 font-medium text-black">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Your Name"
                className="w-full border border-[#5E3345] rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-[#843163] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#5E3345] rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-[#843163] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="••••••"
                  className="w-full border border-[#5E3345] rounded-lg px-3 py-2 pr-10 text-black focus:ring-2 focus:ring-[#843163] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Link href="/WebCreatorSignIn" className="mt-2 text-sm font-medium text-[#843163] hover:underline w-fit">
                Or pick up from where you left
            </Link>

            <button
              type="submit"
              className="w-full bg-[#823A5E] text-white font-semibold py-3 rounded-2xl hover:scale-105 transition-transform shadow-md"
            >
              Get Started
            </button>
          </form>
        </div>

        {/* --- MODAL 1: SOCIALS --- */}
        <Modal isOpen={step === 1} onClose={() => {}} title="Link Accounts">
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500 text-center">Account created! Link your socials now.</p>
            
            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
              <span className="font-medium text-black">TikTok</span>
              <button
                onClick={handleConnectTikTok}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  accounts.tiktok ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {accounts.tiktok ? "Connected" : "Connect"} <LinkIcon size={14} />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
              <span className="font-medium text-black">Instagram</span>
              <button
                onClick={handleConnectInstagram}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  accounts.instagram ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {accounts.instagram ? "Connected" : "Connect"} <LinkIcon size={14} />
              </button>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-[#823A5E] text-white px-8 py-2 rounded-xl hover:bg-[#6d2e4f] transition w-full sm:w-auto"
              >
                Next Step
              </button>
            </div>
          </div>
        </Modal>

        {/* --- MODAL 2: PROFILE --- */}
        <Modal isOpen={step === 2} onClose={() => setStep(1)} title="Complete Profile">
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {globalError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {globalError}
              </div>
            )}

            <div className="relative">
              <label className="block mb-1 font-medium text-black">Niche</label>
              <button
                type="button"
                onClick={() => setNicheOpen(!nicheOpen)}
                className="w-full flex justify-between items-center border border-[#823A5E] bg-[#C7B5C8]/20 px-4 py-2.5 rounded-lg text-black"
              >
                {formData.niche || "Select Niche"}
                <ChevronDown size={20} className={`transition-transform ${nicheOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {nicheOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl z-20 max-h-48 overflow-y-auto"
                  >
                    {availableNiches.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { updateForm("niche", n.name); setNicheOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-black"
                      >
                        {n.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => updateForm("region", e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                className="w-full border border-[#5E3345] rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-[#843163] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">Profile Picture</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                {formData.previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.previewImage} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <Upload size={24} />
                  </div>
                )}
                <label className="mt-2 text-[#823A5E] font-medium text-sm cursor-pointer hover:underline">
                  {formData.previewImage ? "Change Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleProfileSetup}
                disabled={isLoading}
                className="w-full bg-[#823A5E] text-white font-semibold py-3 rounded-2xl hover:bg-[#6d2e4f] transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Next Step"}
              </button>
            </div>
          </div>
        </Modal>

        {/* --- ✅ MODAL 3: BANK DETAILS --- */}
        <Modal isOpen={step === 3} onClose={() => {}} title="Get Paid">
          <div className="p-6 space-y-5">
            <div className="text-center mb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Add Bank Account</h3>
                <p className="text-sm text-gray-500">Add details to receive campaign payouts.</p>
            </div>

            {globalError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {globalError}
              </div>
            )}

            {/* Dynamic Bank Dropdown */}
            <div className="relative">
              <label className="block mb-1 font-medium text-black text-sm">Bank Name</label>
              <button
                type="button"
                onClick={() => setBankListOpen(!bankListOpen)}
                className="w-full flex justify-between items-center border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-black text-left"
              >
                {bankData.bank_name_display || "Select Bank"}
                <ChevronDown size={18} className={`text-gray-500 transition-transform ${bankListOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {bankListOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl z-20 max-h-48 overflow-y-auto"
                  >
                    {availableBanks.map((bank) => (
                      <button
                        key={bank.code}
                        onClick={() => { 
                          updateBankForm("bank_code", bank.code);
                          updateBankForm("bank_name_display", bank.name);
                          setBankListOpen(false); 
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-black border-b border-gray-50 last:border-none"
                      >
                        {bank.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block mb-1 font-medium text-black text-sm">Account Number</label>
              <input
                type="text"
                maxLength={10}
                value={bankData.account_number}
                onChange={(e) => updateBankForm("account_number", e.target.value.replace(/\D/g, ""))}
                placeholder="0123456789"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-black focus:ring-2 focus:ring-[#843163] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black text-sm">Account Name</label>
              <input
                type="text"
                value={bankData.account_name}
                onChange={(e) => updateBankForm("account_name", e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-black focus:ring-2 focus:ring-[#843163] outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Must match the name on the bank account.</p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleBankSubmit}
                disabled={isLoading}
                className="w-full bg-[#823A5E] text-white font-semibold py-3 rounded-2xl hover:bg-[#6d2e4f] transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Submit & Finish"}
              </button>
              <button
                onClick={() => router.push("/WebCreatorHomeRequests")}
                className="text-gray-400 text-sm hover:text-gray-600 transition"
              >
                Skip for now
              </button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }