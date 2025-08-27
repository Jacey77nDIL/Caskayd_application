"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { Menu, X } from "lucide-react"; // hamburger + close icons

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Explore", href: "/WebExplore" },
    { name: "Campaign", href: "/" },
    { name: "Messages", href: "/" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-transparent text-white">
      {/* Logo */}
      <h1
        className={`${inter.className} text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}
      >
        Caskayd
      </h1>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-4 md:gap-6 items-center">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`${inter.className} transition-transform duration-300 ${
                  isActive ? "font-bold text-lg" : "font-normal text-base"
                } hover:underline hover:scale-110`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}

        {/* Avatar */}
        <div className="ml-4 w-10 h-10 bg-gray-500 rounded-full"></div>
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-gray-900 p-4 rounded-lg shadow-lg md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)} // close menu on click
                    className={`${inter.className} block ${
                      isActive ? "font-bold text-lg" : "font-normal text-base"
                    } hover:underline`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
          </ul>
        </div>
      )}
    </nav>
  );
}
