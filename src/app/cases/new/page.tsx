import Link from "next/link";
import { listCustomers } from "@/lib/db/customers";
import { CaseForm } from "@/components/CaseForm";
import { createCaseAction } from "../actions";

export default async function NewCasePage() {
  const customers = await listCustomers();

  if (customers.length === 0) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">新規案件登録</h1>
        <p className="text-sm text-gray-600">
          先に顧客を登録してください。{" "}
          <Link href="/customers/new" className="text-blue-600 hover:underline">
            顧客登録へ
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">新規案件登録</h1>
      <CaseForm customers={customers} action={createCaseAction} />
    </div>
  );
}
