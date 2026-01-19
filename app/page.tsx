"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function LandingPage() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center bg-black ${inter.className} selection:bg-[#8D077B] selection:text-white`}>
      
      {/* Navbar Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-[90%] max-w-7xl py-6 flex justify-between items-center z-20"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent">
          Caskayd
        </h1>
      </motion.div>

      {/* Main Hero Container */}
      <div className="flex-1 w-[90%] max-w-7xl mb-6 relative rounded-3xl overflow-hidden shadow-2xl shadow-[#8D077B]/10 border border-white/10 group">
        
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing.jpeg"
            alt="Influencer marketing background"
            fill
            priority
            className="object-cover object-center transition-transform duration-[2s] ease-in-out group-hover:scale-105"
          />
          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Content Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 py-12 md:py-20 lg:py-24">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            {/* Headline */}
            <motion.h2 
              variants={itemVariants}
              className="text-white font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 tracking-tight"
            >
              Your Partner For <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Strategic Influencer Marketing
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 font-light text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mb-12 leading-relaxed"
            >
              Whether you&apos;re a business looking to expand your reach or a creator
              seeking impactful collaborations, Caskayd provides the intuitive tools
              and resources to make it happen.
            </motion.p>

            {/* Divider */}
            <motion.div variants={itemVariants} className="w-16 h-[1px] bg-white/30 mb-8" />

            {/* Selection Prompt */}
            <motion.h3 
              variants={itemVariants}
              className="text-white font-medium text-lg sm:text-xl md:text-2xl mb-8 flex items-center gap-2"
            >
              <span className="opacity-70">Quick one!</span> Where do you belong?
            </motion.h3>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg"
            >
              {/* Creator Button */}
              <Link href="/creator" className="flex-1 group/btn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-white text-black h-16 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors hover:bg-gray-100"
                >
                  <Sparkles className="w-5 h-5 text-[#8D077B]" />
                  Creator
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                </motion.button>
              </Link>

              {/* Business Button */}
              <Link href="/business" className="flex-1 group/btn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/20 text-white h-16 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all hover:bg-black/60 hover:border-white/40"
                >
                  <Briefcase className="w-5 h-5 text-gray-300" />
                  Business
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                </motion.button>
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </div>
      
    </div>
  );
}