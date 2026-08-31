import Link from "next/link";
import { CATEGORIES, catHref } from "@/lib/catalog";

export default function CategoryStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {CATEGORIES.slice(0, 10).map((c) => (
        <Link key={c.label} href={catHref(c.label)}
          className="card card-hover group p-5 text-center flex flex-col items-center gap-2.5">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-bg text-2xl group-hover:bg-secondary-50 transition">{c.icon}</span>
          <b className="text-sm font-semibold group-hover:text-secondary transition">{c.label}</b>
          <span className="text-[11px] text-muted leading-tight">{c.blurb}</span>
        </Link>
      ))}
    </div>
  );
}
