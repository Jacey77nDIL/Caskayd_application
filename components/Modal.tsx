"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null; // <-- prevents rendering when closed

  return (
    <div className="flex-col text-center fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
      <motion.div
        key="modal"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-[#E6D8DF] rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col text-center items-center mb-4">
          {title && <h2 className="text-xl font-semibold text-black">{title}</h2>}
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-black absolute top-6 right-6">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">{children}</div>
      </motion.div>
    </div>
  );
}
