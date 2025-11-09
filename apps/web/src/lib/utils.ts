import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
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

export function copyToClipboard(input: {
  text: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  if (input.text.length === 0) {
    if (input.onError) input.onError();

    toast.error("Teks kosong, tidak dapat disalin");
    return;
  }

  navigator.clipboard.writeText(input.text).then(() => {
    if (input.onSuccess) input.onSuccess();
    toast.success(`Teks "${input.text}" berhasil disalin ke clipboard`);
  });
}
