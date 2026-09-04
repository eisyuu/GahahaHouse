import Link from "next/link";
import type { Customer } from "@/lib/types";

interface Props {
  customers: Customer[];
}

export function CustomerTable({ customers }: Props) {
  if (customers.length === 0) {
    return <p className="text-sm text-gray-500">顧客がまだ登録されていません。</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
          <th className="py-2 pr-2">会社名</th>
          <th className="py-2 pr-2">担当者</th>
          <th className="py-2 pr-2">電話番号</th>
          <th className="py-2 pr-2">メールアドレス</th>
          <th className="py-2 w-16" />
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2 pr-2">{customer.companyName}</td>
            <td className="py-2 pr-2">{customer.contactName ?? ""}</td>
            <td className="py-2 pr-2">{customer.phone ?? ""}</td>
            <td className="py-2 pr-2">{customer.email ?? ""}</td>
            <td className="py-2">
              <Link href={`/customers/${customer.id}/edit`} className="text-blue-600 hover:underline">
                編集
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
