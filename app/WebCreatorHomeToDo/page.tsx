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
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const handleDelete = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div>
      <TopNavbar />
      <TabsNavbar />

      <div className="p-4">
        <div className="flex justify-end mb-4">
          <button className="px-4 text-2xl py-2 text-black rounded-lg transition-transform hover:scale-110 hover:shadow-lg duration-300">ADD +</button>
        </div>

        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
