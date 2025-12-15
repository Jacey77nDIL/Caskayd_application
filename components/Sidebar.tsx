"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Optimization
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

// Import your utilities
import { removeToken } from "@/utils/auth"; // You need to ensure this exists
import { getCurrentUser } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/* ================= TYPES ================= */
type User = {
  name: string;
  email: string;
  password?: string; // Optional because API might not return it
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

type EditableInfoRowProps = {
  label: string;
  name: keyof User;
  value: string;
  editing: string;
  setEditing: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

/* ================= MAIN SIDEBAR ================= */
export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial state (Placeholder until data loads)
  const [user, setUser] = useState<User>({
    name: "Loading...",
    email: "",
    location: "Nigeria",
    image: "/images/profile.jpg", // Ensure this default image exists
  });

  // Fetch basic user info on mount to populate sidebar immediately
  useEffect(() => {
    async function initUser() {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setUser((prev) => ({
          ...prev,
          name: res.data.name || "User",
          email: res.data.email || "",
          location: res.data.location || "Nigeria",
          // Only update image if API provides one, else keep default
          image: res.data.image || prev.image 
        }));
      }
    }
    initUser();
  }, []);

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    removeToken(); // Clears Cookie/LocalStorage
    router.push("/WebBusinessSignIn"); // Redirects to login
  };

  return (
    <>
      {/* ☰ Hamburger (mobile only) */}
      <button
        title="hamburger menu"
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow border border-gray-200"
      >
        <Menu size={24} className="text-black" />
      </button>

      {/* 🧱 Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col justify-between p-6 fixed top-0 left-0 z-40">
        <SidebarContent 
          setIsModalOpen={setIsModalOpen} 
          user={user} 
          onLogout={handleLogout} 
        />
      </aside>

      {/* 📱 Drawer (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 bg-black/50 z-50 flex"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 bg-white h-full p-6 flex flex-col justify-between relative"
            >
              <SidebarContent 
                setIsModalOpen={setIsModalOpen} 
                user={user} 
                onLogout={handleLogout} 
              />
              <button
                title="close"
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X size={22} />
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
        <Link href="/WebExplore">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent mb-8 cursor-pointer hover:opacity-80 transition hover:scale-105 duration-300 inline-block">
            Caskayd
          </h1>
        </Link>

        <nav className="space-y-4 font-bold">
          <SidebarLink
            href="/WebExplore"
            icon={<Home size={20} />}
            label="Home"
          />
          <SidebarLink
            href="/WebCampaign"
            icon={<Megaphone size={20} />}
            label="Campaign"
          />
          <SidebarLink
            href="/WebMessages"
            icon={<MessageSquare size={20} />}
            label="Messages"
          />
          <SidebarLink
            href="/WebHelp&Support"
            icon={<HelpCircle size={20} />}
            label="Help & Support"
          />
        </nav>
      </div>

      <div className="space-y-6">
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition border border-transparent hover:border-gray-100"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={user.image}
              alt="User"
              fill
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm text-black truncate w-32">{user.name}</p>
            <p className="text-[#BDBDBD] text-xs font-light">{user.location}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center border border-gray-300 px-6 py-2.5 rounded-xl w-full justify-center space-x-2 hover:border-[#FF4A4A] hover:bg-[#FF4A4A]/5 transition group"
        >
          <LogOut className="text-[#FF4A4A] group-hover:scale-110 transition-transform" size={18} />
          <span className="text-[#FF4A4A] font-medium text-sm">Logout</span>
        </button>

        <div className="border-t border-gray-100 pt-3 text-xs text-gray-400 text-center">
          &copy; 2025 Caskayd, Inc
        </div>
      </div>
    </>
  );
}

/* ================= SIDEBAR LINK ================= */
function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  // Check if active (handle root paths or sub-paths)
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#E6D8DF] text-[#5E3345] font-semibold shadow-sm"
          : "text-gray-700 font-medium hover:bg-gray-50 hover:text-black"
      }`}
    >
      <span className={isActive ? "text-[#5E3345]" : "text-gray-500"}>{icon}</span>
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

  // Sync tempUser when modal opens or user prop changes
  useEffect(() => {
    if (isModalOpen) {
      setTempUser(user);
    }
  }, [isModalOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleSave = () => {
    // In a real app, you would send a PUT request to the API here to save changes
    setUser(tempUser);
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempUser({ ...tempUser, image: imageUrl });
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60]"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl mx-4"
          >
            <button
              title="close"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-black transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Edit Profile</h2>

            {/* Profile Image */}
            <div className="relative flex justify-center mb-8">
              <div className="relative w-28 h-28 rounded-full border-4 border-gray-100 overflow-hidden shadow-inner">
                <Image
                  src={tempUser.image}
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-[35%] bg-black text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition">
                <Camera size={18} />
                <input
                  title="image input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info Rows */}
            <div className="space-y-5">
              <EditableInfoRow
                label="Name"
                name="name"
                value={tempUser.name}
                editing={editing}
                setEditing={setEditing}
                handleChange={handleChange}
              />
              <EditableInfoRow
                label="Email"
                name="email"
                value={tempUser.email}
                editing={editing}
                setEditing={setEditing}
                handleChange={handleChange}
              />
              <EditableInfoRow
                label="Location"
                name="location"
                value={tempUser.location}
                editing={editing}
                setEditing={setEditing}
                handleChange={handleChange}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#823A5E] text-white px-12 py-3 rounded-2xl font-semibold shadow-lg hover:bg-[#6b264f] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= EDITABLE INFO ROW ================= */
function EditableInfoRow({
  label,
  name,
  value,
  editing,
  setEditing,
  handleChange,
  type = "text",
}: EditableInfoRowProps) {
  const isActive = editing === name;

  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">
          <p className="font-semibold text-gray-500 w-20 text-sm">{label}</p>
          <div className="flex-1">
             {/* If not active, show text. If active, handled by AnimatePresence below */}
             {!isActive && (
                <p className="text-gray-900 font-medium truncate">
                  {type === "password" ? "••••••••" : value || "Not set"}
                </p>
             )}
          </div>
        </div>
        <button 
          onClick={() => setEditing(isActive ? "" : name)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <Pencil size={16} className={isActive ? "text-[#823A5E]" : "text-gray-400"} />
        </button>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              autoFocus
              placeholder={`Enter new ${label.toLowerCase()}`}
              className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#823A5E]/20 focus:border-[#823A5E] transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}