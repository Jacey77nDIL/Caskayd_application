"use client";

import { Trash2 } from "lucide-react";
import { Inter } from "next/font/google";

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
  const handleDelete = () => {
    const confirmed = confirm("Are you sure you want to delete this campaign?");
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    
    <div className="relative w-full h-full">
      {/* Date floating above the card */}
      <p className={`${inter.className} absolute -top-5 left-2 text-xs text-gray-400`}>
        Date Added: {date}
      </p>

      {/* Card box */}
      <div className="w-full max-w-sm h-auto min-h-[160px] bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between mt-2 transition-transform duration-200 hover:scale-105">
        {/* Title at the very top */}
        <h2 className={`${inter.className} text-black text-2xl font-semibold text-center`}>
          {title}
        </h2>

        {/* Spacer to push delete button down */}
        <div className="flex-1"></div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={`${inter.className} self-end flex items-center gap-1 text-red-600 text-sm px-3 py-1 rounded-md transition-transform duration-200 hover:scale-110`}
        >
          DELETE
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
