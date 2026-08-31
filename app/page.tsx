import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import Hero from "@/components/home/Hero";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryStrip from "@/components/home/CategoryStrip";
import { BrandLogos, WhyChoose, Reviews } from "@/components/home/Extras";
import NewsletterForm from "@/components/NewsletterForm";
import { ArrowRight } from "lucide-react";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, newArrivals, offers, best, slides] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { NOT: { oldPrice: null } }, take: 3, orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ take: 4, orderBy: { price: "desc" } }),
    prisma.slide.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "TurboTech",
    description: "Premium electronics store in Pakistan — gaming laptops, MacBooks, desktops & accessories.",
    url: "https://turbotech.pk",
    telephone: "+92-300-1234567",
    address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        {slides.length > 0 ? <HeroSlider slides={slides} /> : <Hero />}

        {/* Featured categories */}
        <section className="section-pad">
          <div className="container-tt">
            <Reveal><SectionHead title="Shop by category" subtitle="Find the right device without the guesswork." href="/products" /></Reveal>
            <Reveal delay={80}><CategoryStrip /></Reveal>
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="section-pad pt-0">
            <div className="container-tt">
              <Reveal><SectionHead title="Featured products" subtitle="Hand-picked for performance and value." href="/products" /></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {featured.map((p, i) => <Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>)}
              </div>
            </div>
          </section>
        )}

        {/* Special offers banner */}
        {offers.length > 0 && (
          <section className="pb-16">
            <div className="container-tt">
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 md:p-12">
                  <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
                  <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
                    <div>
                      <span className="eyebrow !bg-accent/20 !text-amber-300">🔥 Special offers</span>
                      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">Save big on this week's <span className="text-accent">hot deals.</span></h2>
                      <p className="mt-3 text-slate-300">Limited-time prices on selected laptops and accessories. Grab them before they're gone.</p>
                      <Link href="/products" className="btn btn-accent mt-6 !px-6 !py-3">Shop all deals <ArrowRight size={18} /></Link>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {offers.map((p) => {
                        const off = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
                        return (
                          <Link key={p.id} href={`/products/${p.slug}`} className="rounded-2xl bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-white/10">
                              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                              {off > 0 && <span className="absolute top-2 left-2 badge-pill badge-sale">-{off}%</span>}
                            </div>
                            <p className="mt-2 text-xs font-medium line-clamp-2 min-h-[32px]">{p.name}</p>
                            <b className="text-accent text-sm">{money(p.price)}</b>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Best sellers */}
        {best.length > 0 && (
          <section className="bg-white section-pad border-y border-line">
            <div className="container-tt">
              <Reveal><SectionHead title="Best sellers" subtitle="Customer favourites flying off the shelves." href="/products" /></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {best.map((p, i) => <Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>)}
              </div>
            </div>
          </section>
        )}

        {/* New arrivals */}
        {newArrivals.length > 0 && (
          <section className="section-pad">
            <div className="container-tt">
              <Reveal><SectionHead title="New arrivals" subtitle="The latest tech, freshly stocked." href="/products" /></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {newArrivals.map((p, i) => <Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>)}
              </div>
            </div>
          </section>
        )}

        {/* Brand logos */}
        <section className="pb-16">
          <div className="container-tt">
            <Reveal><p className="text-center text-sm font-semibold uppercase tracking-wide text-muted mb-6">Trusted brands we carry</p></Reveal>
            <Reveal delay={80}><BrandLogos /></Reveal>
          </div>
        </section>

        {/* Why choose */}
        <section className="bg-white section-pad border-y border-line">
          <div className="container-tt">
            <Reveal><SectionHead title="Why choose TurboTech" subtitle="A premium shopping experience you can trust." /></Reveal>
            <Reveal delay={80}><WhyChoose /></Reveal>
          </div>
        </section>

        {/* Reviews */}
        <section className="section-pad">
          <div className="container-tt">
            <Reveal><SectionHead title="What our customers say" subtitle="Thousands of happy shoppers across Pakistan." /></Reveal>
            <Reveal delay={80}><Reviews /></Reveal>
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-20">
          <div className="container-tt">
            <Reveal>
              <div className="rounded-3xl bg-gradient-to-br from-secondary to-secondary-600 text-white p-8 md:p-12 grid lg:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-3xl font-extrabold">Get the best deals first.</h2>
                  <p className="mt-2 text-blue-100">Subscribe for exclusive offers, new arrivals and expert buying guides.</p>
                </div>
                <div className="lg:justify-self-end w-full max-w-md">
                  <NewsletterForm dark />
                  <p className="mt-2 text-xs text-blue-100">No spam. Unsubscribe anytime.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
