import { mutateJsonFile, readJsonFile } from "./jsonStore";
import type { Customer } from "@/lib/types";

const FILE = "customers.json";
type Store = { customers: Customer[] };
const DEFAULT: Store = { customers: [] };

export async function listCustomers(): Promise<Customer[]> {
  const store = await readJsonFile(FILE, DEFAULT);
  return [...store.customers].sort((a, b) => a.companyName.localeCompare(b.companyName, "ja"));
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  const store = await readJsonFile(FILE, DEFAULT);
  return store.customers.find((c) => c.id === id);
}

export async function createCustomer(
  input: Omit<Customer, "id" | "createdAt" | "updatedAt">,
): Promise<Customer> {
  const now = new Date().toISOString();
  const customer: Customer = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    customers: [...store.customers, customer],
  }));
  return customer;
}

export async function updateCustomer(
  id: string,
  input: Omit<Customer, "id" | "createdAt" | "updatedAt">,
): Promise<Customer> {
  let updated: Customer | undefined;
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    customers: store.customers.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, ...input, updatedAt: new Date().toISOString() };
      return updated;
    }),
  }));
  if (!updated) throw new Error(`Customer not found: ${id}`);
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await mutateJsonFile(FILE, DEFAULT, (store) => ({
    customers: store.customers.filter((c) => c.id !== id),
  }));
}
