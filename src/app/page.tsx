import Link from "next/link";
import { getCompanyProfile } from "@/lib/db/company";
import { listCases } from "@/lib/db/cases";
import { listCustomers } from "@/lib/db/customers";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [company, cases, customers] = await Promise.all([
    getCompanyProfile(),
    listCases(),
    listCustomers(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">ダッシュボード</h1>

      {!company && (
        <p className="mb-6 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          まだ会社情報が登録されていません。
          <Link href="/company" className="ml-1 underline">
            会社設定
          </Link>
          から自社情報（登録番号・振込先を含む）を入力してください。
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/cases"
          className="rounded border border-gray-200 p-4 hover:border-gray-400"
        >
          <p className="text-sm text-gray-500">案件</p>
          <p className="text-2xl font-bold">{cases.length}</p>
        </Link>
        <Link
          href="/customers"
          className="rounded border border-gray-200 p-4 hover:border-gray-400"
        >
          <p className="text-sm text-gray-500">顧客</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </Link>
        <Link
          href="/cases/new"
          className="rounded border border-gray-200 p-4 hover:border-gray-400"
        >
          <p className="text-sm text-gray-500">新規作成</p>
          <p className="text-lg font-bold">案件を登録する →</p>
        </Link>
      </div>
    </div>
  );
}
