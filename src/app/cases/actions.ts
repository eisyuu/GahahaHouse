"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCase, deleteCase, updateCase } from "@/lib/db/cases";
import type { LineItem, TaxRateOption } from "@/lib/types";

const caseSchema = z.object({
  customerId: z.string().min(1),
  title: z.string().min(1),
  issueDate: z.string().min(1),
  validUntilDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const str = value?.toString().trim();
  return str ? str : undefined;
}

function parseLineItems(formData: FormData): Omit<LineItem, "amount">[] {
  const descriptions = formData.getAll("description").map((v) => v.toString());
  const quantities = formData.getAll("quantity").map((v) => Number(v));
  const units = formData.getAll("unit").map((v) => v.toString());
  const unitPrices = formData.getAll("unitPrice").map((v) => Number(v));
  const taxRates = formData.getAll("taxRate").map((v) => Number(v) as TaxRateOption);

  const items: Omit<LineItem, "amount">[] = [];
  for (let i = 0; i < descriptions.length; i++) {
    if (!descriptions[i]?.trim()) continue;
    items.push({
      id: crypto.randomUUID(),
      description: descriptions[i],
      quantity: quantities[i] ?? 0,
      unit: units[i] || undefined,
      unitPrice: unitPrices[i] ?? 0,
      taxRate: taxRates[i] ?? 10,
    });
  }
  if (items.length === 0) {
    throw new Error("明細を1件以上入力してください。");
  }
  return items;
}

function parseCaseForm(formData: FormData) {
  const base = caseSchema.parse({
    customerId: formData.get("customerId")?.toString(),
    title: formData.get("title")?.toString().trim(),
    issueDate: formData.get("issueDate")?.toString(),
    validUntilDate: emptyToUndefined(formData.get("validUntilDate")),
    dueDate: emptyToUndefined(formData.get("dueDate")),
    notes: emptyToUndefined(formData.get("notes")),
  });
  const lineItems = parseLineItems(formData).map((item) => ({ ...item, amount: 0 }));
  return { ...base, lineItems };
}

export async function createCaseAction(formData: FormData): Promise<void> {
  const parsed = parseCaseForm(formData);
  const record = await createCase(parsed);
  revalidatePath("/cases");
  redirect(`/cases/${record.id}`);
}

export async function updateCaseAction(id: string, formData: FormData): Promise<void> {
  const parsed = parseCaseForm(formData);
  await updateCase(id, parsed);
  revalidatePath("/cases");
  revalidatePath(`/cases/${id}`);
  redirect(`/cases/${id}`);
}

export async function deleteCaseAction(id: string): Promise<void> {
  await deleteCase(id);
  revalidatePath("/cases");
  redirect("/cases");
}
