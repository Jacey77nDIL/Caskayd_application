import { Trash2 } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type Task = {
  id: number;
  company: string;
  logo: string;
  title: string;
  status: string;
  price: number;
  dueDate: string;
  dateAdded: string;
};

export default function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="relative w-full h-full">
      {/* Date Added */}
      <p className={`${inter.className} text-xs ml-1 text-black mb-2`}>
        Date Added: {task.dateAdded}
      </p>

      {/* Main Card */}
      <div className="bg-gradient-to-b from-[#1c1c5a] to-[#212f6d] text-white p-4 rounded-xl shadow-md mb-4">
        {/* Top: Logo, Title, Status, Due */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <img
              src={task.logo}
              alt={task.company}
              className="w-12 h-12 rounded-full object-cover"
            />
            <h2
              className={`${inter.className} font-medium text-lg sm:text-2xl`}
            >
              {task.company}: {task.title}
            </h2>
            <span
              className={`${inter.className} px-2 py-1 rounded text-xs sm:text-sm ${
                task.status === "Paid"
                  ? "bg-green-500"
                  : "border border-red-600 rounded-md"
              }`}
            >
              {task.status}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <p className={`${inter.className} text-xs sm:text-sm`}>
              Due: {task.dueDate}
            </p>
          </div>
        </div>

        {/* Price + Delete Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          <p
            className={`font-semibold text-xl sm:text-2xl ${inter.className}`}
          >
            Price: ₦{task.price.toLocaleString()}
          </p>
          <button
            onClick={() => onDelete(task.id)}
            className={`${inter.className} flex items-center gap-1 text-red-500 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md transition-transform duration-200 hover:scale-110`}
          >
            DELETE <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
