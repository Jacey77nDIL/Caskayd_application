"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";//spe

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export default function TabsNavbar() {
        const pathname = usePathname();
        const [isOpen, setIsOpen] = useState(false);
      
        const links = [
          { name: "To Do", href: "/WebCreatorHomeToDo" },
          { name: "Requests", href: "/WebCreatorHomeRequests" },
        ];

  return (

    <nav className="flex gap-6 border-b px-4 py-2">
      <ul className="hidden md:flex gap-4 md:gap-6 items-center text-black">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`${inter.className} transition-transform duration-300 ${
                  isActive ? "font-bold text-3xl border-b-5 rounded  border-black" : "font-normal text-base"
                } hover:underline hover:scale-110`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
         </ul>
    </nav>
  );
}
