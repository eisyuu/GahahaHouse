"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
  const defaultCustomer = initialCustomers.find((c) => c.id === defaultCustomerId);
  const [query, setQuery] = useState(defaultCustomer?.companyName ?? "");
  const [selectedId, setSelectedId] = useState(defaultCustomerId ?? "");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.setCustomValidity(
      selectedId ? "" : "リストにある顧客名を入力するか、新しい顧客を登録してください。",
    );
  }, [selectedId]);

  function handleQueryChange(value: string) {
    setQuery(value);
    const match = customers.find((c) => c.companyName === value);
    setSelectedId(match ? match.id : "");
  }

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
        setQuery(customer.companyName);
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
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          list="customer-options"
          placeholder="顧客名を入力して検索"
          autoComplete="off"
          required
          className={inputClass}
        />
        <datalist id="customer-options">
          {customers.map((customer) => (
            <option key={customer.id} value={customer.companyName} />
          ))}
        </datalist>
        <input type="hidden" name="customerId" value={selectedId} />
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
