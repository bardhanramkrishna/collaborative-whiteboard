import { Pencil } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Pencil className="text-violet-400" size={22} />
        <span className="text-white font-bold text-lg tracking-tight">DrawTogether</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live collaboration
        </span>
      </div>
    </nav>
  );
}