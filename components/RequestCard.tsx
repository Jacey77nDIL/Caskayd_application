// components/RequestCard.tsx
import Image from "next/image";

type RequestCardProps = {
  logo: string;
  title: string;
  onClick: () => void;
};

export default function RequestCard({ logo, title, onClick }: RequestCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#1d2766] to-[#25317e] text-white rounded-xl p-4 shadow-md cursor-pointer hover:scale-[1.01] transition gap-4"
    >
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <Image
          src={logo}
          alt={title}
          width={40}
          height={40}
          className="rounded-full"
        />
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end gap-2">
        <button className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          Accept
        </button>
        <button className="border border-gray-400 text-gray-200 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          Refine
        </button>
        <button className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          Decline
        </button>
      </div>
    </div>
  );
}
