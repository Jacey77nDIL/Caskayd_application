"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Optimized Image
import { usePathname } from "next/navigation";
import { Menu, X, Loader2 } from "lucide-react";
import { Inter } from "next/font/google";
import ProfileModal from "@/components/ProfileModal";
import { getCurrentUser } from "@/utils/api"; // ✅ Use Central API

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

  // Default state placeholder
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    password: "", // API likely won't return this, handled in Modal
    location: "",
    image: "/images/avatar.png", // Default fallback
  });

  const links = [
    { name: "Home", href: "/WebCreatorHomeRequests" }, // Updated to match your request page
    { name: "Chat", href: "/WebCreatorChat" },
  ];

  // ✅ Fetch Real User Data on Mount
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
            image: res.data.image || "/images/avatar.png", // Use API image or fallback
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
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        
        {/* Logo */}
        <h1 className={`${inter.className} text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}>
          Caskayd
        </h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 items-center text-black">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`${inter.className} transition-all duration-200 ${
                    isActive 
                      ? "font-bold text-[#823A5E] border-b-2 border-[#823A5E]" 
                      : "font-medium text-gray-600 hover:text-[#823A5E]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {/* Avatar (Click to open Profile) */}
          <li className="relative h-10 w-10">
            {loading ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <Image
                src={user.image}
                alt="profile"
                fill
                className="rounded-full cursor-pointer object-cover border-2 border-transparent hover:border-[#823A5E] transition-all"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-black hover:bg-gray-100 rounded-full transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 md:hidden flex flex-col p-4 animate-in slide-in-from-top-5">
            <ul className="flex flex-col gap-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`${inter.className} block py-2 px-4 rounded-lg ${
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
              <li 
                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-50 cursor-pointer border-t border-gray-100 mt-2 pt-4"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative h-8 w-8">
                  <Image
                    src={user.image}
                    alt="profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">My Profile</span>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={user}
        setUser={setUser} // Pass setter to update local state immediately on save
      />
    </>
  );
}