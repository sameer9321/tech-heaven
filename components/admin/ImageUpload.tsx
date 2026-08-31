"use client";
import { useRef, useState } from "react";
import { UploadCloud, Trash2, RefreshCw, ImageIcon, Loader2, AlertCircle } from "lucide-react";

const ACCEPT = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_MB = 4;

function adminPass() {
  try { return sessionStorage.getItem("adminPassword") || ""; } catch { return ""; }
}

export default function ImageUpload({ value, onChange, label = "Image" }: { value: string; onChange: (path: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setErr("");
    if (!ACCEPT.includes(file.type)) { setErr("Only JPG, JPEG, PNG or WEBP images are allowed."); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setErr(`Image must be under ${MAX_MB} MB.`); return; }

    setBusy(true);
    try {
      const prev = value;
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", headers: { "x-admin-password": adminPass() }, body: fd });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Upload failed"); return; }
      onChange(d.path);
      // Clean up the previously uploaded file (only server-stored ones).
      if (prev && prev.startsWith("/uploads/")) {
        fetch(`/api/upload?path=${encodeURIComponent(prev)}`, { method: "DELETE", headers: { "x-admin-password": adminPass() } }).catch(() => {});
      }
    } catch {
      setErr("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  }

  function remove() {
    if (value && value.startsWith("/uploads/")) {
      fetch(`/api/upload?path=${encodeURIComponent(value)}`, { method: "DELETE", headers: { "x-admin-password": adminPass() } }).catch(() => {});
    }
    onChange("");
    setErr("");
  }

  return (
    <div>
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      <input ref={inputRef} type="file" accept={ACCEPT.join(",")} onChange={onPick} className="hidden" />

      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-24 h-24 rounded-lg object-cover bg-slate-100 border border-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 truncate">{value}</p>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-50">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Replace
              </button>
              <button type="button" onClick={remove} disabled={busy}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 transition py-8 text-slate-500 disabled:opacity-60">
          {busy ? <Loader2 size={26} className="animate-spin text-blue-500" /> : <UploadCloud size={26} className="text-blue-500" />}
          <span className="text-sm font-medium">{busy ? "Uploading…" : "Click to upload image"}</span>
          <span className="text-xs flex items-center gap-1"><ImageIcon size={12} /> JPG, PNG, WEBP · max {MAX_MB}MB</span>
        </button>
      )}

      {err && <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle size={13} /> {err}</p>}
    </div>
  );
}
