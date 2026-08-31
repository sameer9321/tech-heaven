"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import Filters from "./Filters";

const SORTS = [
  { v: "new", l: "Newest" },
  { v: "price-asc", l: "Price: Low to High" },
  { v: "price-desc", l: "Price: High to Low" },
  { v: "name", l: "Name: A–Z" },
];

export default function Toolbar({ count, categories, brands, priceMax }: { count: number; categories: string[]; brands: string[]; priceMax: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const view = sp.get("view") === "list" ? "list" : "grid";
  const sort = sp.get("sort") || "new";

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set(k, v);
    if (k !== "view") next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <p className="text-sm text-muted"><b className="text-primary">{count}</b> products found</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setDrawer(true)} className="lg:hidden btn btn-sm"><SlidersHorizontal size={15} /> Filters</button>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value)} className="field !w-auto !py-2 text-sm">
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
          <div className="flex rounded-lg border border-line overflow-hidden">
            <button onClick={() => setParam("view", "grid")} aria-label="Grid view" className={`grid place-items-center w-10 h-10 ${view === "grid" ? "bg-secondary text-white" : "bg-white text-slate-500 hover:text-secondary"}`}><LayoutGrid size={17} /></button>
            <button onClick={() => setParam("view", "list")} aria-label="List view" className={`grid place-items-center w-10 h-10 border-l border-line ${view === "list" ? "bg-secondary text-white" : "bg-white text-slate-500 hover:text-secondary"}`}><List size={17} /></button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease]" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-auto p-5 animate-[slideInLeft_.25s_ease]">
            <div className="flex items-center justify-between mb-4">
              <b>Filters</b>
              <button className="icon-btn !w-9 !h-9" onClick={() => setDrawer(false)}><X size={18} /></button>
            </div>
            <Filters categories={categories} brands={brands} priceMax={priceMax} onDone={() => setDrawer(false)} />
          </div>
        </div>
      )}
    </>
  );
}
