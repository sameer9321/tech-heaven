import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/checkout", "/cart", "/account"] },
    sitemap: "https://turbotech.pk/sitemap.xml",
  };
}
