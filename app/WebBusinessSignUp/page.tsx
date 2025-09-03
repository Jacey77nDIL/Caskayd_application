"use client";
//Imports
import Image from "next/image";
import { Link as LinkIcon, Megaphone, Plus, Eye, EyeOff } from "lucide-react";//import for icons from lucide
import { FaXTwitter, FaInstagram, FaTiktok } from "react-icons/fa6";//import for socail icons
import { useEffect, useRef, useState } from "react";//import for states 
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";// import for fonts
import { ChevronDownIcon } from "@heroicons/react/24/solid";//import for chevron
import Modal from "@/components/Modal";//import for modal components

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type SocialId = "x" | "instagram" | "tiktok";
type SocialLink = { id: SocialId; username: string };

export default function SignupPage() {
  const router = useRouter();
  // form state
  const [selected, setSelected] = useState<SocialId>("x");
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //socail states
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  //other from states 
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  //modal states
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
  category: "",
  description: "",
});

  
  const [modalError, setModalError] = useState<string | null>(null);


  const socials = [
    { id: "x" as const, icon: <FaXTwitter className="w-5 h-5 text-gray-700" />, label: "X (Twitter)" },
    { id: "instagram" as const, icon: <FaInstagram className="w-5 h-5 text-gray-700" />, label: "Instagram" },
    { id: "tiktok" as const, icon: <FaTiktok className="w-5 h-5 text-gray-700" />, label: "TikTok" },
  ];
  const selectedSocial = socials.find((s) => s.id === selected);

  // close dropdown on outside click
  const ddRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // socials
  const handleAddSocial = () => {
    if (!usernameInput.trim() || socialLinks.length >= 3) return;
    if (socialLinks.some((s) => s.id === selected)) return;

    setSocialLinks((prev) => [...prev, { id: selected, username: usernameInput.trim() }]);
    setUsernameInput("");
  };
  const handleRemoveSocial = (id: SocialId) => {
    setSocialLinks((prev) => prev.filter((s) => s.id !== id));
  };

  //email validation test
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //Website vailidation test
  const isValidUrl = (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };
  //from vailidation test 
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
    if (!businessName.trim()) {
      setMessage("Please enter your business name");
      return false;
    }
    if (!website.trim()) {
      setMessage("Website URL is required");
      return false;
    } else if (!isValidUrl(website)) {
      setMessage("Enter a valid URL (must start with http:// or https://)");
      return false;
    }
    if (!usernameInput.trim() && socialLinks.length < 1) {
      setMessage("Please enter at least one social username");
      return false;
    }
    setMessage(null);
    return true;
  };
