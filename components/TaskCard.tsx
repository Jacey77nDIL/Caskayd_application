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

export default function TaskCard({ task, onDelete }: { task: Task, onDelete: (id: number) => void }) {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 rounded-xl shadow-md mb-4">
       <p className={` absolute -top-5 left-2 text-xs text-black`}>
        Date Added: {task.dateAdded}
      </p>
      <div className="flex justify-between">
        <p className="text-sm">Date Added: {task.dateAdded}</p>
        <span className={`px-2 py-1 rounded text-sm ${task.status === "Paid" ? "bg-green-500" : "bg-pink-500"}`}>
          {task.status}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <img src={task.logo} alt={task.company} className="w-10 h-10"/>
        <h2 className="font-bold">{task.company}: {task.title}</h2>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold">Deliverables</h3>
        <ul className="list-disc pl-6">
          {task.deliverables.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-3">
        <p>Due: {task.dueDate}</p>
        <p className="font-bold">Price: ₦{task.price.toLocaleString()}</p>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="text-red-400 mt-2 hover:underline"
      >
        DELETE
      </button>
    </div>
  );
}
