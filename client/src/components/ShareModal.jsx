import { useState } from "react";
import { X, Link2, Copy, Check, Mail } from "lucide-react";

export default function ShareModal({ roomId, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/board/${roomId}?user=Guest`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTwitter = () => {
    const text = `Join my collaborative whiteboard! Room code: ${roomId}`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareEmail = () => {
    const subject = "Join my whiteboard room";
    const body = `Hey! Join my collaborative whiteboard.\n\nRoom code: ${roomId}\nLink: ${shareUrl}`;

    window.open(
      `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-violet-400" />
            <span className="text-white font-semibold">Share Room</span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Room code */}
        <div className="flex items-center justify-center mb-5">
          <div className="glass rounded-2xl px-6 py-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Room Code</p>
            <p className="text-white font-mono font-black text-3xl tracking-widest">
              {roomId}
            </p>
          </div>
        </div>

        {/* Share URL */}
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 mb-4">
          <span className="text-gray-400 text-xs truncate flex-1">
            {shareUrl}
          </span>

          <button
            onClick={copy}
            className="shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {copied && (
          <p className="text-emerald-400 text-xs text-center mb-3">
            ✓ Link copied to clipboard!
          </p>
        )}

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={shareTwitter}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: "#000000" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </button>

          <button
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-gray-300 hover:text-white transition-all"
          >
            <Mail size={15} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
}