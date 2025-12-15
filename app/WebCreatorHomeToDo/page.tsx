"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import TaskCard from "@/components/TaskCard";

type Task = {
  id: number;
  company: string;
  logo: string;
  title: string;
  status: string;
  deliverables: string[];
  price: number;
  dueDate: string;
  dateAdded: string;
};

export default function HomeWebCreatorHomeToDoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const handleDelete = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    // 1. Add min-h-screen and bg color to the outer wrapper so the whole page looks consistent
    <div className="min-h-screen bg-gray-50">
      
      {/* Fixed Navbar sits on top */}
      <TopNavbar />

      {/* 2. CRITICAL: Add padding-top (pt-24) here. 
          This ensures TabsNavbar is not hidden behind TopNavbar. */}
      <main className="pt-24">
        
        <TabsNavbar />

        {/* 3. Content container with centered constraint (optional but recommended) */}
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {tasks.length === 0 ? (
             <p className="text-gray-500 text-center mt-10">No tasks found.</p>
          ) : (
             <div className="space-y-4">
               {tasks.map((task) => (
                 <TaskCard key={task.id} task={task} onDelete={handleDelete} />
               ))}
             </div>
          )}
        </div>

      </main>
    </div>
  );
}