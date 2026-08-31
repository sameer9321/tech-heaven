"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, Loader2, Tag } from "lucide-react";
import { POPULAR_SEARCHES, searchHref, catHref } from "@/lib/catalog";
import { money } from "@/lib/utils";

type Sugg = { products: { id: number; name: string; slug: string; brand: string; price: number; image: string }[]; categories: string[] };

export default function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Sugg>({ products: [], categories: [] });
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced AJAX suggestions.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setData({ products: [], categories: [] }); return; }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        setData(await r.json());
      } catch { /* aborted */ } finally { setLoading(false); }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (href: string) => { setOpen(false); onNavigate?.(); router.push(href); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (q.trim()) go(searchHref(q.trim())); };

  const hasResults = data.products.length > 0 || data.categories.length > 0;

  return (
    <div ref={boxRef} className="relative flex-1 min-w-0">
      <form onSubmit={submit} className="flex items-center rounded-xl border-2 border-line bg-white overflow-hidden focus-within:border-secondary transition-colors">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search laptops, brands, accessories…"
          className="w-full px-4 py-3 bg-transparent outline-none text-[15px]"
          aria-label="Search products"
        />
        <button className="grid place-items-center px-5 self-stretch bg-secondary text-white hover:bg-secondary-600 transition-colors" aria-label="Search">
          {loading ? <Loader2 size={19} className="animate-spin" /> : <Search size={19} />}
        </button>
      </form>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-line bg-white shadow-[0_20px_50px_rgba(15,23,42,.16)] overflow-hidden animate-[slideDown_.18s_ease]">
          {q.trim().length < 2 ? (
            <div className="p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wide mb-3"><TrendingUp size={14} /> Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s} onClick={() => go(searchHref(s))} className="chip hover:brightness-95 transition">{s}</button>
                ))}
              </div>
            </div>
          ) : !hasResults && !loading ? (
            <div className="p-6 text-center text-muted text-sm">No matches for “{q}”. Press enter to search all products.</div>
          ) : (
            <div className="max-h-[70vh] overflow-auto">
              {data.categories.length > 0 && (
                <div className="p-2 border-b border-line">
                  {data.categories.map((c) => (
                    <button key={c} onClick={() => go(catHref(c))} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg text-left text-sm">
                      <Tag size={15} className="text-secondary" /> Browse <b>{c}</b>
                    </button>
                  ))}
                </div>
              )}
              <div className="p-2">
                {data.products.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} onClick={() => { setOpen(false); onNavigate?.(); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg">
                    <img src={p.image} alt="" loading="lazy" className="w-11 h-11 rounded-lg object-cover bg-bg shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">{p.name}</span>
                      <span className="block text-xs text-muted">{p.brand}</span>
                    </span>
                    <span className="text-sm font-semibold text-secondary shrink-0">{money(p.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
