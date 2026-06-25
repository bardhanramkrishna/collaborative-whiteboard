import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function RoomInfo({ roomId, userCount, users }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Room code */}
      <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-xs">Room</span>
        <span className="text-white font-mono font-bold text-sm tracking-widest">
          {roomId}
        </span>
        <button
          onClick={copy}
          className="text-gray-400 hover:text-white transition-colors ml-1"
        >
          {copied
            ? <Check size={14} className="text-emerald-400" />
            : <Copy size={14} />}
        </button>
      </div>

      {/* User count */}
      <div className="glass rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Users size={14} className="text-gray-400" />
        <span className="text-white text-sm font-medium">{userCount}</span>
        {users.length > 0 && (
          <div className="flex items-center gap-1 ml-1">
            {users.slice(0, 3).map((u, i) => (
              <span
                key={i}
                className="text-xs text-gray-400 bg-white/5 rounded-full px-2 py-0.5"
              >
                {u}
              </span>
            ))}
            {users.length > 3 && (
              <span className="text-xs text-gray-500">+{users.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}