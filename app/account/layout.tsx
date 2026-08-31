import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/account/Sidebar";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: true } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="bg-bg min-h-[60vh]">
        <div className="container-tt py-8">
          <h1 className="section-title text-primary mb-6">My Account</h1>
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <Sidebar />
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
