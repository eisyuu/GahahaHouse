import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/db/customers";
import { CustomerForm } from "@/components/CustomerForm";
import { updateCustomerAction, deleteCustomerAction } from "../../actions";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const boundUpdate = updateCustomerAction.bind(null, id);
  const boundDelete = deleteCustomerAction.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">顧客編集</h1>
      <CustomerForm customer={customer} action={boundUpdate} />
      <form action={boundDelete} className="mt-6">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          この顧客を削除する
        </button>
      </form>
    </div>
  );
}
