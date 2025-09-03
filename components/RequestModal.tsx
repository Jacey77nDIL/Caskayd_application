// components/RequestModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type RequestModalProps = {
  show: boolean;
  onClose: () => void;
  data: {
    logo: string;
    company: string;
    title: string;
    price: string;
    dueDate: string;
    deliverables: string[];
  } | null;
};

export default function RequestModal({ show, onClose, data }: RequestModalProps) {
  return (
    <AnimatePresence>
      {show && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
        >
          {/* Modal container */}
          <motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 100, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="bg-gray-100 p-6 rounded-xl max-w-[400px] w-full mx-4 relative shadow-xl"
>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <Image src={data.logo} alt={data.title} width={40} height={40} />
              <h2 className="font-semibold">
                {data.company}: {data.title}
              </h2>
            </div>

            {/* Price */}
            <p className="mb-2 font-medium">Price: {data.price}</p>

            {/* Deliverables */}
            <h3 className="font-bold underline">Deliverables</h3>
            <ul className="list-disc list-inside text-gray-700 mb-3">
              {data.deliverables.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            {/* Due date */}
            <p className="text-sm text-gray-500 mb-4">
              Due Date: {data.dueDate}
            </p>

            {/* Actions */}
            <div className="flex justify-center space-x-3">
              <button className="bg-green-500 text-white px-4 py-1 rounded-md">
                Accept
              </button>
              <button className="border border-gray-500 text-gray-700 px-4 py-1 rounded-md">
                Refine
              </button>
              <button className="bg-red-500 text-white px-4 py-1 rounded-md">
                Decline
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
