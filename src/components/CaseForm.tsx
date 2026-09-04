import type { CaseRecord, Customer } from "@/lib/types";
import { LineItemsEditor } from "./LineItemsEditor";

interface Props {
  caseRecord?: CaseRecord;
  customers: Customer[];
  action: (formData: FormData) => void;
}

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CaseForm({ caseRecord, customers, action }: Props) {
  return (
    <form action={action} className="space-y-4 max-w-3xl">
      <div>
        <label className={labelClass}>顧客 *</label>
        <select
          name="customerId"
          defaultValue={caseRecord?.customerId ?? ""}
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
      </div>

      <div>
        <label className={labelClass}>件名 *</label>
        <input name="title" defaultValue={caseRecord?.title} required className={inputClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>発行日 *</label>
          <input
            type="date"
            name="issueDate"
            defaultValue={caseRecord?.issueDate ?? todayIso()}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>見積有効期限</label>
          <input
            type="date"
            name="validUntilDate"
            defaultValue={caseRecord?.validUntilDate}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>支払期限</label>
          <input type="date" name="dueDate" defaultValue={caseRecord?.dueDate} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>明細</label>
        <LineItemsEditor initialLineItems={caseRecord?.lineItems} />
      </div>

      <div>
        <label className={labelClass}>備考</label>
        <textarea name="notes" defaultValue={caseRecord?.notes} rows={3} className={inputClass} />
      </div>

      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        {caseRecord ? "更新する" : "登録する"}
      </button>
    </form>
  );
}
