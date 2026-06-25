const SIZES = [2, 4, 8, 14, 22];

export default function BrushSize({ size, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 font-medium px-1">
        Brush — <span className="text-white">{size}px</span>
      </p>
      <div className="flex items-center gap-2 px-1">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              width: 28, height: 28,
              border: size === s
                ? "2px solid #a78bfa"
                : "2px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="rounded-full bg-white"
              style={{ width: s, height: s, maxWidth: 20, maxHeight: 20 }}
            />
          </button>
        ))}
      </div>
      <input
        type="range"
        min={1}
        max={50}
        value={size}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500 mt-1"
      />
    </div>
  );
}