"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";

type Props = { categories: string[]; brands: string[]; priceMax: number };

export default function Filters({ categories, brands, priceMax, onDone }: Props & { onDone?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const current = {
    category: sp.get("category") || "",
    brands: (sp.get("brand") || "").split(",").filter(Boolean),
    avail: sp.get("avail") || "",
    max: sp.get("max") || "",
  };

  const update = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => { if (v === null || v === "") next.delete(k); else next.set(k, v); });
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
    onDone?.();
  }, [sp, router, pathname, onDone]);

  const toggleBrand = (b: string) => {
    const set = new Set(current.brands);
    set.has(b) ? set.delete(b) : set.add(b);
    update({ brand: [...set].join(",") });
  };

  const hasFilters = current.category || current.brands.length || current.avail || current.max;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">Filters</h3>
        {hasFilters ? (
          <button onClick={() => update({ category: null, brand: null, avail: null, max: null })} className="text-xs font-medium text-secondary flex items-center gap-1">
            <X size={13} /> Clear all
          </button>
        ) : null}
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">Category</p>
        <div className="space-y-1">
          <button onClick={() => update({ category: null })} className={`block w-full text-left px-2.5 py-1.5 rounded-lg text-sm ${!current.category ? "bg-secondary-50 text-secondary font-medium" : "hover:bg-bg"}`}>All categories</button>
          {categories.map((c) => (
            <button key={c} onClick={() => update({ category: c })} className={`block w-full text-left px-2.5 py-1.5 rounded-lg text-sm ${current.category === c ? "bg-secondary-50 text-secondary font-medium" : "hover:bg-bg"}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">Brand</p>
        <div className="space-y-1.5 max-h-52 overflow-auto pr-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 text-sm cursor-pointer px-1 py-0.5">
              <input type="checkbox" checked={current.brands.includes(b)} onChange={() => toggleBrand(b)} className="w-4 h-4 accent-secondary" />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">Max price</p>
        <input
          type="range" min={0} max={priceMax} step={5000}
          value={current.max || priceMax}
          onChange={(e) => update({ max: e.target.value })}
          className="w-full accent-secondary"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>Rs. 0</span>
          <span className="font-medium text-primary">Up to Rs. {Number(current.max || priceMax).toLocaleString("en-PK")}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">Availability</p>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input type="checkbox" checked={current.avail === "in"} onChange={(e) => update({ avail: e.target.checked ? "in" : null })} className="w-4 h-4 accent-secondary" />
          In stock only
        </label>
      </div>
    </div>
  );
}
