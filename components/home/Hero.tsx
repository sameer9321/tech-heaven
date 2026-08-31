import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Headphones, Cpu } from "lucide-react";
import { catHref } from "@/lib/catalog";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-tt relative grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center py-16 lg:py-24">
        <div className="animate-fade-up">
          <span className="eyebrow !bg-white/10 !text-amber-300">⚡ Pakistan's premium tech store</span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
            Power your ambition with <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">next-gen technology.</span>
          </h1>
          <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl">
            Gaming laptops, MacBooks, desktops and pro accessories — genuine products, transparent specs, expert guidance and fast nationwide delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-primary !px-6 !py-3.5">Shop Now <ArrowRight size={18} /></Link>
            <Link href={catHref("Gaming Laptops")} className="btn !bg-white/10 !text-white !border-white/20 !px-6 !py-3.5 hover:!bg-white/20">Explore Gaming</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Truck size={17} className="text-accent" /> Free delivery over Rs. 100k</span>
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-accent" /> Genuine warranty</span>
            <span className="flex items-center gap-2"><Headphones size={17} className="text-accent" /> Expert support</span>
          </div>
        </div>

        {/* hero visual card */}
        <div className="relative animate-fade-up [animation-delay:.12s]">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>FEATURED BUILD</span>
              <span className="chip !bg-accent/20 !text-amber-300">Top rated</span>
            </div>
            <div className="mt-4 aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 grid place-items-center">
              <Cpu size={96} className="text-secondary/70 animate-float" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[["RTX", "Graphics"], ["240Hz", "Displays"], ["DDR5", "Memory"]].map(([a, b]) => (
                <div key={a} className="rounded-xl bg-white/5 py-3">
                  <b className="block text-white text-lg">{a}</b>
                  <span className="text-[11px] text-slate-400">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden sm:block rounded-2xl bg-white text-primary px-4 py-3 shadow-xl">
            <b className="block text-sm">4.9★ rating</b>
            <span className="text-xs text-muted">12,000+ happy customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
