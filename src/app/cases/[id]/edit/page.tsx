import { notFound } from "next/navigation";
import { getCase } from "@/lib/db/cases";
import { listCustomers } from "@/lib/db/customers";
import { CaseForm } from "@/components/CaseForm";
import { updateCaseAction } from "../../actions";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [caseRecord, customers] = await Promise.all([getCase(id), listCustomers()]);
  if (!caseRecord) notFound();

  const boundUpdate = updateCaseAction.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">案件編集</h1>
      <CaseForm caseRecord={caseRecord} customers={customers} action={boundUpdate} />
    </div>
  );
}
