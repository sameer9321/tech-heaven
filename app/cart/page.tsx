import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = { title: "Shopping Cart", robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <>
      <Header />
      <main><CartClient /></main>
      <Footer />
    </>
  );
}
