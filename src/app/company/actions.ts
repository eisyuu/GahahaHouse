"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { saveCompanyProfile } from "@/lib/db/company";

const schema = z.object({
  companyName: z.string().min(1),
  representativeName: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().optional(),
  invoiceRegistrationNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  bankAccountType: z.enum(["普通", "当座"]).optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const str = value?.toString().trim();
  return str ? str : undefined;
}

export type CompanyActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateCompanyAction(
  _prevState: CompanyActionState,
  formData: FormData,
): Promise<CompanyActionState> {
  const result = schema.safeParse({
    companyName: formData.get("companyName")?.toString().trim(),
    representativeName: emptyToUndefined(formData.get("representativeName")),
    postalCode: emptyToUndefined(formData.get("postalCode")),
    address: formData.get("address")?.toString().trim(),
    phone: emptyToUndefined(formData.get("phone")),
    email: emptyToUndefined(formData.get("email")),
    invoiceRegistrationNumber: emptyToUndefined(formData.get("invoiceRegistrationNumber")),
    bankName: emptyToUndefined(formData.get("bankName")),
    bankBranch: emptyToUndefined(formData.get("bankBranch")),
    bankAccountType: emptyToUndefined(formData.get("bankAccountType")) as "普通" | "当座" | undefined,
    bankAccountNumber: emptyToUndefined(formData.get("bankAccountNumber")),
    bankAccountHolder: emptyToUndefined(formData.get("bankAccountHolder")),
  });

  if (!result.success) {
    return { status: "error", message: "入力内容を確認してください。" };
  }

  await saveCompanyProfile(result.data);
  revalidatePath("/company");
  revalidatePath("/");
  return { status: "success", message: "保存しました。" };
}
