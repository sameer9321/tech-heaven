import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, makeHref }: { page: number; totalPages: number; makeHref: (p: number) => string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const items: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - (pages[i - 1] as number) > 1) items.push("…");
    items.push(p);
  });

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <Link href={makeHref(Math.max(1, page - 1))} aria-disabled={page === 1}
        className={`icon-btn !w-10 !h-10 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}><ChevronLeft size={18} /></Link>
      {items.map((it, i) =>
        it === "…" ? <span key={`e${i}`} className="px-2 text-muted">…</span> : (
          <Link key={it} href={makeHref(it)} className={`grid place-items-center w-10 h-10 rounded-xl border text-sm font-medium transition ${it === page ? "bg-secondary text-white border-secondary" : "bg-white border-line hover:border-secondary"}`}>{it}</Link>
        )
      )}
      <Link href={makeHref(Math.min(totalPages, page + 1))} aria-disabled={page === totalPages}
        className={`icon-btn !w-10 !h-10 ${page === totalPages ? "pointer-events-none opacity-40" : ""}`}><ChevronRight size={18} /></Link>
    </nav>
  );
}
