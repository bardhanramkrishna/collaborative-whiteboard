import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Canvas      from "../../components/Canvas";
import Toolbar     from "../../components/Toolbar";
import ColorPicker from "../../components/ColorPicker";
import BrushSize   from "../../components/BrushSize";
import RoomInfo    from "../../components/RoomInfo";
import SaveButton  from "../../components/SaveButton";
import Chat        from "../../components/Chat";
import LiveCursors from "../../components/LiveCursors";
import useSocket   from "../../hooks/useSocket";
import { Home }    from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ExportMenu  from "../../components/ExportMenu";
import ShareModal  from "../../components/ShareModal";
import { Share2 } from "lucide-react";
import config from "../../config";

export default function WhiteboardPage() {
  const { roomId }       = useParams();
  const [searchParams]   = useSearchParams();
  const username         = searchParams.get("user") || "Artist";
  const navigate         = useNavigate();

  // ── Drawing state ──────────────────────────────────────
  const [tool, setTool]         = useState("pen");
  const [color, setColor]       = useState("#ffffff");
  const [brushSize, setBrush]   = useState(4);
  const [drawings, setDrawings] = useState([]);
  const drawingsRef             = useRef(drawings);
  useEffect(() => { drawingsRef.current = drawings; }, [drawings]);

  // ── Users + cursors ────────────────────────────────────
  const [activeUsers, setActiveUsers] = useState([username]);
  const [cursors, setCursors]         = useState({});

  // ── Chat ───────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [showShare, setShowShare] = useState(false);
  // ── Load saved board on mount ──────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        
        const res = await fetch(`${config.SERVER_URL}/api/boards/${roomId}`);
        const data = await res.json();
        if (data.success && data.drawings?.length) {
          setDrawings(data.drawings);
          toast.success("Board loaded!", { icon: "🎨" });
        }
      } catch (err) {
        console.error("Load board failed:", err);
      }
    };
    load();
  }, [roomId]);

  // ── Socket callbacks ───────────────────────────────────
  const handleDrawingUpdate = useCallback((data) => {
    setDrawings((prev) => [...prev, data]);
  }, []);

  const handleBoardCleared = useCallback(() => {
    setDrawings([]);
    toast("Board cleared by someone", { icon: "🗑️" });
  }, []);

  const handleUndo = useCallback(() => {
    setDrawings((prev) => prev.slice(0, -1));
  }, []);

  const handleRedo = useCallback(() => {
    // Full redo history in Phase 5
  }, []);

  const handleCursorUpdate = useCallback(({ socketId, x, y, username: uname }) => {
    setCursors((prev) => ({ ...prev, [socketId]: { x, y, username: uname } }));
  }, []);

  const handleUserJoined = useCallback(({ username: uname, activeUsers: users }) => {
    setActiveUsers(users);
    toast.success(`${uname} joined`, { icon: "👋", duration: 2500 });
  }, []);

  const handleUserLeft = useCallback(({ username: uname, activeUsers: users }) => {
    setActiveUsers(users);
    setCursors((prev) => {
      const copy = { ...prev };
      // Remove cursor by username
      Object.keys(copy).forEach((id) => {
        if (copy[id].username === uname) delete copy[id];
      });
      return copy;
    });
    toast(`${uname} left`, { icon: "👋", duration: 2000 });
  }, []);

  const handleActiveUsers = useCallback(({ activeUsers: users }) => {
    setActiveUsers(users);
  }, []);

  const handleChatMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleChatHistory = useCallback((history) => {
    setMessages(history);
  }, []);

  // ── Socket hook ────────────────────────────────────────
  const { emitDraw, emitShape, emitErase, emitUndo, emitRedo, emitClear, emitCursor, emitChat } = useSocket({
    roomId,
    username,
    onDrawingUpdate: handleDrawingUpdate,
    onBoardCleared:  handleBoardCleared,
    onUndo:          handleUndo,
    onRedo:          handleRedo,
    onCursorUpdate:  handleCursorUpdate,
    onUserJoined:    handleUserJoined,
    onUserLeft:      handleUserLeft,
    onActiveUsers:   handleActiveUsers,
    onChatMessage:   handleChatMessage,
    onChatHistory:   handleChatHistory,
  });

  // Wire chat-history (one-time event on join)
  useEffect(() => {
    // handled inside useSocket via onChatMessage sequence
  }, []);

  // ── Drawing actions ────────────────────────────────────
  const handleDrawEnd = useCallback((drawing) => {
    if (drawing.tool === "pen") {
      emitDraw({ ...drawing, roomId });
    } else if (drawing.tool === "eraser") {
      emitErase({ ...drawing, roomId });
    } else {
      emitShape({ ...drawing, roomId });
    }
  }, [roomId, emitDraw, emitShape, emitErase]);

  const undo = useCallback(() => {
    setDrawings((prev) => prev.slice(0, -1));
    emitUndo();
  }, [emitUndo]);

  const redo = useCallback(() => {
    emitRedo();
  }, [emitRedo]);

  const clear = useCallback(() => {
    setDrawings([]);
    emitClear();
  }, [emitClear]);

  // ── Cursor tracking ────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    emitCursor(e.clientX, e.clientY);
  }, [emitCursor]);

  // ── Save ───────────────────────────────────────────────
  const handleSave = async () => {
    try {
      await fetch(`${config.SERVER_URL}/api/boards/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, drawings: drawingsRef.current }),
      });
      toast.success("Board saved!", { icon: "💾" });
    } catch (err) {
      toast.error("Save failed");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#111118] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            fontSize: 13,
          },
        }}
      />

      {/* ── Top bar ───────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 glass border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Home size={18} />
          </button>
          <span className="text-white font-bold tracking-tight text-sm hidden sm:block">
            DrawTogether
          </span>
        </div>

        <RoomInfo
          roomId={roomId}
          userCount={activeUsers.length}
          users={activeUsers}
        />

        {/* Right — actions */}
<div className="flex items-center gap-2">
  <ExportMenu />

  <button
    onClick={() => setShowShare(true)}
    className="flex items-center gap-2 px-3 py-2 rounded-xl glass glass-hover text-gray-300 hover:text-white text-sm font-medium transition-all"
  >
    <Share2 size={15} />
    <span className="hidden sm:block">Share</span>
  </button>

  <SaveButton onSave={handleSave} />
</div>
      </div>

      {/* ── Left toolbar ──────────────────────────────── */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 glass rounded-2xl shadow-xl">
        <Toolbar
          tool={tool}
          onToolChange={setTool}
          onUndo={undo}
          onRedo={redo}
          onClear={clear}
          canUndo={drawings.length > 0}
          canRedo={false}
        />
      </div>

      {/* ── Right panel ───────────────────────────────── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 glass rounded-2xl p-4 flex flex-col gap-5 shadow-xl w-48">
        <ColorPicker color={color} onChange={setColor} />
        <div className="w-full h-px bg-white/10" />
        <BrushSize size={brushSize} onChange={setBrush} />
      </div>

      {/* ── Canvas ────────────────────────────────────── */}
      <Canvas
        tool={tool}
        color={color}
        brushSize={brushSize}
        drawings={drawings}
        setDrawings={setDrawings}
        onDrawEnd={handleDrawEnd}
      />

      {/* ── Live cursors ──────────────────────────────── */}
      <LiveCursors cursors={cursors} />

      {/* ── Chat ──────────────────────────────────────── */}
      <Chat
        username={username}
        messages={messages}
        onSend={emitChat}
        activeUsers={activeUsers}
      />

      {/* ── Tool indicator ────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 glass rounded-full px-4 py-2 pointer-events-none">
        <span className="text-gray-400 text-xs capitalize">
          {tool} · {color} · {brushSize}px
        </span>
      </div>
      {/* Share modal */}
{showShare && (
  <ShareModal
    roomId={roomId}
    onClose={() => setShowShare(false)}
  />
)}
    </div>
  );
}