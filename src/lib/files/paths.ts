import path from "path";
import type { DocType } from "@/lib/types";

const DOC_TYPE_LABEL: Record<DocType, string> = {
  quotation: "見積書",
  invoice: "請求書",
};

export function docTypeLabel(docType: DocType): string {
  return DOC_TYPE_LABEL[docType];
}

export function sanitizeForFileName(value: string): string {
  return value.replace(/[/\\:*?"<>|]/g, "").trim() || "顧客";
}

export function buildDocumentFileName(
  docType: DocType,
  documentNumber: string,
  customerName: string,
): string {
  return `${documentNumber}_${sanitizeForFileName(customerName)}_${docTypeLabel(docType)}.pdf`;
}

export function buildDocumentDir(docType: DocType, year: number): string {
  return path.join(process.cwd(), "documents", docTypeLabel(docType), String(year));
}

export function buildDocumentFilePath(
  docType: DocType,
  year: number,
  documentNumber: string,
  customerName: string,
): { dir: string; fileName: string; absolutePath: string; relativePath: string } {
  const dir = buildDocumentDir(docType, year);
  const fileName = buildDocumentFileName(docType, documentNumber, customerName);
  const absolutePath = path.join(dir, fileName);
  const relativePath = path.relative(process.cwd(), absolutePath);
  return { dir, fileName, absolutePath, relativePath };
}
