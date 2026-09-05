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

export function buildDocumentBlobPath(
  docType: DocType,
  year: number,
  documentNumber: string,
  customerName: string,
): { fileName: string; pathname: string } {
  const fileName = buildDocumentFileName(docType, documentNumber, customerName);
  const pathname = `${docTypeLabel(docType)}/${year}/${fileName}`;
  return { fileName, pathname };
}
