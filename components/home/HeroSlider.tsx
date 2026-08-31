"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type Slide = {
  id: number;
  heading: string;
  description: string;
  image: string;
  btn1Label: string | null;
  btn1Link: string | null;
  btn2Label: string | null;
  btn2Link: string | null;
};

const AUTOPLAY_MS = 5000;

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const touchX = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Autoplay (infinite loop), paused while the tab is hidden.
  useEffect(() => {
    if (count <= 1) return;
    const start = () => { timer.current = setInterval(next, AUTOPLAY_MS); };
    const stop = () => { if (timer.current) clearInterval(timer.current); };
    start();
    const onVis = () => (document.hidden ? stop() : (stop(), start()));
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [count, next]);

  const pause = () => { if (timer.current) clearInterval(timer.current); };
  const resume = () => { if (count > 1) { if (timer.current) clearInterval(timer.current); timer.current = setInterval(next, AUTOPLAY_MS); } };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; pause(); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    touchX.current = null;
    resume();
  };

  if (count === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-primary select-none"
      onMouseEnter={pause} onMouseLeave={resume}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Track */}
      <div className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={s.id} className="relative w-full shrink-0" aria-hidden={i !== index} aria-roledescription="slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.heading} loading={i === 0 ? "eager" : "lazy"} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
            <div className="relative container-tt flex items-center min-h-[420px] md:min-h-[520px] py-16">
              <div className="max-w-xl text-white">
                <h1 className={`text-3xl md:text-5xl font-extrabold leading-tight transition-all duration-700 ${i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{s.heading}</h1>
                <p className={`mt-4 text-slate-200 text-base md:text-lg leading-relaxed transition-all duration-700 delay-100 ${i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{s.description}</p>
                <div className={`mt-7 flex flex-wrap gap-3 transition-all duration-700 delay-200 ${i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  {s.btn1Label && s.btn1Link && <Link href={s.btn1Link} className="btn btn-primary !px-6 !py-3">{s.btn1Label} <ArrowRight size={18} /></Link>}
                  {s.btn2Label && s.btn2Link && <Link href={s.btn2Link} className="btn !bg-white/10 !text-white !border-white/20 !px-6 !py-3 hover:!bg-white/20">{s.btn2Label}</Link>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Arrows */}
          <button onClick={prev} aria-label="Previous slide" className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white transition"><ChevronLeft size={22} /></button>
          <button onClick={next} aria-label="Next slide" className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white transition"><ChevronRight size={22} /></button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-accent" : "w-2.5 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
