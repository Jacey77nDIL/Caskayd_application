"use client";
// Imports
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { storeToken } from "@/utils/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setMessage("Enter your password");
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid email or password");

      const data = await res.json();
      storeToken(data.token);

      // Redirect to intended page or dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    } catch (err) {
      setApiError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left side image */}
      <div className="relative hidden md:block bg-[#FFF8F8]">
        <Image
          src="/images/SignUpCreator.png"
          alt="Grow your brand"
          fill
          sizes="(max-width: 768px) 0px, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Right side form */}
      <div className="flex flex-col items-center justify-center bg-white p-6 md:p-12 overflow-y-auto">
        {/* Header */}
        <h1
          className={`${inter.className} text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}
        >
          Caskayd
        </h1>

        {/* Subheader */}
        <p
          className={`${inter.className} text-black mt-10 text-center text-xl font-bold`}
        >
          Welcome Back!
        </p>

        {/* Validation error banner */}
        {message && (
          <div
            role="alert"
            aria-live="polite"
            className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
          >
            {message}
          </div>
        )}

        {/* API error banner */}
        {apiError && (
          <div
            role="alert"
            aria-live="polite"
            className="w-full max-w-lg mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
          >
            {apiError}
          </div>
        )}

        {/* Form */}
        <form
          className="w-full max-w-lg mt-8 space-y-6 no-scrollbar"
          onSubmit={handleSubmit}
        >
          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className={`${inter.className} mb-1 font-medium text-black`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inter.className} text-black border border-[#5E3345] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#843163]`}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className={`${inter.className} mb-1 font-medium text-black`}
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border text-black border-[#5E3345] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#843163]"
                required
                minLength={6}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 text-black hover:text-gray-700"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${inter.className} w-[50%] flex items-center justify-center gap-2 bg-[#823A5E] text-[#FCF4F3] font-semibold py-3 rounded-2xl transition-transform duration-300 hover:shadow-lg ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-110"
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
            </button>
          </div>
        </form>

        {/* Extra link */}
        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-[#823A5E] hover:underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
