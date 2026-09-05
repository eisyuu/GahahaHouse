import { incrementCounter } from "@/lib/db/counters";
import { mutateCase } from "@/lib/db/cases";
import type { CaseRecord, DocType, DocumentMeta } from "@/lib/types";
import { buildDocumentBlobPath } from "@/lib/files/paths";

function metaKey(docType: DocType): "quotationMeta" | "invoiceMeta" {
  return docType === "quotation" ? "quotationMeta" : "invoiceMeta";
}

export async function getOrCreateDocumentMeta(
  caseRecord: CaseRecord,
  docType: DocType,
  customerName: string,
): Promise<{ meta: DocumentMeta; caseRecord: CaseRecord }> {
  const key = metaKey(docType);
  if (caseRecord[key]) {
    return { meta: caseRecord[key], caseRecord };
  }

  const updated = await mutateCase(caseRecord.id, async (current) => {
    if (current[key]) return current;

    const year = new Date(current.issueDate).getFullYear();
    const sequence = await incrementCounter(`${docType}:${year}`);
    const documentNumber = `${year}-${String(sequence).padStart(4, "0")}`;
    const { fileName, pathname } = buildDocumentBlobPath(
      docType,
      year,
      documentNumber,
      customerName,
    );

    const meta: DocumentMeta = {
      documentNumber,
      issuedAt: new Date().toISOString(),
      filePath: pathname,
      fileName,
    };

    return { ...current, [key]: meta, updatedAt: new Date().toISOString() };
  });

  const meta = updated[key];
  if (!meta) throw new Error("Failed to allocate document meta");
  return { meta, caseRecord: updated };
}
