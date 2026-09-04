import Link from "next/link";
import { listCases } from "@/lib/db/cases";
import { listCustomers } from "@/lib/db/customers";
import { CaseTable } from "@/components/CaseTable";

export default async function CasesPage() {
  const [cases, customers] = await Promise.all([listCases(), listCustomers()]);
  const customersById = new Map(customers.map((c) => [c.id, c]));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">案件一覧</h1>
        <Link
          href="/cases/new"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + 新規案件
        </Link>
      </div>
      <CaseTable cases={cases} customersById={customersById} />
    </div>
  );
}
