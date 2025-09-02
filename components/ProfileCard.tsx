"use client";
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface ProfileCardProps {
  name: string;
  image: string;
  width?: number;  // optional
  height?: number; // optional
  checked: boolean; // ✅ add this
  onCheckChange: () => void; // ✅ since you’re also passing it
}

export default function ProfileCard({
  name,
  image,
  width = 391,   // default size
  height = 561,
}: ProfileCardProps) {
  return (
    <div
      className="relative bg-gray-800 rounded-2xl border-2 border-white shadow-lg overflow-hidden 
        transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ width, height }}
    >
     

      {/* Image */}
      <Image
        src={image}
        alt={name}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
