"use client";
import { useState } from "react";
import { Headset, FileText, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function HelpSupport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen  bg-gray-50 text-gray-900">
      {/* ✅ Sidebar handles its own responsiveness */}
      <Sidebar />

      <div className="flex-1 flex flex-col items-center text-center px-4 py-10 md:ml-64 relative">
        {/* Header */}
        <h1
          className={`${inter.className} font-bold text-[#691D3D] text-3xl md:text-4xl mb-4 mt-10 md:mt-0`}
        >
          Help & Support
        </h1>

        {/* Icon */}
        <Headset className="w-20 h-20 md:w-24 md:h-24 text-[#691D3D] mb-4" />

        {/* Subtitle */}
        <p
          className={`${inter.className} text-[#C3554E] font-medium text-base md:text-lg mb-8 px-4`}
        >
          How can we help you today!
        </p>

        {/* Report Problem Card */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white w-full max-w-lg shadow-md rounded-2xl p-6 cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <div className="flex items-center gap-4 text-left">
            <FileText className="text-[#691D3D] w-8 h-8 md:w-10 md:h-10" />
            <div>
              <h2
                className={`${inter.className} font-semibold text-[#D44A3E] text-base md:text-lg`}
              >
                Report Problem
              </h2>
              <p
                className={`${inter.className} text-gray-500 text-sm md:text-base`}
              >
                Tell us what the issue is and we’ll be happy to help
              </p>
            </div>
          </div>
        </div>

        {/* Slide-up Form */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg bg-white mt-4 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="border-t-4 border-purple-500 p-6 text-left">
                <p
                  className={`${inter.className} text-center text-[#691D3D] font-medium mb-6 text-sm md:text-base`}
                >
                  If you are experiencing any issues, please let us know. We’ll
                  try to solve them as soon as possible.
                </p>

                <form className="space-y-4">
                  <div>
                    <label
                      className={`${inter.className} block font-medium text-gray-700 text-sm md:text-base`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-full px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#691D3D]"
                      placeholder="Enter a short title"
                    />
                  </div>

                  <div>
                    <label
                      className={`${inter.className} block font-medium text-gray-700 text-sm md:text-base`}
                    >
                      Explain the problem
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border rounded-2xl px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#691D3D]"
                      placeholder="Describe the issue..."
                    />
                  </div>

                 <button
  type="submit"
  className={`${inter.className} mx-auto block w-1/2 bg-[#691D3D] text-white font-medium py-2 rounded-md hover:bg-[#52172F] transition-transform duration-300 hover:scale-110 text-sm md:text-base`}
>
  Submit
</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Support & Chat */}
        <button
          className={`${inter.className} mt-10 flex items-center gap-2 text-[#691D3D] font-medium hover:underline text-sm md:text-base`}
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          Call Support & Chat
        </button>
      </div>
    </div>
  );
}
