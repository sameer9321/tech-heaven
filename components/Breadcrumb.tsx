import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
      <Link href="/" className="flex items-center gap-1 hover:text-secondary transition"><Home size={14} /> Home</Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-slate-300" />
          {it.href && i < items.length - 1 ? (
            <Link href={it.href} className="hover:text-secondary transition">{it.label}</Link>
          ) : (
            <span className="text-primary font-medium">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
