import { useRef, useEffect, useCallback } from "react";

const getPos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const drawArrow = (ctx, x1, y1, x2, y2) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 15;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - len * Math.cos(angle - Math.PI / 6), y2 - len * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - len * Math.cos(angle + Math.PI / 6), y2 - len * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
};

const redrawAll = (ctx, canvas, drawings) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings.forEach((d) => {
    ctx.strokeStyle = d.color;
    ctx.fillStyle = d.color;
    ctx.lineWidth = d.brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (d.tool === "pen" && d.points?.length) {
      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      d.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (d.tool === "eraser" && d.points?.length) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = d.brushSize * 2;
      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      d.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.restore();
    } else if (d.tool === "line") {
      ctx.beginPath();
      ctx.moveTo(d.startX, d.startY);
      ctx.lineTo(d.endX, d.endY);
      ctx.stroke();
    } else if (d.tool === "rect") {
      ctx.beginPath();
      ctx.strokeRect(d.startX, d.startY, d.endX - d.startX, d.endY - d.startY);
    } else if (d.tool === "circle") {
      const rx = Math.abs(d.endX - d.startX) / 2;
      const ry = Math.abs(d.endY - d.startY) / 2;
      ctx.beginPath();
      ctx.ellipse(
        d.startX + (d.endX - d.startX) / 2,
        d.startY + (d.endY - d.startY) / 2,
        rx, ry, 0, 0, 2 * Math.PI
      );
      ctx.stroke();
    } else if (d.tool === "arrow") {
      drawArrow(ctx, d.startX, d.startY, d.endX, d.endY);
    }
  });
};

export default function Canvas({ tool, color, brushSize, drawings, setDrawings, onDrawEnd }) {
  const canvasRef  = useRef(null);
  const overlayRef = useRef(null);
  const isDrawing  = useRef(false);
  const startPos   = useRef({ x: 0, y: 0 });
  const currentPts = useRef([]);

  // Keep a ref to latest drawings so callbacks don't go stale
  const drawingsRef = useRef(drawings);
  useEffect(() => { drawingsRef.current = drawings; }, [drawings]);

  // Keep refs to latest tool/color/brushSize so callbacks don't go stale
  const toolRef      = useRef(tool);
  const colorRef     = useRef(color);
  const brushRef     = useRef(brushSize);
  useEffect(() => { toolRef.current = tool; },      [tool]);
  useEffect(() => { colorRef.current = color; },    [color]);
  useEffect(() => { brushRef.current = brushSize; }, [brushSize]);

  // Resize + initial size
  useEffect(() => {
    const resize = () => {
      [canvasRef, overlayRef].forEach((ref) => {
        if (ref.current) {
          ref.current.width  = window.innerWidth;
          ref.current.height = window.innerHeight;
        }
      });
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && canvasRef.current) {
        redrawAll(ctx, canvasRef.current, drawingsRef.current);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []); // runs once — uses refs for drawings

  // Redraw whenever drawings array changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (ctx && canvas) redrawAll(ctx, canvas, drawings);
  }, [drawings]);

  const applyStyle = useCallback((ctx) => {
    ctx.strokeStyle = colorRef.current;
    ctx.fillStyle   = colorRef.current;
    ctx.lineWidth   = brushRef.current;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
  }, []); // stable — reads from refs

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    isDrawing.current = true;
    const pos = getPos(e, canvas);
    startPos.current  = pos;
    currentPts.current = [pos];
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    const pos     = getPos(e, canvas);
    const ctx     = canvas.getContext("2d");
    const octx    = overlay.getContext("2d");
    const t       = toolRef.current;

    if (t === "pen") {
      applyStyle(ctx);
      const pts = currentPts.current;
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      currentPts.current.push(pos);

    } else if (t === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushRef.current * 2;
      ctx.lineCap   = "round";
      const pts = currentPts.current;
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.restore();
      currentPts.current.push(pos);

    } else {
      const { x: sx, y: sy } = startPos.current;
      octx.clearRect(0, 0, overlay.width, overlay.height);
      applyStyle(octx);

      if (t === "line") {
        octx.beginPath();
        octx.moveTo(sx, sy);
        octx.lineTo(pos.x, pos.y);
        octx.stroke();
      } else if (t === "rect") {
        octx.beginPath();
        octx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
      } else if (t === "circle") {
        const rx = Math.abs(pos.x - sx) / 2;
        const ry = Math.abs(pos.y - sy) / 2;
        octx.beginPath();
        octx.ellipse(sx + (pos.x - sx) / 2, sy + (pos.y - sy) / 2, rx, ry, 0, 0, 2 * Math.PI);
        octx.stroke();
      } else if (t === "arrow") {
        drawArrow(octx, sx, sy, pos.x, pos.y);
      }
    }
  }, [applyStyle]);

  const onMouseUp = useCallback((e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    const octx    = overlay.getContext("2d");
    const pos     = getPos(e, canvas);
    const { x: sx, y: sy } = startPos.current;
    const t       = toolRef.current;

    octx.clearRect(0, 0, overlay.width, overlay.height);

    let newDrawing = null;

    if (t === "pen") {
      newDrawing = {
        tool: "pen",
        color: colorRef.current,
        brushSize: brushRef.current,
        points: currentPts.current,
      };
    } else if (t === "eraser") {
      newDrawing = {
        tool: "eraser",
        color: colorRef.current,
        brushSize: brushRef.current,
        points: currentPts.current,
      };
    } else if (["line", "rect", "circle", "arrow"].includes(t)) {
      newDrawing = {
        tool: t,
        color: colorRef.current,
        brushSize: brushRef.current,
        startX: sx, startY: sy,
        endX: pos.x, endY: pos.y,
      };

      // Commit shape onto main canvas immediately
      const ctx = canvas.getContext("2d");
      applyStyle(ctx);
      if (t === "line") {
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(pos.x, pos.y); ctx.stroke();
      } else if (t === "rect") {
        ctx.beginPath(); ctx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
      } else if (t === "circle") {
        const rx = Math.abs(pos.x - sx) / 2;
        const ry = Math.abs(pos.y - sy) / 2;
        ctx.beginPath();
        ctx.ellipse(sx + (pos.x - sx) / 2, sy + (pos.y - sy) / 2, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (t === "arrow") {
        drawArrow(ctx, sx, sy, pos.x, pos.y);
      }
    }

    if (newDrawing) {
      const updated = [...drawingsRef.current, newDrawing];
      setDrawings(updated);
      onDrawEnd?.(newDrawing);
    }
  }, [applyStyle, setDrawings, onDrawEnd]);

  const cursor =
    tool === "eraser" ? "cell"
    : tool === "select" ? "default"
    : "crosshair";

  return (
    <div className="absolute inset-0" style={{ cursor }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <canvas
        ref={overlayRef}
        className="absolute inset-0"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
      />
    </div>
  );
}