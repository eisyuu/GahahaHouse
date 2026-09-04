import { CustomerForm } from "@/components/CustomerForm";
import { createCustomerAction } from "../actions";

export default function NewCustomerPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-6">新規顧客登録</h1>
      <CustomerForm action={createCustomerAction} />
    </div>
  );
}
