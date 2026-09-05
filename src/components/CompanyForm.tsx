"use client";

import { useActionState } from "react";
import type { CompanyProfile } from "@/lib/types";
import type { CompanyActionState } from "@/app/company/actions";

interface Props {
  company: CompanyProfile | null;
  action: (prevState: CompanyActionState, formData: FormData) => Promise<CompanyActionState>;
}

const initialState: CompanyActionState = { status: "idle" };

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const sectionTitle = "text-base font-semibold text-gray-900 mt-6 mb-2 first:mt-0";

export function CompanyForm({ company, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <h2 className={sectionTitle}>基本情報</h2>
      <div>
        <label className={labelClass}>会社名 *</label>
        <input name="companyName" defaultValue={company?.companyName} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>代表者名</label>
        <input
          name="representativeName"
          defaultValue={company?.representativeName}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>郵便番号</label>
        <input name="postalCode" defaultValue={company?.postalCode} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>住所 *</label>
        <input name="address" defaultValue={company?.address} required className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>電話番号</label>
          <input name="phone" defaultValue={company?.phone} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>メールアドレス</label>
          <input name="email" type="email" defaultValue={company?.email} className={inputClass} />
        </div>
      </div>

      <h2 className={sectionTitle}>インボイス制度</h2>
      <div>
        <label className={labelClass}>適格請求書発行事業者登録番号（T+13桁）</label>
        <input
          name="invoiceRegistrationNumber"
          defaultValue={company?.invoiceRegistrationNumber}
          placeholder="T1234567890123"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">請求書の発行にはこの番号の入力が必須です。</p>
      </div>

      <h2 className={sectionTitle}>振込先（請求書に記載）</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>銀行名</label>
          <input name="bankName" defaultValue={company?.bankName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>支店名</label>
          <input name="bankBranch" defaultValue={company?.bankBranch} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>口座種別</label>
          <select
            name="bankAccountType"
            defaultValue={company?.bankAccountType ?? "普通"}
            className={inputClass}
          >
            <option value="普通">普通</option>
            <option value="当座">当座</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>口座番号</label>
          <input
            name="bankAccountNumber"
            defaultValue={company?.bankAccountNumber}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>口座名義</label>
        <input
          name="bankAccountHolder"
          defaultValue={company?.bankAccountHolder}
          className={inputClass}
        />
      </div>

      {state.status === "success" && (
        <p className="text-sm text-green-700">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-red-700">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {isPending ? "保存中…" : "保存する"}
      </button>
    </form>
  );
}
