import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Plus, LogIn, Copy, Check } from "lucide-react";

export default function RoomPanel() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("create"); // "create" | "join"
  const navigate = useNavigate();

  const generatedCode = uuidv4().slice(0, 8).toUpperCase();

  const handleCreate = () => {
    const name = username.trim() || "Artist";
    const id = uuidv4().slice(0, 8).toUpperCase();
    navigate(`/board/${id}?user=${encodeURIComponent(name)}`);
  };

  const handleJoin = () => {
    if (!roomId.trim()) return;
    const name = username.trim() || "Artist";
    navigate(`/board/${roomId.trim().toUpperCase()}?user=${encodeURIComponent(name)}`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-3xl p-8 w-full max-w-md mx-auto animate-slide-up shadow-2xl">
      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden mb-6 glass">
        {["create", "join"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${
              tab === t
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t === "create" ? "Create Room" : "Join Room"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Your Name</label>
          <input
            className="w-full glass glass-hover rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 transition-colors"
            placeholder="Enter your display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {tab === "create" ? (
          <>
            <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Room code will be</p>
                <p className="text-white font-mono font-bold tracking-widest text-lg">{generatedCode}</p>
              </div>
              <button onClick={copyCode} className="text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            <button
              onClick={handleCreate}
              className="w-full btn-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Create Whiteboard
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Room Code</label>
              <input
                className="w-full glass glass-hover rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500 transition-colors font-mono tracking-widest"
                placeholder="Enter 8-character code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>
            <button
              onClick={handleJoin}
              className="w-full btn-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> Join Whiteboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}