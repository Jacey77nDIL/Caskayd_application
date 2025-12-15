"use client";

import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";

type User = {
  name: string;
  email: string;
  password: string;
  location: string;
  image: string;
};

type ProfileModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

type EditableInfoRowProps = {
  label: string;
  name: keyof User;
  value: string;
  editing: string;
  setEditing: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

/* ================= PROFILE MODAL ================= */
export default function ProfileModal({
  isModalOpen,
  setIsModalOpen,
  user,
  setUser,
}: ProfileModalProps) {
  const [tempUser, setTempUser] = useState<User>(user);
  const [editing, setEditing] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleSave = () => {
    setUser(tempUser);
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempUser({ ...tempUser, image: imageUrl });
    }
  };

useEffect(() => {
  if (!isModalOpen) return;

  const token = localStorage.getItem("jwt");
  if (!token) {
    console.log("No token found");
    return;
  }

  const fetchUser = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/get_current_user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        console.log("User not authenticated");
        return;
      }

      const data = await res.json();

      if (data.email) {
        setTempUser((prev) => ({
          ...prev,
          email: data.email,
        }));
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  fetchUser();
}, [isModalOpen]);




  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
          >
            <button
              title="close"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            {/* Profile Image */}
            <div className="relative flex justify-center mb-6">
              <img
                src={tempUser.image}
                alt="User"
                className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
              />
              <label className="absolute bottom-2 right-[40%] bg-white p-1.5 rounded-full shadow cursor-pointer">
                <Camera size={16} />
                <input
                  title="image input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
  <EditableInfoRow
    label="Name"
    name="name"
    value={tempUser.name}
    editing={editing}
    setEditing={setEditing}
    handleChange={handleChange}
  />

  <EditableInfoRow
    label="Email"
    name="email"
    value={tempUser.email}
    editing={editing}
    setEditing={setEditing}
    handleChange={handleChange}
  />

  <EditableInfoRow
    label="Password"
    name="password"
    value={tempUser.password}
    type="password"
    editing={editing}
    setEditing={setEditing}
    handleChange={handleChange}
  />

  <EditableInfoRow
    label="Location"
    name="location"
    value={tempUser.location}
    editing={editing}
    setEditing={setEditing}
    handleChange={handleChange}
  />
</div>


            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center bg-black text-white px-10 py-2 rounded-md hover:scale-105 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
/* ================= EDITABLE INFO ROW ================= */
function EditableInfoRow({
  label,
  name,
  value,
  editing,
  setEditing,
  handleChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  editing: string;
  setEditing: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  const isActive = editing === name;

  return (
    <div className="border-gray-100 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="font-medium text-gray-900 w-28">{label}</p>
          <p className="text-gray-700">
            {type === "password" ? "●●●●●●" : value}
          </p>
        </div>
        <svg
          onClick={() => setEditing(isActive ? "" : name)}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
          />
        </svg>
      </div>

      {isActive && (
        <div className="mt-2">
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={`Enter new ${label.toLowerCase()}`}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      )}
    </div>
  );
}
