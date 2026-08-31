// Central catalog config — drives the mega menu, footer and homepage sections.
// Category labels map to the Product.category values stored in the DB.

export type Cat = { label: string; icon: string; blurb: string };

export const CATEGORIES: Cat[] = [
  { label: "Gaming Laptops", icon: "🎮", blurb: "RTX power for competitive play" },
  { label: "Business Laptops", icon: "💼", blurb: "Reliable, secure & portable" },
  { label: "MacBooks", icon: "🍎", blurb: "Apple silicon performance" },
  { label: "Laptops", icon: "💻", blurb: "Everyday & student picks" },
  { label: "Desktop Computers", icon: "🖥️", blurb: "Custom desktop PCs & rigs" },
  { label: "Gaming Accessories", icon: "🕹️", blurb: "Keyboards, mice & headsets" },
  { label: "Networking", icon: "📡", blurb: "Routers, mesh & switches" },
  { label: "Storage", icon: "💾", blurb: "SSDs, NVMe & external drives" },
  { label: "Accessories", icon: "⌨️", blurb: "Docks, cables & essentials" },
  { label: "Tablets", icon: "📱", blurb: "iPads & Android tablets" },
];

// Grouped for the mega menu columns.
export const MEGA_MENU: { title: string; items: Cat[] }[] = [
  { title: "Laptops", items: CATEGORIES.filter((c) => ["Gaming Laptops", "Business Laptops", "MacBooks", "Laptops"].includes(c.label)) },
  { title: "Computers", items: CATEGORIES.filter((c) => ["Desktop Computers", "Tablets"].includes(c.label)) },
  { title: "Accessories & More", items: CATEGORIES.filter((c) => ["Gaming Accessories", "Accessories", "Networking", "Storage"].includes(c.label)) },
];

export const BRANDS = ["ASUS", "Apple", "Dell", "HP", "Lenovo", "Acer", "MSI", "Logitech"];

export const POPULAR_SEARCHES = ["Gaming Laptop", "MacBook Air", "RTX", "ThinkPad", "SSD", "Ryzen 7"];

export const catHref = (label: string) => `/products?category=${encodeURIComponent(label)}`;
export const searchHref = (q: string) => `/products?q=${encodeURIComponent(q)}`;
