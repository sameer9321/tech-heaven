import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true } };

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main><WishlistClient /></main>
      <Footer />
    </>
  );
}
