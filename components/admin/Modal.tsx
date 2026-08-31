"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_.2s_ease]" onClick={onClose} />
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} my-4 bg-white rounded-2xl shadow-2xl animate-[slideDown_.22s_ease]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="grid place-items-center w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
}
