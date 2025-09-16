import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function LandingPage() {
  return (
<div className="min-h-screen flex flex-col items-center bg-black">
      {/* Navbar */}
  <div className="w-[90%] sm:w-[88%] md:w-[84%] lg:w-[80%] py-4 flex flex-row justify-between items-center">
        <h1 className={`${inter.className} text-3xl sm:text-4xl md:text-5xl font-medium bg-gradient-to-r from-[#846120] via-[#9D2424] to-[#8D077B] bg-clip-text text-transparent`}>
          Caskayd
        </h1>
      </div>

{/* Hero Section */}
<div className="relative w-[90%] mt-2 rounded-2xl overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image src="/images/landing.jpeg" alt="Influencer marketing background" fill priority className="object-cover object-center"/>
  </div>
  {/* Overlay Content */}
  <div className="relative z-10 flex flex-col items-center justify-start text-center px-4 sm:px-8 lg:px-20 py-10 sm:py-16">
    {/* Headline */}
    <h2 className={`text-white ${inter.className} font-extrabold mb-4 text-2xl sm:text-3xl md:text-5xl lg:text-6xl max-w-4xl`}>
      Your Partner For Strategic Influencer Marketing
    </h2>
    {/* Subtext */}
    <p className={`text-white ${inter.className} font-light mb-8 text-sm sm:text-base md:text-lg lg:text-2xl max-w-3xl`}>
      Whether you&apos;re a business looking to expand your reach or a creator
      seeking impactful collaborations, Caskayd provides the intuitive tools
      and resources to make it happen.
    </p>
    {/* Prompt */}
    <h3 className={`text-white ${inter.className} font-medium mb-6 text-base sm:text-lg md:text-xl lg:text-2xl`}>
      Quick one! Where do you belong?
    </h3>
    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-20 w-full max-w-md">
        <a href="/creator" className="flex-1">
          <button className={`${inter.className} w-full py-3 sm:py-4 bg-white text-black text-lg sm:text-xl font-medium rounded-md transition-transform duration-300 hover:scale-105 hover:bg-gray-200`}>
            Creator
          </button>
        </a>
        <a href="/business" className="flex-1">
          <button className={`${inter.className} w-full py-3 sm:py-4 bg-black text-white text-lg sm:text-xl font-medium rounded-md transition-transform duration-300 hover:scale-105 hover:bg-gray-900`}>
            Business
          </button>
        </a>
      </div>
    </div>
  </div>
</div>
  );
}
