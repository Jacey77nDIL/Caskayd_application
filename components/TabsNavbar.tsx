"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function TabsNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "To Do", href: "/WebCreatorHomeToDo" },
    { name: "Requests", href: "/WebCreatorHomeRequests" },
  ];

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex items-center gap-8 relative">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.name} className="relative">
                <Link
                  href={link.href}
                  className={`${inter.className} relative block py-4 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`}
                >
                  {/* The Link Text */}
                  {link.name}

                  {/* The "Magic" Sliding Line 
                    Render it ONLY if this tab is active.
                    layoutId="activeTab" tells Framer Motion to animate 
                    this element moving from one parent to another.
                  */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-t-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}