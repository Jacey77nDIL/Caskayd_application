"use client";

import { Trash2 } from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation"; // ✅ import router

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type CardProps = {
  id: number;
  title: string;
  date: string;
  onDelete: (id: number) => void;
};

export default function Card({ id, title, date, onDelete }: CardProps) {
  const router = useRouter(); // ✅ initialize router

  // 🔴 Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🧠 prevent redirect when delete is clicked
    const confirmed = confirm("Are you sure you want to delete this campaign?");
    if (confirmed) {
      onDelete(id);
    }
  };

  // 🟢 Handle payment (optional later)
  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ prevent navigation
    alert("Payment feature coming soon!");
  };

  // 🟣 Handle redirect when clicking the card
  const handleCardClick = () => {
    router.push(`/WebCampaign/${id}`); // ✅ navigate with campaign ID
  };

  return (
    <div className="w-full">
      {/* Date */}
      <p className={`${inter.className} text-xs text-gray-400 mb-1`}>
        Date Added: {date}
      </p>

      {/* Clickable Card */}
      <div
        onClick={handleCardClick}
        className="w-full bg-white rounded-xl shadow-sm border border-gray-200 
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        px-4 py-3 gap-3 transition-transform duration-200 hover:scale-[1.02]
        cursor-pointer active:scale-[0.98]"
      >
        {/* Left: Title */}
        <h2 className={`${inter.className} text-black text-lg font-semibold`}>
          {title}
        </h2>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-start sm:justify-end">
          <button
            type="button"
            onClick={handlePayment}
            className={`${inter.className} flex items-center gap-2 text-[#246B2C] text-sm px-3 py-2 rounded-md transition-transform duration-200 hover:scale-110`}
          >
            Payment <span className="font-medium text-lg text-[#246B2C]">₦</span>
          </button>

          <button
            onClick={handleDelete}
            className={`${inter.className} flex items-center gap-2 text-red-600 text-sm px-3 py-2 rounded-md transition-transform duration-200 hover:scale-110`}
          >
            DELETE
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
