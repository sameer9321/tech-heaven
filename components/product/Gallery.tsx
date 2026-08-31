"use client";
import { useState } from "react";
import { ZoomIn } from "lucide-react";

// Premium gallery: hover magnifier zoom + thumbnail strip.
// The catalog stores a single image, so the thumbnail strip mirrors it;
// additional angles can be added later without touching this component.
export default function Gallery({ image, name, badge }: { image: string; name: string; badge?: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const thumbs = [image];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setPos(null)}
        className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-line group cursor-zoom-in"
      >
        {badge && <span className="absolute top-4 left-4 z-10 badge-pill badge-sale">{badge}</span>}
        <span className="absolute top-4 right-4 z-10 grid place-items-center w-9 h-9 rounded-lg bg-white/90 border border-line text-slate-500 opacity-0 group-hover:opacity-100 transition"><ZoomIn size={16} /></span>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200"
          style={pos ? { transform: "scale(1.9)", transformOrigin: `${pos.x}% ${pos.y}%` } : undefined}
        />
      </div>
      <div className="mt-4 flex gap-3">
        {thumbs.map((t, i) => (
          <button key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-secondary bg-white">
            <img src={t} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
