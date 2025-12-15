// components/LoadingOverlay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Don't render anything on the server, only on client
  if (!mounted) return null;

  // Render directly into the body tag
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <Loader2 className="w-10 h-10 text-[#823A5E] animate-spin" />
        <div className="text-base font-semibold text-gray-800 tracking-wide">
          {message}
        </div>
      </div>
    </div>,
    document.body
  );
}