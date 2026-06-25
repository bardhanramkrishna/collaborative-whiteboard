import { useState } from "react";
import { Save, Check, Loader } from "lucide-react";

export default function SaveButton({ onSave }) {
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const handleSave = async () => {
    setStatus("saving");
    await onSave();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <button
      onClick={handleSave}
      disabled={status !== "idle"}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        status === "saved"
          ? "bg-emerald-600 text-white"
          : "btn-primary text-white"
      } disabled:opacity-70`}
    >
      {status === "idle"   && <><Save size={15} /> Save</>}
      {status === "saving" && <><Loader size={15} className="animate-spin" /> Saving…</>}
      {status === "saved"  && <><Check size={15} /> Saved!</>}
    </button>
  );
}