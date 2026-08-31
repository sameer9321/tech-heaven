import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: true } };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main><CheckoutClient /></main>
      <Footer />
    </>
  );
}
