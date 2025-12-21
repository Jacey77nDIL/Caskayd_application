"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CalendarClock, CheckCircle2, ChevronDown } from "lucide-react";

type Task = {
  id: number;
  company: string;
  logo: string;
  title: string;
  status: string;
  deliverables: string[];
  price: number;
  dueDate: string;
  dateAdded: string;
};

type ActiveTaskCardProps = {
  task: Task;
  onClick: () => void;
};

export default function ActiveTaskCard({ task, onClick }: ActiveTaskCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      className="group relative flex flex-col bg-white border border-gray-100 
                 rounded-2xl p-5 shadow-sm cursor-pointer overflow-hidden
                 transition-all duration-300"
    >
      {/* Decorative Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={task.logo}
                alt={task.company}
                fill
                className="rounded-full object-cover border border-gray-200"
              />
              {/* Status Dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.company}</p>
            </div>
          </div>

          {/* Right: Price & Due Date (Collapsed View) */}
          <div className="text-right flex flex-col items-end">
            <span className="font-bold text-gray-900">₦{task.price.toLocaleString()}</span>
            <div className="flex items-center text-xs text-gray-400 mt-1 gap-1">
              <CalendarClock size={12} />
              <span>Due {task.dueDate}</span>
            </div>
          </div>
        </div>

        {/* The Twist: Expandable Deliverables Section */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="border-t border-gray-200/50 pt-3"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deliverables</p>
              <div className="flex flex-wrap gap-2">
                {task.deliverables.map((item, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/60 border border-gray-200 text-xs text-gray-600 font-medium"
                  >
                    <CheckCircle2 size={10} className="text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}