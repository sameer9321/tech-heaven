import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareClient from "@/components/compare/CompareClient";

export const metadata: Metadata = { title: "Compare Products", robots: { index: false, follow: true } };

export default function ComparePage() {
  return (
    <>
      <Header />
      <main><CompareClient /></main>
      <Footer />
    </>
  );
}
