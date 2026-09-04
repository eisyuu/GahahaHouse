"use client";

import { useState } from "react";
import type { LineItem, TaxRateOption } from "@/lib/types";

interface Row {
  key: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: string;
  taxRate: TaxRateOption;
}

interface Props {
  initialLineItems?: LineItem[];
}

function toRows(lineItems?: LineItem[]): Row[] {
  if (lineItems && lineItems.length > 0) {
    return lineItems.map((item) => ({
      key: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit ?? "",
      unitPrice: String(item.unitPrice),
      taxRate: item.taxRate,
    }));
  }
  return [{ key: crypto.randomUUID(), description: "", quantity: 1, unit: "式", unitPrice: "", taxRate: 10 }];
}

const inputClass = "w-full rounded border border-gray-300 px-2 py-1 text-sm";

function formatYen(value: number): string {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

export function LineItemsEditor({ initialLineItems }: Props) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initialLineItems));

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { key: crypto.randomUUID(), description: "", quantity: 1, unit: "式", unitPrice: "", taxRate: 10 },
    ]);
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== key) : prev));
  }

  const taxableByRate = new Map<TaxRateOption, number>();
  let subtotal = 0;
  for (const row of rows) {
    const amount = Math.round(row.quantity * (Number(row.unitPrice) || 0));
    subtotal += amount;
    taxableByRate.set(row.taxRate, (taxableByRate.get(row.taxRate) ?? 0) + amount);
  }
  let tax = 0;
  for (const [rate, taxableAmount] of taxableByRate) {
    if (rate !== 0) tax += Math.round(taxableAmount * (rate / 100));
  }
  const summary = { subtotal, tax };

  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
            <th className="py-1 pr-2">品目</th>
            <th className="py-1 pr-2 w-20">数量</th>
            <th className="py-1 pr-2 w-20">単位</th>
            <th className="py-1 pr-2 w-28">単価</th>
            <th className="py-1 pr-2 w-24">税率</th>
            <th className="py-1 pr-2 w-28 text-right">金額</th>
            <th className="py-1 w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-gray-100">
              <td className="py-1 pr-2">
                <input
                  name="description"
                  value={row.description}
                  onChange={(e) => updateRow(row.key, { description: e.target.value })}
                  className={inputClass}
                  required
                />
              </td>
              <td className="py-1 pr-2">
                <input
                  name="quantity"
                  type="number"
                  step="any"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.key, { quantity: Number(e.target.value) })}
                  className={inputClass}
                  required
                />
              </td>
              <td className="py-1 pr-2">
                <input
                  name="unit"
                  value={row.unit}
                  onChange={(e) => updateRow(row.key, { unit: e.target.value })}
                  className={inputClass}
                />
              </td>
              <td className="py-1 pr-2">
                <input
                  name="unitPrice"
                  type="number"
                  step="any"
                  placeholder="0"
                  value={row.unitPrice}
                  onChange={(e) => updateRow(row.key, { unitPrice: e.target.value })}
                  className={inputClass}
                  required
                />
              </td>
              <td className="py-1 pr-2">
                <select
                  name="taxRate"
                  value={row.taxRate}
                  onChange={(e) => updateRow(row.key, { taxRate: Number(e.target.value) as TaxRateOption })}
                  className={inputClass}
                >
                  <option value={10}>10%</option>
                  <option value={8}>8%</option>
                  <option value={0}>対象外</option>
                </select>
              </td>
              <td className="py-1 pr-2 text-right">{formatYen(row.quantity * (Number(row.unitPrice) || 0))}</td>
              <td className="py-1 text-center">
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  className="text-gray-400 hover:text-red-600"
                  aria-label="行を削除"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
      >
        + 明細行を追加
      </button>

      <div className="mt-4 flex justify-end">
        <div className="w-64 text-sm">
          <div className="flex justify-between py-1 text-gray-600">
            <span>小計</span>
            <span>{formatYen(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span>消費税</span>
            <span>{formatYen(summary.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-1 font-semibold">
            <span>合計</span>
            <span>{formatYen(summary.subtotal + summary.tax)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
