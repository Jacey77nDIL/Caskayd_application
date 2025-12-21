"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import Framer Motion
import ProfileModal from "@/components/ProfileModal";
import { getCurrentUser } from "@/utils/api"; 

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function TopNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    password: "", 
    location: "",
    image: "/images/avatar.png", 
  });

  const links = [
    { name: "Home", href: "/WebCreatorHomeRequests" },
    { name: "Chat", href: "/WebCreatorChat" },
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          setUser((prev) => ({
            ...prev,
            name: res.data.name || "User",
            email: res.data.email || "",
            location: res.data.location || "",
            image: res.data.image || "/images/avatar.png",
          }));
        }
      } catch (error) {
        console.error("Failed to load user info");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
        
        {/* Logo */}
        <Link href="/WebCreatorHomeRequests" className="cursor-pointer group">
            <h1 className={`${inter.className} text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity`}>
            Caskayd
            </h1>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-2 items-center text-black bg-gray-50/50 p-1 rounded-full border border-gray-100">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href); // Slightly looser match for sub-pages
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`${inter.className} relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 block ${
                    isActive 
                      ? "text-[#823A5E] bg-white shadow-sm" // Active Pill Style
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Section: Mobile Toggle + Avatar */}
        <div className="flex items-center gap-4">
            
            {/* Desktop Avatar (Hidden on mobile to save space, or keep visible if you prefer) */}
            <div className="relative h-10 w-10 hidden md:block group">
                {loading ? (
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                <div className="relative">
                    <Image
                        src={user.image}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full cursor-pointer object-cover ring-2 ring-transparent group-hover:ring-[#823A5E] transition-all duration-300"
                        onClick={() => setIsModalOpen(true)}
                    />
                    {/* Status Indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition active:scale-95"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu Dropdown (Animated) */}
        <AnimatePresence>
            {isOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 md:hidden overflow-hidden"
            >
                <ul className="flex flex-col p-4 gap-2">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                    <li key={link.name}>
                        <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`${inter.className} block py-3 px-4 rounded-xl transition-colors ${
                            isActive
                            ? "bg-[#823A5E]/10 text-[#823A5E] font-bold"
                            : "text-gray-600 font-medium hover:bg-gray-50"
                        }`}
                        >
                        {link.name}
                        </Link>
                    </li>
                    );
                })}
                
                {/* Mobile Avatar Link */}
                <li className="mt-2 pt-4 border-t border-gray-100">
                    <div 
                        className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                            setIsOpen(false);
                            setIsModalOpen(true);
                        }}
                    >
                    <div className="relative h-10 w-10">
                        <Image
                        src={user.image}
                        alt="profile"
                        fill
                        className="rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                    </div>
                </li>
                </ul>
            </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={user}
        setUser={setUser} 
      />
    </>
  );
}