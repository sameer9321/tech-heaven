import { BRANDS } from "@/lib/catalog";
import { ShieldCheck, Truck, BadgeCheck, Headphones, Wallet, RotateCcw, Star } from "lucide-react";

export function BrandLogos() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {BRANDS.map((b) => (
        <div key={b} className="grid place-items-center h-16 rounded-xl border border-line bg-white text-slate-500 font-bold tracking-tight hover:text-primary hover:shadow-soft transition">
          {b}
        </div>
      ))}
    </div>
  );
}

const WHY = [
  { i: <BadgeCheck size={22} />, t: "100% Genuine", s: "Every product is authentic with official warranty." },
  { i: <Truck size={22} />, t: "Fast Delivery", s: "Nationwide shipping with reliable courier partners." },
  { i: <Wallet size={22} />, t: "Flexible Payment", s: "Cash on delivery, bank transfer, Easypaisa & JazzCash." },
  { i: <RotateCcw size={22} />, t: "Easy Returns", s: "Hassle-free 7-day return and replacement policy." },
  { i: <Headphones size={22} />, t: "Expert Support", s: "Real specialists to help you choose the right device." },
  { i: <ShieldCheck size={22} />, t: "Secure Shopping", s: "Your data and orders are handled with care." },
];

export function WhyChoose() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {WHY.map((w) => (
        <div key={w.t} className="card p-6 flex gap-4 hover:shadow-hover hover:-translate-y-1 transition">
          <span className="grid place-items-center w-12 h-12 rounded-xl bg-secondary-50 text-secondary shrink-0">{w.i}</span>
          <div>
            <b className="block text-primary">{w.t}</b>
            <p className="mt-1 text-sm text-muted leading-relaxed">{w.s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const REVIEWS = [
  { n: "Ahmed R.", c: "Karachi", t: "Ordered a gaming laptop and it arrived next day, perfectly packed. Genuine unit and great price!", r: 5 },
  { n: "Sana K.", c: "Lahore", t: "The team helped me pick the right MacBook for design work. Smooth checkout and fast delivery.", r: 5 },
  { n: "Bilal M.", c: "Islamabad", t: "Best specs transparency I've seen on a Pakistani store. Will definitely buy again.", r: 5 },
];

export function Reviews() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {REVIEWS.map((rv) => (
        <figure key={rv.n} className="card p-6">
          <div className="flex gap-0.5 text-amber-500 mb-3">
            {Array.from({ length: rv.r }).map((_, i) => <Star key={i} size={16} className="fill-current" />)}
          </div>
          <blockquote className="text-[15px] leading-relaxed text-slate-700">“{rv.t}”</blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold">{rv.n[0]}</span>
            <span><b className="block text-sm">{rv.n}</b><span className="text-xs text-muted">{rv.c}</span></span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
