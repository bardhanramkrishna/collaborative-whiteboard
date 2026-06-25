import {
  Pencil, Minus, Square, Circle, ArrowRight,
  Eraser, Undo2, Redo2, Trash2, MousePointer,
} from "lucide-react";

const TOOLS = [
  { id: "select",    icon: MousePointer, label: "Select" },
  { id: "pen",       icon: Pencil,       label: "Pen" },
  { id: "line",      icon: Minus,        label: "Line" },
  { id: "rect",      icon: Square,       label: "Rectangle" },
  { id: "circle",    icon: Circle,       label: "Circle" },
  { id: "arrow",     icon: ArrowRight,   label: "Arrow" },
  { id: "eraser",    icon: Eraser,       label: "Eraser" },
];

export default function Toolbar({ tool, onToolChange, onUndo, onRedo, onClear, canUndo, canRedo }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2">
      {/* Drawing tools */}
      {TOOLS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onToolChange(id)}
          title={label}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${
            tool === id
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Icon size={18} />
          {/* Tooltip */}
          <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {label}
          </span>
        </button>
      ))}

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-1" />

      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative"
      >
        <Undo2 size={18} />
        <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Undo
        </span>
      </button>

      {/* Redo */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative"
      >
        <Redo2 size={18} />
        <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Redo
        </span>
      </button>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-1" />

      {/* Clear */}
      <button
        onClick={onClear}
        title="Clear board"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all group relative"
      >
        <Trash2 size={18} />
        <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Clear board
        </span>
      </button>
    </div>
  );
}