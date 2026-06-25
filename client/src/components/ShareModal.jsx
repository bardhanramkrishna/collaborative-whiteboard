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
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareEmail = () => {
    const subject = "Join my whiteboard room";
    const body = `Join my collaborative whiteboard.\n\nRoom code: ${roomId}\nLink: ${shareUrl}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-violet-400" />
            <span className="text-white font-semibold">Share Room</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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
          <span className="text-gray-400 text-xs truncate flex-1">{shareUrl}</span>
          <button onClick={copy} className="shrink-0 text-gray-400 hover:text-white transition-colors">
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </button>

          <button
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-gray-300 hover:text-white transition-all"
          >
            <Mail size={15} />
            Gmail
          </button>
        </div>

        {/* WhatsApp share */}
        <button
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join my whiteboard! Room code: ${roomId}\n${shareUrl}`)}`, "_blank")}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: "#25D366" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
      </div>
    </div>
  );
}