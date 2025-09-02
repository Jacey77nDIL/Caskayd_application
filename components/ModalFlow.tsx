"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "./Modal";

export default function ModalFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8">
      {/* Trigger */}
      <button
        onClick={() => {
          setStep(1);
          setIsOpen(true);
        }}
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Open Modal
      </button>

      {/* AnimatePresence controls transitions */}
      <AnimatePresence mode="wait">
        {isOpen && step === 1 && (
          <Modal
            key="step1"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Connect Your Account"
          >
            <div className="space-y-4">
              <p>Select accounts to connect or disconnect.</p>
              {/* Example accounts */}
              <div className="flex flex-col gap-3">
                <button className="px-4 py-2 bg-white rounded-lg shadow">
                  Twitter — Connect
                </button>
                <button className="px-4 py-2 bg-white rounded-lg shadow">
                  LinkedIn — Disconnect
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </Modal>
        )}

        {isOpen && step === 2 && (
          <Modal
            key="step2"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Set Up Your Account"
          >
            <div className="space-y-4">
              {/* Dropdown */}
              <label className="block">
                <span className="text-sm text-gray-700">Select Niche</span>
                <select className="w-full mt-1 p-2 border rounded-lg">
                  <option>None selected</option>
                  <option>Primary Industry</option>
                  <option>Manufacturing & Industrial</option>
                </select>
              </label>

              {/* File upload */}
              <label className="block">
                <span className="text-sm text-gray-700">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                />
              </label>

              {/* Preview */}
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
