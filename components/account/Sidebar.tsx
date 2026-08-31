"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Heart, MapPin, User, KeyRound, GitCompareArrows } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";

const LINKS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/change-password", label: "Change Password", icon: KeyRound },
];

export default function Sidebar() {
  const path = usePathname();
  const { wishCount, compareCount } = useStore();
  const badge: Record<string, number> = { "/wishlist": wishCount, "/compare": compareCount };

  return (
    <nav className="card p-3 lg:sticky lg:top-28 h-fit">
      {LINKS.map((l) => {
        const active = l.exact ? path === l.href : path.startsWith(l.href);
        const Icon = l.icon;
        return (
          <Link key={l.href} href={l.href}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${active ? "bg-secondary text-white" : "text-slate-600 hover:bg-bg"}`}>
            <Icon size={18} /> <span className="flex-1">{l.label}</span>
            {badge[l.href] > 0 && <span className={`text-xs font-bold ${active ? "text-white" : "text-secondary"}`}>{badge[l.href]}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
