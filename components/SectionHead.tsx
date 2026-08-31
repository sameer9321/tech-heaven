import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHead({ title, subtitle, href, linkLabel = "View all" }: { title: string; subtitle?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <h2 className="section-title text-primary">{title}</h2>
        {subtitle && <p className="mt-1.5 text-muted text-[15px]">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-secondary shrink-0 whitespace-nowrap">
          {linkLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
