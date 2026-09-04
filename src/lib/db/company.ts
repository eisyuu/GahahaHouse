import { readJsonFile, writeJsonFile } from "./jsonStore";
import type { CompanyProfile } from "@/lib/types";

const FILE = "company.json";
const DEFAULT: CompanyProfile | null = null;

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  return readJsonFile(FILE, DEFAULT);
}

export async function saveCompanyProfile(
  input: Omit<CompanyProfile, "updatedAt">,
): Promise<CompanyProfile> {
  const profile: CompanyProfile = { ...input, updatedAt: new Date().toISOString() };
  await writeJsonFile(FILE, profile);
  return profile;
}
