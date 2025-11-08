import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pascalToWords(input: string): string {
  if (!input) {
    return "";
  }

  return input.replace(/([A-Z])/g, " $1").trim();
}

export function formatCurrency(
  value: number,
  style: "decimal" | "currency" | "unit" | "percent" = "currency",
) {
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: style,
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return currencyFormatter.format(value);
}
