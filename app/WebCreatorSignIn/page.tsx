"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ Fixed: Import Link
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form"; // ✅ Fixed: Use Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { storeToken } from "@/utils/auth";
import { loginUser } from "@/utils/api"; // ✅ Fixed: Use centralized API

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    // ✅ Call Centralized API
    const res = await loginUser({
      email: data.email,
      password: data.password,
    });

    if (res.success && res.data?.access_token) {
      storeToken(res.data.access_token);
      
      // Determine Redirect
      const redirectTo = searchParams.get("redirect") || "/WebCreatorHomeRequests";
      router.push(redirectTo);
    } else {
      setServerError(res.message || "Invalid email or password");
    }
  };

  return (
    // ✅ Fixed: min-h-screen handles mobile browsers better than h-screen
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen overflow-hidden">
      
      {/* Left side image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative hidden md:block bg-[#FFF8F8]"
      >
        <Image
          src="/images/SignUpCreator.png"
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
        <h1 className={`${inter.className} text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}>
          Caskayd
        </h1>

        <p className={`${inter.className} text-black mt-10 text-center text-xl font-bold`}>
          Welcome Back!
        </p>

        {/* Error Banner */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm"
            >
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form
          className="w-full max-w-lg mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className={`${inter.className} mb-1 font-medium text-black`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="text-black border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163] transition-all duration-200"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className={`${inter.className} mb-1 font-medium text-black`}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full border text-black border-[#5E3345] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#843163] transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword((p) => !p)}
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
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              className={`w-[50%] flex items-center justify-center gap-2 bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl hover:shadow-lg transition-all ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Jump In!"
              )}
            </motion.button>
          </div>
        </form>

        {/* Footer Link */}
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