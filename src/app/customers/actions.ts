"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCustomer, deleteCustomer, updateCustomer } from "@/lib/db/customers";
import { listCasesByCustomer } from "@/lib/db/cases";

const schema = z.object({
  companyName: z.string().min(1),
  honorific: z.string().optional(),
  contactName: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().optional(),
  notes: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const str = value?.toString().trim();
  return str ? str : undefined;
}

function parseCustomerForm(formData: FormData) {
  return schema.parse({
    companyName: formData.get("companyName")?.toString().trim(),
    honorific: emptyToUndefined(formData.get("honorific")),
    contactName: emptyToUndefined(formData.get("contactName")),
    postalCode: emptyToUndefined(formData.get("postalCode")),
    address: formData.get("address")?.toString().trim(),
    phone: emptyToUndefined(formData.get("phone")),
    email: emptyToUndefined(formData.get("email")),
    notes: emptyToUndefined(formData.get("notes")),
  });
}

export async function createCustomerAction(formData: FormData): Promise<void> {
  const parsed = parseCustomerForm(formData);
  await createCustomer(parsed);
  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomerAction(id: string, formData: FormData): Promise<void> {
  const parsed = parseCustomerForm(formData);
  await updateCustomer(id, parsed);
  revalidatePath("/customers");
  redirect("/customers");
}

export async function deleteCustomerAction(id: string): Promise<void> {
  const relatedCases = await listCasesByCustomer(id);
  if (relatedCases.length > 0) {
    throw new Error("この顧客は案件に紐づいているため削除できません。");
  }
  await deleteCustomer(id);
  revalidatePath("/customers");
  redirect("/customers");
}
