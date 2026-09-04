import type { LineItem, TaxRateOption, TaxSummary } from "@/lib/types";

const RATE_ORDER: TaxRateOption[] = [10, 8, 0];

export function computeTaxSummary(lineItems: LineItem[]): TaxSummary {
  const byRate = RATE_ORDER.map((rate) => {
    const taxableAmount = lineItems
      .filter((item) => item.taxRate === rate)
      .reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = rate === 0 ? 0 : Math.round(taxableAmount * (rate / 100));
    return { rate, taxableAmount, taxAmount };
  }).filter((group) => group.taxableAmount > 0);

  const subtotal = byRate.reduce((sum, group) => sum + group.taxableAmount, 0);
  const taxTotal = byRate.reduce((sum, group) => sum + group.taxAmount, 0);

  return { byRate, subtotal, taxTotal, total: subtotal + taxTotal };
}
