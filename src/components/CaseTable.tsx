import Link from "next/link";
import type { CaseRecord, Customer } from "@/lib/types";

interface Props {
  cases: CaseRecord[];
  customersById: Map<string, Customer>;
}

export function CaseTable({ cases, customersById }: Props) {
  if (cases.length === 0) {
    return <p className="text-sm text-gray-500">案件がまだ登録されていません。</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
          <th className="py-2 pr-2">発行日</th>
          <th className="py-2 pr-2">顧客</th>
          <th className="py-2 pr-2">件名</th>
          <th className="py-2 pr-2">見積書</th>
          <th className="py-2 pr-2">請求書</th>
          <th className="py-2 w-16" />
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 pr-2">{c.issueDate}</td>
            <td className="py-2 pr-2">{customersById.get(c.customerId)?.companyName ?? "不明"}</td>
            <td className="py-2 pr-2">{c.title}</td>
            <td className="py-2 pr-2">{c.quotationMeta?.documentNumber ?? "-"}</td>
            <td className="py-2 pr-2">{c.invoiceMeta?.documentNumber ?? "-"}</td>
            <td className="py-2">
              <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                詳細
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
