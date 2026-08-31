# TurboTech — Premium Electronics Store

A modern, premium electronics eCommerce storefront (gaming laptops, MacBooks, desktops, accessories & more) with an original Paklap-inspired UX, built on **Next.js 15 + React 19 + Prisma + Tailwind CSS v4**, with a built-in product admin panel.

## Features
- Premium responsive homepage (hero, categories, featured/best-seller/new-arrival rails, offers, brands, reviews, why-choose, newsletter)
- Sticky header with top bar, mega menu and AJAX search with suggestions & popular searches
- Product listing / category page: sidebar filters (category, brand, price, availability), sorting, grid/list toggle, pagination
- Product detail: gallery with hover-zoom, tabs (description / specifications / reviews), related products, recently viewed, buy now, WhatsApp order
- Cart, coupons & shipping, and a clean checkout (billing, payment methods, order summary) that composes a WhatsApp order
- Client-side (localStorage) **cart, wishlist, compare & order history** — no extra database tables required
- Customer account area: dashboard, orders, addresses, profile, change password
- Admin dashboard: add, edit and delete products (unchanged API, password-protected)
- SEO: metadata, Open Graph, Twitter cards, JSON-LD schema, sitemap.xml & robots.txt
- Loading skeletons, subtle animations, fully responsive

## Tech
- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · Inter + Poppins (next/font)
- Prisma ORM · SQLite (swap for PostgreSQL/MySQL in production)

## Setup
1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run: `npm install`
4. Copy `.env.example` to `.env` (already included for local demo).
5. Run: `npm run setup`  (generates client, pushes schema, seeds demo products)
6. Run: `npm run dev`
7. Open `http://localhost:3000`

## Admin
Open `http://localhost:3000/admin` — default password: `admin123`.
Change `ADMIN_PASSWORD` in `.env` before deploying.

## Customize
- Store name: "TurboTech" (see `components/Logo.tsx` and `app/layout.tsx`)
- Brand colors & fonts: `app/globals.css` (`@theme` tokens)
- Categories / mega menu / popular searches: `lib/catalog.ts`
- Phone / WhatsApp number: `.env` (`NEXT_PUBLIC_WHATSAPP_NUMBER`) and Header/Footer
- Coupons, shipping thresholds: `lib/checkout.ts`
- Product images can be any public image URL (add the host to `next.config.ts` `images.remotePatterns`)

## Deployment
Works on any Node.js host or VPS. For Vercel/serverless, replace SQLite with a hosted PostgreSQL database (e.g. Neon) and change the Prisma datasource provider.
