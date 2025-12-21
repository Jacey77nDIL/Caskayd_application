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
  Pencil,
  Camera,
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
  setUser: React.Dispatch<React.SetStateAction<User>>;
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
  });

  useEffect(() => {
    async function initUser() {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setUser((prev) => ({
          ...prev,
          name: res.data.name || "User",
          email: res.data.email || "",
          location: res.data.location || "Nigeria",
          image: res.data.image || prev.image,
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

      {/* 👤 Profile Modal */}
      <ProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={user}
        setUser={setUser}
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

/* ================= PROFILE MODAL ================= */
function ProfileModal({
  isModalOpen,
  setIsModalOpen,
  user,
  setUser,
}: ProfileModalProps) {
  const [tempUser, setTempUser] = useState<User>(user);
  const [editing, setEditing] = useState("");

  useEffect(() => {
    if (isModalOpen) setTempUser(user);
  }, [isModalOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setTempUser({ ...tempUser, image: URL.createObjectURL(file) });
  };

  const handleSave = () => {
    setUser(tempUser);
    setIsModalOpen(false);
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
            // [MOBILE] Slide up from bottom
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:w-[450px] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-28 h-28 rounded-full border-4 border-gray-50 overflow-hidden shadow-inner">
                  <Image src={tempUser.image} alt="User" fill className="object-cover" />
                </div>
                <label className="absolute bottom-0 right-0 bg-black text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <EditableInfoRow label="Name" name="name" value={tempUser.name} editing={editing} setEditing={setEditing} handleChange={handleChange} />
              <EditableInfoRow label="Email" name="email" value={tempUser.email} editing={editing} setEditing={setEditing} handleChange={handleChange} />
              <EditableInfoRow label="Location" name="location" value={tempUser.location} editing={editing} setEditing={setEditing} handleChange={handleChange} />
            </div>

            <button
              onClick={handleSave}
              className="mt-8 w-full bg-[#823A5E] text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-[#6b264f] active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditableInfoRow({ label, name, value, editing, setEditing, handleChange, type = "text" }: any) {
  const isActive = editing === name;
  return (
    <div className="border-b border-gray-100 pb-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <button onClick={() => setEditing(isActive ? "" : name)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#823A5E] transition">
          <Pencil size={14} />
        </button>
      </div>
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <input
              autoFocus
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full text-gray-900 font-medium bg-gray-50 p-2 rounded-lg focus:ring-2 focus:ring-[#823A5E]/20 focus:outline-none"
            />
          </motion.div>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-900 font-medium py-2">
            {type === "password" ? "••••••••" : value || "Not set"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}