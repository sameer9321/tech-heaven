"use client";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import { specsToList } from "@/lib/utils";

const SAMPLE_REVIEWS = [
  { n: "Hamza A.", r: 5, t: "Exactly as described, genuine unit. Fast delivery and great packaging." },
  { n: "Ayesha S.", r: 5, t: "Superb performance for the price. TurboTech support helped me pick the right config." },
  { n: "Usman T.", r: 4, t: "Very happy overall. Delivery took 3 days to my city but worth the wait." },
];

export default function ProductTabs({ description, specs }: { description: string; specs: string }) {
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const specList = specsToList(specs);
  const tabs = [
    { k: "desc", l: "Description" },
    { k: "specs", l: "Specifications" },
    { k: "reviews", l: `Reviews (${SAMPLE_REVIEWS.length})` },
  ] as const;

  return (
    <div className="card overflow-hidden">
      <div className="flex border-b border-line overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${tab === t.k ? "border-secondary text-secondary" : "border-transparent text-muted hover:text-primary"}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {tab === "desc" && <p className="text-slate-700 leading-relaxed whitespace-pre-line">{description}</p>}

        {tab === "specs" && (
          <ul className="grid sm:grid-cols-2 gap-3">
            {specList.map((sp) => (
              <li key={sp} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg border border-line">
                <Check size={16} className="text-emerald-500 shrink-0" /> <span className="text-sm">{sp}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-primary">4.8</div>
                <div className="flex gap-0.5 text-amber-500 justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}</div>
                <div className="text-xs text-muted mt-1">Based on {SAMPLE_REVIEWS.length} reviews</div>
              </div>
              <div className="flex-1 min-w-[200px] space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-3">{star}</span><Star size={11} className="fill-current text-amber-500" />
                    <span className="flex-1 h-2 rounded-full bg-bg overflow-hidden"><span className="block h-full bg-amber-400" style={{ width: star >= 4 ? `${star * 18}%` : "6%" }} /></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {SAMPLE_REVIEWS.map((rv) => (
                <div key={rv.n} className="border-t border-line pt-4">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-white text-sm font-semibold">{rv.n[0]}</span>
                    <div>
                      <b className="text-sm">{rv.n}</b>
                      <div className="flex gap-0.5 text-amber-500">{Array.from({ length: rv.r }).map((_, i) => <Star key={i} size={12} className="fill-current" />)}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{rv.t}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
