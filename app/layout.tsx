import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/store/StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-poppins", display: "swap" });

const siteUrl = "https://turbotech.pk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TurboTech | Premium Laptops, Gaming PCs & Electronics in Pakistan",
    template: "%s | TurboTech",
  },
  description:
    "TurboTech is Pakistan's premium electronics store for gaming laptops, MacBooks, business laptops, desktop PCs, accessories, networking and storage. Genuine products, fast nationwide delivery and expert support.",
  keywords: ["TurboTech", "laptops Pakistan", "gaming laptops", "MacBook", "desktop PC", "electronics store"],
  applicationName: "TurboTech",
  authors: [{ name: "TurboTech" }],
  openGraph: {
    type: "website",
    siteName: "TurboTech",
    title: "TurboTech | Premium Electronics Store",
    description: "Gaming laptops, MacBooks, desktops & accessories with genuine warranty and nationwide delivery.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "TurboTech | Premium Electronics Store",
    description: "Gaming laptops, MacBooks, desktops & accessories with genuine warranty and nationwide delivery.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
