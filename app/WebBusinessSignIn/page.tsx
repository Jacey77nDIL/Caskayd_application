"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; // FIXED: Use Link for SPA navigation
import { Inter } from "next/font/google";
import { storeToken } from "@/utils/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "@/components/LoadingOverlay";

// REVAMP: Import React Hook Form and Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const MIN_LOAD_TIME = 800;

// REVAMP: Define Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer type from schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false); // UI state for overlay

  // REVAMP: Initialize Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null);
    setShowOverlay(true);
    const startTime = Date.now();

    try {
      // REVAMP: Use Environment Variable
      const apiUrl = "http://127.0.0.1:8000";
      
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Handle specific API error messages if available
        const errorData = await res.json().catch(() => ({})); 
        throw new Error(errorData.detail || "Invalid email or password");
      }

      const responseData = await res.json();
      storeToken(responseData.access_token);

      const redirectTo = searchParams.get("redirect") || "/WebExplore";
      router.push(redirectTo);
      
      // Note: We don't set showOverlay(false) here because we are redirecting.
      // Keeping it true prevents the UI from flashing back to the login form before the new page loads.

    } catch (err: any) {
      // Minimum loading time logic (UX)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

      setTimeout(() => {
        setGeneralError(err.message || "Something went wrong. Please try again.");
        setShowOverlay(false);
      }, remaining);
    }
  };

  return (
    // FIXED: h-screen -> min-h-screen for mobile keyboard safety
    <div className={`grid grid-cols-1 md:grid-cols-2 min-h-screen h-[100dvh] ${inter.className}`}>
      
      {/* Loading Overlay controlled by local state */}
      {showOverlay && <LoadingOverlay message="Signing you in..." />}

      {/* Left illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative hidden md:block bg-[#FCF4F3]"
      >
        <Image
          src="/images/signup-illustration.png"
          alt="Grow your brand"
          fill
          sizes="(max-width: 768px) 0px, 50vw"
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Right side form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center bg-white p-6 md:p-12 overflow-y-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent">
          Caskayd
        </h1>

        <p className="text-black mt-10 text-center text-xl font-bold">
          Welcome Back!
        </p>

        {/* Global Error Message */}
        <AnimatePresence>
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm"
              role="alert"
            >
              {generalError}
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg mt-8 space-y-6"
        >
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`text-black border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-shadow duration-200 ${
                errors.email 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-[#5E3345] focus:ring-[#843163]"
              }`}
              {...register("email")} // Connect to Hook Form
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full border text-black rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 transition-shadow duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-[#5E3345] focus:ring-[#843163]"
                }`}
                {...register("password")} // Connect to Hook Form
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-2.5 text-black hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className={`w-[50%] flex items-center justify-center gap-2 bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl transition-transform duration-300 hover:shadow-lg ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Let's Go!"
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-[#823A5E] hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}