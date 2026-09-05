import { listCustomers } from "@/lib/db/customers";
import { CaseForm } from "@/components/CaseForm";
import { createCaseAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const customers = await listCustomers();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">新規案件登録</h1>
      <CaseForm customers={customers} action={createCaseAction} />
    </div>
  );
}
