import { promises as fs } from "fs";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import type { CaseRecord, CompanyProfile, Customer, DocType } from "@/lib/types";
import { computeTaxSummary } from "@/lib/calc/taxCalc";
import { getOrCreateDocumentMeta } from "@/lib/numbering/documentNumber";
import { QuotationDocument } from "./QuotationDocument";
import { InvoiceDocument } from "./InvoiceDocument";

export class MissingCompanyFieldError extends Error {
  constructor(public readonly fields: string[]) {
    super(`Company profile is missing required fields: ${fields.join(", ")}`);
  }
}

function assertInvoiceReady(company: CompanyProfile): void {
  const missing: string[] = [];
  if (!company.invoiceRegistrationNumber) missing.push("invoiceRegistrationNumber");
  if (!company.bankName || !company.bankAccountNumber) missing.push("bankAccount");
  if (missing.length > 0) throw new MissingCompanyFieldError(missing);
}

export async function generateDocument(
  docType: DocType,
  caseRecord: CaseRecord,
  customer: Customer,
  company: CompanyProfile,
): Promise<{ buffer: Buffer; fileName: string; absolutePath: string }> {
  if (docType === "invoice") {
    assertInvoiceReady(company);
  }

  const { meta, caseRecord: updatedCase } = await getOrCreateDocumentMeta(
    caseRecord,
    docType,
    customer.companyName,
  );

  const taxSummary = computeTaxSummary(updatedCase.lineItems);
  const Component = docType === "quotation" ? QuotationDocument : InvoiceDocument;

  const buffer = await renderToBuffer(
    <Component
      caseRecord={updatedCase}
      customer={customer}
      company={company}
      taxSummary={taxSummary}
      documentNumber={meta.documentNumber}
    />,
  );

  const absolutePath = path.join(process.cwd(), meta.filePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  return { buffer, fileName: meta.fileName, absolutePath };
}
