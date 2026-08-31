import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-tt py-24 text-center">
        <p className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-primary">Page not found</h1>
        <p className="mt-3 text-muted max-w-md mx-auto">The page you're looking for doesn't exist or may have been moved. Let's get you back on track.</p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn btn-primary"><Home size={18} /> Back to Home</Link>
          <Link href="/products" className="btn"><Search size={18} /> Browse Products</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
