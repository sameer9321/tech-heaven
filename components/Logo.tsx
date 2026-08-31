import Link from "next/link";
import { Zap } from "lucide-react";

export default function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="TurboTech home">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-secondary text-white shadow-[0_8px_20px_rgba(37,99,235,.35)]">
        <Zap size={20} className="fill-current" />
      </span>
      <span className={`logo-text text-2xl leading-none ${light ? "text-white" : "text-primary"}`}>
        Turbo<span className="text-secondary">Tech</span>
      </span>
    </Link>
  );
}
