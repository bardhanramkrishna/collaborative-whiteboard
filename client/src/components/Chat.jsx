import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Users } from "lucide-react";

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const AVATAR_COLORS = [
  "#7c3aed","#2563eb","#059669","#d97706",
  "#dc2626","#db2777","#0891b2","#65a30d",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

export default function Chat({ username, messages, onSend, activeUsers }) {
  const [open, setOpen]   = useState(false);
  const [text, setText]   = useState("");
  const [unread, setUnread] = useState(0);
  const bottomRef         = useRef(null);
  const inputRef          = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
    } else {
      // Count unread when chat is closed
      setUnread((u) => u + 1);
    }
  }, [messages.length]); // eslint-disable-line

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [open]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* ── Floating toggle button ─────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-2xl btn-primary text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105"
        style={{ width: 52, height: 52 }}
      >
        <MessageCircle size={22} />
        {unread > 0 && !open && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* ── Chat panel ────────────────────────────────── */}
      <div
        className={`fixed bottom-20 right-6 z-50 flex flex-col glass rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ width: 320, height: 460 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-violet-400" />
            <span className="text-white font-semibold text-sm">Room Chat</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Active users count */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users size={12} />
              <span>{activeUsers.length} online</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Active users row */}
        {activeUsers.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 overflow-x-auto">
            {activeUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: avatarColor(u) }}
                >
                  {u[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-gray-400">{u}</span>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
              <MessageCircle size={32} />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Say hello to your collaborators!</p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.type === "system") {
              return (
                <div key={i} className="flex justify-center">
                  <span className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1">
                    {msg.message}
                  </span>
                </div>
              );
            }

            const isMe = msg.username === username;
            return (
              <div
                key={i}
                className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {!isMe && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: avatarColor(msg.username) }}
                  >
                    {msg.username[0]?.toUpperCase()}
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <span className="text-xs text-gray-400 px-1">{msg.username}</span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                      isMe
                        ? "bg-violet-600 text-white rounded-tr-sm"
                        : "bg-white/10 text-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-xs text-gray-600 px-1">
                    {formatTime(msg.time)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-white/10 flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 glass rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 outline-none resize-none focus:border-violet-500 transition-colors leading-relaxed"
            style={{ maxHeight: 100 }}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-9 h-9 rounded-xl btn-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-all"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </>
  );
}