const COLORS = [
  "#ffffff", "#f87171", "#fb923c", "#fbbf24",
  "#a3e635", "#34d399", "#38bdf8", "#818cf8",
  "#e879f9", "#f472b6", "#000000", "#64748b",
];

export default function ColorPicker({ color, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 font-medium px-1">Color</p>
      <div className="grid grid-cols-4 gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-7 h-7 rounded-lg transition-all hover:scale-110"
            style={{
              background: c,
              border: color === c
                ? "2px solid #a78bfa"
                : "2px solid rgba(255,255,255,0.1)",
              boxShadow: color === c ? "0 0 0 1px #a78bfa" : "none",
            }}
          />
        ))}
      </div>
      {/* Custom color */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
          title="Custom color"
        />
        <span className="text-xs text-gray-500">Custom</span>
      </div>
    </div>
  );
}