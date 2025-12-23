"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Matches your User type in TopNavbar
type User = {
  id?: number;
  name: string;
  email: string;
  location: string;
  image: string;
  bio?: string;
};

type ProfileModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser?: any; // kept for compatibility, but unused here
};

export default function ProfileModal({
  isModalOpen,
  setIsModalOpen,
  user,
}: ProfileModalProps) {
  const router = useRouter();

  const handleEditRedirect = () => {
    setIsModalOpen(false);
    router.push("/WebCreatorProfile");
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Decorative Header Background */}
            <div className="h-24 bg-[#823A5E]/10 w-full absolute top-0 left-0" />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-black transition z-10 backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            <div className="pt-12 px-6 pb-8 flex flex-col items-center relative">
              {/* Profile Image (Read Only) */}
              <div className="relative w-28 h-28 rounded-full border-[4px] border-white shadow-md bg-gray-50 mb-4 overflow-hidden">
                <Image 
                  src={user.image || "/images/avatar.png"} 
                  alt={user.name} 
                  fill
                  className="object-cover"
                />
              </div>

              {/* Basic Info */}
              <h2 className="text-2xl font-bold text-gray-900 text-center">{user.name}</h2>
              {user.bio && (
                <p className="text-sm text-gray-500 text-center mt-2 max-w-[85%] line-clamp-3">
                  {user.bio}
                </p>
              )}

              {/* Details List */}
              <div className="w-full mt-8 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-[#823A5E] shadow-sm"><Mail size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-[#823A5E] shadow-sm"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-700">{user.location || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleEditRedirect}
                className="w-full mt-8 bg-black text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}