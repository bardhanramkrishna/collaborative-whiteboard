const CURSOR_COLORS = [
  "#f87171", "#fb923c", "#fbbf24", "#34d399",
  "#38bdf8", "#818cf8", "#e879f9", "#f472b6",
];

const colorCache = {};
const getColor = (id) => {
  if (!colorCache[id]) {
    colorCache[id] = CURSOR_COLORS[Object.keys(colorCache).length % CURSOR_COLORS.length];
  }
  return colorCache[id];
};

export default function LiveCursors({ cursors }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {Object.entries(cursors).map(([id, { x, y, username }]) => (
        <div
          key={id}
          className="absolute transition-all duration-75"
          style={{ left: x, top: y }}
        >
          {/* Cursor SVG */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 2L16 9.5L10 11L7.5 17L4 2Z"
              fill={getColor(id)}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          {/* Username label */}
          <div
            className="absolute top-5 left-2 text-xs px-2 py-0.5 rounded-full text-white font-medium whitespace-nowrap"
            style={{ background: getColor(id) }}
          >
            {username}
          </div>
        </div>
      ))}
    </div>
  );
}