//frist form submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setApiError(null);
  const isValid = validateForm();
  if (!isValid) return;
  //open the modal
  setShowModal(true);
};
//Modal submit plus API handling 
const handleFinalSubmit = async () => {
  //modal validation test
  if (!modalData.category || !modalData.description) {
    setApiError("Please fill in all modal fields");
    return;
  }
  setIsSubmitting(true);
  setApiError(null);

  const payload = {
    email,
    password,
    businessName,
    website,
    socialLinks,
    ...modalData, //modal fields here
  };
console.log(payload)
  try {                {/*Change for real API url later*/}
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to submit sign-up data");

    router.push("/WebExplore");
  } catch (err) {
    console.error("Error submitting data:", err);
    setApiError("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
    setShowModal(false);
  }
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* LEFT */}
      <div className="relative hidden md:block bg-[#FCF4F3]">
        {/*left side image*/}
        <Image src="/images/signup-illustration.png" alt="Grow your brand" fill sizes="(max-width: 768px) 0px, 50vw" className="object-contain" priority/>
      </div>
      {/*Right side from */}
      <div className="flex flex-col items-center justify-center bg-white p-6 md:p-12 overflow-y-auto">
        {/*header text*/}
        <h1 className={`${inter.className} text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}>
          Caskayd
        </h1>
        {/*subheader*/}
        <p className={`${inter.className} text-black mt-5 text-center text-xl font-medium`}>
          Please provide us with the following information
        </p>
        {/*validation Error Message banner */}
        {message && (
          <div role="alert" className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {message}
          </div>
        )}
        {/* API error Message banner */}
        {apiError && (
          <div role="alert" className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {apiError}
          </div>
        )}
        {/*Main form*/}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mt-8 space-y-6 no-scrollbar">
          {/* Business + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              {/* BusinessName*/}
              <label htmlFor="businessName" className={`${inter.className} mb-1 font-medium text-black`}>
                Business Name
              </label>
              <input id="businessName" type="text" placeholder="Enter your business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={`${inter.className} border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none bg-white  focus:ring-2 focus:ring-[#843163] text-black`} required/>
            </div>
             {/*Email*/}
            <div className="flex flex-col">
              <label htmlFor="email" className={`${inter.className} mb-1 font-medium text-black`}>
                Email
              </label>
              
              <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inter.className} text-black border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163]`} required/>
            </div>
          </div>
          {/* Website */}
          <div className="flex flex-col">
            <label htmlFor="website" className={`${inter.className} mb-1 font-medium text-black flex items-center gap-2`}>
              Website URL
              <LinkIcon className="w-4 h-4 text-black" />
            </label>
            <input id="website" type="url" placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} className={`${inter.className} text-black border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163]`}/>
          </div>
          {/* Socials */}
          <div className="flex flex-col">
            <label htmlFor="socials" className={`${inter.className} mb-1 font-medium text-black flex items-center gap-2`}>
              Socials
              <Megaphone className="w-5 h-5 text-black" />
            </label>
            {/* Added socials list */}
            <div className="space-y-2 mb-2">
              {socialLinks.map((s) => {
                const soc = socials.find((x) => x.id === s.id);
                return (
                  <div key={s.id} className="flex items-center justify-between border border-[#5E3345] rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-black">
                      {soc?.icon}
                      <span className={`${inter.className} font-medium`}>{s.username}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveSocial(s.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm" >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
            {/* Input + dropdown + add button for socials*/}
            {socialLinks.length < 3 && (
              <div className="relative flex w-full border border-[#5E3345] rounded-lg focus-within:ring-2 focus-within:ring-[#843163]">
                <div ref={ddRef} className="relative">
                  {/*Dropdown button*/}
                  <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} className="px-3 py-3 bg-[#E6D8DF] border-r border-[#5E3345] flex items-center gap-1 rounded-l-lg" onClick={() => setIsOpen((v) => !v)}>
                    {selectedSocial?.icon}
                    <ChevronDownIcon className="h-5 w-4 text-black font-semibold" />
                  </button>
                  {/*Dropdown list*/}
                  {isOpen && (
                    <div role="listbox" className="absolute left-0 top-[calc(100%+4px)] min-w-[60px] bg-white border rounded-md shadow z-20">
                      {socials
                        .filter((s) => !socialLinks.some((link) => link.id === s.id))
                        .map((s) => (
                          <button key={s.id} type="button" role="option" aria-selected={s.id === selected} className="w-full p-2 hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700"onClick={() => { setSelected(s.id); setIsOpen(false);}}>
                            {s.icon}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                  {/*UserName input*/}
                <input id="socials" placeholder="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className={`${inter.className} flex-1 px-3 py-2 outline-none text-black`}/>
                  {/*Add button*/}
                <button type="button" aria-label="Add social link" onClick={handleAddSocial} disabled={!usernameInput.trim() || socialLinks.length >= 3} className={`px-4 flex items-center justify-center text-black font-bold rounded-r-lg ${
                    !usernameInput.trim() || socialLinks.length >= 3
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-[#6b264f] hover:text-white"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className={`${inter.className} mb-1 font-medium text-black`}>
              Password
            </label>
            <div className="relative flex items-center">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border text-black border-[#5E3345] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#843163]" required minLength={6}/>
              {/* Eye */}
              <button type="button" className="absolute right-3 text-black hover:text-gray-700" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button type="submit" disabled={isSubmitting} className={`${inter.className} w-[50%] bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl transition-transform duration-300 hover:shadow-lg ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-110" }`} >
              {isSubmitting ? "Submitting..." : "Get Started"}
            </button>
          </div>
        </form>
      </div>
      {/*Modal*/}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title=" Business Category">
        <div className="flex flex-col gap-6">
          {/* Business Category */}
          <div className="flex flex-col">
            
            <select id="category" value={modalData.category || ""} onChange={(e) => setModalData({ ...modalData, category: e.target.value })} className={`${inter.className} border px-3 py-2 rounded bg-[#C7B5C8] text-black focus:outline-none border-[#823A5E] focus:ring-2 focus:ring-[#843163]`}>
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
          {/* Business Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className={`${inter.className} font-medium text-black mb-1`}>
              Tell us about your business—what do you do, what makes you unique, and what impact are you trying to make?
            </label>
            <textarea id="description" rows={4} value={modalData.description || ""} onChange={(e) => setModalData({ ...modalData, description: e.target.value })} className="border border-[#823A5E] px-3 py-2 rounded resize-none text-black focus:outline-none focus:ring-2 focus:ring-[#843163]" placeholder="Write a short description..."/>
          </div>
          {/* Done button */}
          <div className="flex justify-center">
            <button onClick={handleFinalSubmit} disabled={isSubmitting} className={`${inter.className} bg-[#823A5E] text-white py-2 px-10 rounded-2xl font-medium hover:bg-[#6b264f] disabled:opacity-50 transition-transform hover:scale-110 duration-300`}>
              {isSubmitting ? "Submitting..." : "Done"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
