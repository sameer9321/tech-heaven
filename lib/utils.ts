export const money = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const specsToList = (specs: string) => specs.split("\n").map(s => s.trim()).filter(Boolean);
