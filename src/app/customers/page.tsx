import Link from "next/link";
import { listCustomers } from "@/lib/db/customers";
import { CustomerTable } from "@/components/CustomerTable";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">顧客一覧</h1>
        <Link
          href="/customers/new"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + 新規顧客
        </Link>
      </div>
      <CustomerTable customers={customers} />
    </div>
  );
}
