import { mutateJsonFile, readJsonFile } from "./jsonStore";
import type { CaseRecord, LineItem } from "@/lib/types";

const FILE = "cases.json";
type Store = { cases: CaseRecord[] };
const DEFAULT: Store = { cases: [] };

function recomputeAmounts(lineItems: LineItem[]): LineItem[] {
  return lineItems.map((item) => {
    const unitPrice = Math.round(item.unitPrice);
    return {
      ...item,
      unitPrice,
      amount: Math.round(item.quantity * unitPrice),
    };
  });
}

export async function listCases(): Promise<CaseRecord[]> {
  const store = await readJsonFile(FILE, DEFAULT);
  return [...store.cases].sort((a, b) => b.issueDate.localeCompare(a.issueDate));
}

export async function getCase(id: string): Promise<CaseRecord | undefined> {
  const store = await readJsonFile(FILE, DEFAULT);
  return store.cases.find((c) => c.id === id);
}

export async function listCasesByCustomer(customerId: string): Promise<CaseRecord[]> {
  const store = await readJsonFile(FILE, DEFAULT);
  return store.cases.filter((c) => c.customerId === customerId);
}

export async function createCase(
  input: Omit<
    CaseRecord,
    "id" | "createdAt" | "updatedAt" | "quotationMeta" | "invoiceMeta"
  >,
): Promise<CaseRecord> {
  const now = new Date().toISOString();
  const record: CaseRecord = {
    ...input,
    lineItems: recomputeAmounts(input.lineItems),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    cases: [...store.cases, record],
  }));
  return record;
}

export async function updateCase(
  id: string,
  input: Omit<
    CaseRecord,
    "id" | "createdAt" | "updatedAt" | "quotationMeta" | "invoiceMeta"
  >,
): Promise<CaseRecord> {
  let updated: CaseRecord | undefined;
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    cases: store.cases.map((c) => {
      if (c.id !== id) return c;
      updated = {
        ...c,
        ...input,
        lineItems: recomputeAmounts(input.lineItems),
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }),
  }));
  if (!updated) throw new Error(`Case not found: ${id}`);
  return updated;
}

export async function deleteCase(id: string): Promise<void> {
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    cases: store.cases.filter((c) => c.id !== id),
  }));
}

export async function mutateCase(
  id: string,
  mutator: (current: CaseRecord) => CaseRecord | Promise<CaseRecord>,
): Promise<CaseRecord> {
  let updated: CaseRecord | undefined;
  await mutateJsonFile(FILE, DEFAULT, async (store) => {
    const cases = await Promise.all(
      store.cases.map(async (c) => {
        if (c.id !== id) return c;
        updated = await mutator(c);
        return updated;
      }),
    );
    return { cases };
  });
  if (!updated) throw new Error(`Case not found: ${id}`);
  return updated;
}
