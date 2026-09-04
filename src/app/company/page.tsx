import { getCompanyProfile } from "@/lib/db/company";
import { CompanyForm } from "@/components/CompanyForm";
import { updateCompanyAction } from "./actions";

export default async function CompanyPage() {
  const company = await getCompanyProfile();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">会社設定</h1>
      <CompanyForm company={company} action={updateCompanyAction} />
    </div>
  );
}
