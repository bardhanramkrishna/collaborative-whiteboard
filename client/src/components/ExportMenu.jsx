import { useState, useRef, useEffect } from "react";
import { Download, FileImage, FileText, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";

export default function ExportMenu({ canvasRef }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const exportPNG = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    // Create a white background version
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width  = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext("2d");
    ctx.fillStyle = "#111118";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    setOpen(false);
  };

  const exportPDF = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width  = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext("2d");
    ctx.fillStyle = "#111118";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const imgData = exportCanvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`whiteboard-${Date.now()}.pdf`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass glass-hover text-gray-300 hover:text-white text-sm font-medium transition-all"
      >
        <Download size={15} />
        <span className="hidden sm:block">Export</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 glass rounded-xl shadow-2xl overflow-hidden z-50 w-44">
          <button
            onClick={exportPNG}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <FileImage size={15} className="text-blue-400" />
            Export as PNG
          </button>
          <div className="w-full h-px bg-white/10" />
          <button
            onClick={exportPDF}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <FileText size={15} className="text-red-400" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}