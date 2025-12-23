"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MapPin,
  Mail,
  Megaphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";

import { removeToken } from "@/utils/auth";
import { getCurrentUser } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/* ================= TYPES ================= */
type User = {
  name: string;
  email: string;
  location: string;
  image: string;
  bio?: string; // Added Bio/Description field
};

type SidebarContentProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  onLogout: () => void;
};

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

type ProfileModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

/* ================= MAIN SIDEBAR ================= */
export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user, setUser] = useState<User>({
    name: "Loading...",
    email: "",
    location: "Nigeria",
    image: "/images/profile.jpg",
    bio: "",
  });

  useEffect(() => {
    async function initUser() {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setUser((prev) => ({
          ...prev,
          name: res.data.name || "Business",
          email: res.data.email || "",
          location: res.data.location || "Nigeria",
          image: res.data.image || prev.image,
          bio: res.data.bio || "",
        }));
      }
    }
    initUser();
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/WebBusinessSignIn");
  };

  return (
    <>
      {/* ☰ Hamburger (Mobile) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-[40] p-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-gray-200 active:scale-95 transition-transform"
      >
        <Menu size={24} className="text-black" />
      </button>

      {/* 🧱 Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col justify-between p-6 fixed top-0 left-0 z-40">
        <SidebarContent
          setIsModalOpen={setIsModalOpen}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* 📱 Drawer (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[85%] max-w-[300px] bg-white h-full p-6 flex flex-col justify-between relative shadow-2xl"
            >
              <SidebarContent
                setIsModalOpen={setIsModalOpen}
                user={user}
                onLogout={handleLogout}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👤 Profile Modal (View Only) */}
      <ProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={user}
      />
    </>
  );
}

/* ================= SIDEBAR CONTENT ================= */
function SidebarContent({ setIsModalOpen, user, onLogout }: SidebarContentProps) {
  return (
    <>
      <div>
        <Link href="/WebExplore" className="block mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition hover:scale-105 duration-300 inline-block">
            Caskayd
          </h1>
        </Link>

        <nav className="space-y-2 font-medium">
          <SidebarLink href="/WebExplore" icon={<Home size={22} />} label="Home" />
          <SidebarLink href="/WebCampaign" icon={<Megaphone size={22} />} label="Campaign" />
          <SidebarLink href="/WebMessages" icon={<MessageSquare size={22} />} label="Messages" />
          <SidebarLink href="/WebHelp&Support" icon={<HelpCircle size={22} />} label="Help & Support" />
        </nav>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition border border-transparent hover:border-gray-100 group active:scale-95"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
            <Image
              src={user.image}
              alt="User"
              fill
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-gray-900 truncate w-32 group-hover:text-[#823A5E] transition-colors">{user.name}</p>
            <p className="text-gray-400 text-xs truncate">{user.location}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-3 rounded-xl w-full hover:border-red-200 hover:bg-red-50 transition-all group active:scale-95"
        >
          <LogOut className="text-red-400 group-hover:text-red-500" size={18} />
          <span className="text-red-500 font-medium text-sm">Logout</span>
        </button>

        <div className="pt-2 text-[10px] text-gray-300 text-center uppercase tracking-widest font-semibold">
          © 2025 Caskayd
        </div>
      </div>
    </>
  );
}

/* ================= SIDEBAR LINK ================= */
function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[#E6D8DF] text-[#5E3345] font-bold shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-black"
      }`}
    >
      <span className={isActive ? "text-[#5E3345]" : "text-gray-400"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

/* ================= VIEW ONLY PROFILE MODAL ================= */
function ProfileModal({
  isModalOpen,
  setIsModalOpen,
  user,
}: ProfileModalProps) {
  const router = useRouter();

  const handleEditRedirect = () => {
    setIsModalOpen(false);
    router.push("/WebBusinessProfile");
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Header Background */}
            <div className="h-24 bg-[#823A5E]/10 w-full absolute top-0 left-0" />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-black transition z-10"
            >
              <X size={20} />
            </button>

            <div className="pt-12 px-6 pb-8 flex flex-col items-center relative">
              {/* Profile Image */}
              <div className="relative w-28 h-28 rounded-full border-[4px] border-white shadow-md bg-gray-50 mb-4 overflow-hidden">
                <Image 
                  src={user.image} 
                  alt={user.name} 
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <h2 className="text-2xl font-bold text-gray-900 text-center">{user.name}</h2>
              {user.bio && <p className="text-sm text-gray-500 text-center mt-2 max-w-[90%]">{user.bio}</p>}

              {/* Data List */}
              <div className="w-full mt-8 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-[#823A5E] shadow-sm"><Mail size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[220px]">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-[#823A5E] shadow-sm"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-700">{user.location || "Not set"}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEditRedirect}
                className="w-full mt-8 bg-black text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}