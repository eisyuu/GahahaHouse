export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCase } from "@/lib/db/cases";
import { getCustomer } from "@/lib/db/customers";
import { getCompanyProfile } from "@/lib/db/company";
import { generateDocument, MissingCompanyFieldError } from "@/lib/pdf/generate";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const caseRecord = await getCase(id);
  if (!caseRecord) {
    return NextResponse.json({ error: "案件が見つかりません。" }, { status: 404 });
  }

  const customer = await getCustomer(caseRecord.customerId);
  if (!customer) {
    return NextResponse.json({ error: "顧客が見つかりません。" }, { status: 404 });
  }

  const company = await getCompanyProfile();
  if (!company) {
    return NextResponse.json({ error: "会社設定が未登録です。先に会社設定を入力してください。" }, { status: 400 });
  }

  try {
    const { buffer, fileName } = await generateDocument("invoice", caseRecord, customer, company);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (error) {
    if (error instanceof MissingCompanyFieldError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
