"use client";

import { useState, useTransition } from "react";
import type { Customer } from "@/lib/types";
import { createCustomerQuick } from "@/app/customers/actions";

interface Props {
  customers: Customer[];
  defaultCustomerId?: string;
}

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";

export function CustomerSelectField({ customers: initialCustomers, defaultCustomerId }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedId, setSelectedId] = useState(defaultCustomerId ?? "");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleQuickAdd() {
    if (!companyName.trim() || !address.trim()) {
      setError("会社名と住所は必須です。");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const customer = await createCustomerQuick({
          companyName: companyName.trim(),
          address: address.trim(),
          contactName: contactName.trim() || undefined,
        });
        setCustomers((prev) =>
          [...prev, customer].sort((a, b) => a.companyName.localeCompare(b.companyName, "ja")),
        );
        setSelectedId(customer.id);
        setShowQuickAdd(false);
        setCompanyName("");
        setAddress("");
        setContactName("");
      } catch {
        setError("顧客の登録に失敗しました。");
      }
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <select
          name="customerId"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          required
          className={inputClass}
        >
          <option value="" disabled>
            選択してください
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.companyName}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowQuickAdd((v) => !v)}
          className="whitespace-nowrap rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          + 新しい顧客を登録
        </button>
      </div>

      {showQuickAdd && (
        <div className="mt-2 space-y-2 rounded border border-gray-200 bg-gray-50 p-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">会社名 *</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">住所 *</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">担当者名</label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isPending}
              className="rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {isPending ? "登録中..." : "この内容で追加"}
            </button>
            <button
              type="button"
              onClick={() => setShowQuickAdd(false)}
              className="rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
            >
              キャンセル
            </button>
          </div>
          <p className="text-xs text-gray-500">
            郵便番号・電話番号・メールなど詳しい情報は、後から顧客一覧の編集画面で追加できます。
          </p>
        </div>
      )}
    </div>
  );
}
