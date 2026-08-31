// Shared cart/checkout helpers (client-side, no backend).
export const FREE_SHIPPING_THRESHOLD = 100000;
export const FLAT_SHIPPING = 500;

export const COUPONS: Record<string, { pct: number; label: string }> = {
  TURBO10: { pct: 10, label: "10% off" },
  WELCOME5: { pct: 5, label: "5% off" },
};

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
}

export type OrderRecord = {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: string;
  customer: { name: string; phone: string; email: string; city: string; address: string };
};

export function saveOrder(order: OrderRecord) {
  try {
    const raw = localStorage.getItem("tt_orders");
    const list: OrderRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(order);
    localStorage.setItem("tt_orders", JSON.stringify(list.slice(0, 50)));
  } catch { /* ignore */ }
}

export function loadOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem("tt_orders");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
