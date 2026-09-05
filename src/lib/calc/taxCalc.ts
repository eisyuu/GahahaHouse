import type { LineItem, TaxRateOption, TaxRateSummary, TaxSummary } from "@/lib/types";

const RATE_ORDER: TaxRateOption[] = [10, 8, 0];

export function computeTaxSummary(lineItems: LineItem[]): TaxSummary {
  const groups = RATE_ORDER.map((rate) => {
    const taxableAmount = lineItems
      .filter((item) => item.taxRate === rate)
      .reduce((sum, item) => sum + item.amount, 0);
    const exactTax = rate === 0 ? 0 : taxableAmount * (rate / 100);
    return { rate, taxableAmount, exactTax };
  }).filter((group) => group.taxableAmount > 0);

  const subtotal = groups.reduce((sum, group) => sum + group.taxableAmount, 0);
  const taxableGroups = groups.filter((group) => group.rate !== 0);

  // 合計金額が10円単位になるよう切り捨て、その差額を消費税額とする
  let total = subtotal;
  let taxTotal = 0;
  if (taxableGroups.length > 0) {
    const exactTaxSum = taxableGroups.reduce((sum, group) => sum + group.exactTax, 0);
    total = Math.floor((subtotal + exactTaxSum) / 10) * 10;
    taxTotal = total - subtotal;
  }

  const exactTaxSum = taxableGroups.reduce((sum, group) => sum + group.exactTax, 0);
  const taxByRate = new Map<TaxRateOption, number>();
  let allocated = 0;
  taxableGroups.forEach((group, index) => {
    const isLast = index === taxableGroups.length - 1;
    const share = isLast
      ? taxTotal - allocated
      : Math.round(exactTaxSum === 0 ? 0 : (group.exactTax / exactTaxSum) * taxTotal);
    allocated += share;
    taxByRate.set(group.rate, share);
  });

  const byRate: TaxRateSummary[] = groups.map((group) => ({
    rate: group.rate,
    taxableAmount: group.taxableAmount,
    taxAmount: taxByRate.get(group.rate) ?? 0,
  }));

  return { byRate, subtotal, taxTotal, total };
}
