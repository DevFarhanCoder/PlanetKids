import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function calculateDiscount(
  price: number,
  compareAtPrice: number,
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PK${year}${month}${day}${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getAgeGroupLabel(ageGroup: string): string {
  const labels: Record<string, string> = {
    ZERO_TO_ONE: "0-2 Years",
    ONE_TO_TWO: "1-2 Years",
    TWO_TO_FOUR: "3-5 Years",
    FOUR_TO_SIX: "4-6 Years",
    SIX_TO_EIGHT: "6-8 Years",
    EIGHT_PLUS: "9-12 Years",
    EIGHT_PLUS_TEENS: "12+ Years",
  };
  return labels[ageGroup] || ageGroup;
}

// Parse ageGroup stored as JSON array and return array of labels
export function getAgeGroupLabels(ageGroup: string | null): string[] {
  if (!ageGroup) return [];
  try {
    const arr = JSON.parse(ageGroup);
    if (Array.isArray(arr)) return arr.map(getAgeGroupLabel);
  } catch {}
  return [getAgeGroupLabel(ageGroup)];
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
