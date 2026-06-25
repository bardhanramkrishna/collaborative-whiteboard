import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import config from "../config";
const SOCKET_URL = config.SERVER_URL;

export default function useSocket({
  roomId,
  username,
  onDrawingUpdate,
  onBoardCleared,
  onUndo,
  onRedo,
  onCursorUpdate,
  onUserJoined,
  onUserLeft,
  onActiveUsers,
  onChatMessage,
  onChatHistory,
}) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join-room", { roomId, username });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ Socket connect error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔌 Socket disconnected:", reason);
    });

    socket.on("reconnect", (attempt) => {
      console.log("🔄 Reconnected after", attempt, "attempts");
      socket.emit("join-room", { roomId, username });
    });

    socket.on("drawing-update", onDrawingUpdate);
    socket.on("board-cleared", onBoardCleared);
    socket.on("undo", onUndo);
    socket.on("redo", onRedo);
    socket.on("cursor-update", onCursorUpdate);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("active-users", onActiveUsers);
    socket.on("chat-message", onChatMessage);
    socket.on("chat-history", onChatHistory);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("drawing-update");
      socket.off("board-cleared");
      socket.off("undo");
      socket.off("redo");
      socket.off("cursor-update");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("active-users");
      socket.off("chat-message");
      socket.off("chat-history");

      socket.disconnect();
    };
  }, [roomId, username]); // eslint-disable-line

  const emitDraw = useCallback(
    (data) => socketRef.current?.emit("draw", data),
    []
  );

  const emitShape = useCallback(
    (data) => socketRef.current?.emit("shape-draw", data),
    []
  );

  const emitErase = useCallback(
    (data) => socketRef.current?.emit("erase", data),
    []
  );

  const emitUndo = useCallback(
    () => socketRef.current?.emit("undo", { roomId }),
    [roomId]
  );

  const emitRedo = useCallback(
    () => socketRef.current?.emit("redo", { roomId }),
    [roomId]
  );

  const emitClear = useCallback(
    () => socketRef.current?.emit("clear-board", { roomId }),
    [roomId]
  );

  const emitCursor = useCallback(
    (x, y) =>
      socketRef.current?.emit("cursor-move", {
        roomId,
        x,
        y,
        username,
      }),
    [roomId, username]
  );

  const emitChat = useCallback(
    (message) => {
      console.log("📤 Sending chat:", message);

      socketRef.current?.emit("chat-message", {
        roomId,
        username,
        message,
        time: new Date().toISOString(),
      });
    },
    [roomId, username]
  );

  return {
    emitDraw,
    emitShape,
    emitErase,
    emitUndo,
    emitRedo,
    emitClear,
    emitCursor,
    emitChat,
  };
}