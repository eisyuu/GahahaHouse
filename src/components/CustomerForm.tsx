import type { Customer } from "@/lib/types";

interface Props {
  customer?: Customer;
  action: (formData: FormData) => void;
}

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export function CustomerForm({ customer, action }: Props) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div>
        <label className={labelClass}>会社名・氏名 *</label>
        <input
          name="companyName"
          defaultValue={customer?.companyName}
          required
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>敬称</label>
          <input
            name="honorific"
            defaultValue={customer?.honorific ?? "御中"}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>担当者名</label>
          <input name="contactName" defaultValue={customer?.contactName} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>郵便番号</label>
        <input name="postalCode" defaultValue={customer?.postalCode} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>住所 *</label>
        <input name="address" defaultValue={customer?.address} required className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>電話番号</label>
          <input name="phone" defaultValue={customer?.phone} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>メールアドレス</label>
          <input name="email" type="email" defaultValue={customer?.email} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>備考</label>
        <textarea name="notes" defaultValue={customer?.notes} rows={3} className={inputClass} />
      </div>
      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        {customer ? "更新する" : "登録する"}
      </button>
    </form>
  );
}
