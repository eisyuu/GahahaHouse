import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase } from "@/lib/db/cases";
import { getCustomer } from "@/lib/db/customers";
import { getCompanyProfile } from "@/lib/db/company";
import { computeTaxSummary } from "@/lib/calc/taxCalc";
import { deleteCaseAction } from "../actions";

function formatYen(value: number): string {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseRecord = await getCase(id);
  if (!caseRecord) notFound();

  const [customer, company] = await Promise.all([
    getCustomer(caseRecord.customerId),
    getCompanyProfile(),
  ]);

  const taxSummary = computeTaxSummary(caseRecord.lineItems);
  const invoiceReady = Boolean(company?.invoiceRegistrationNumber && company?.bankName && company?.bankAccountNumber);
  const boundDelete = deleteCaseAction.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{caseRecord.title}</h1>
          <p className="text-sm text-gray-500">{customer?.companyName ?? "不明な顧客"}</p>
        </div>
        <Link href={`/cases/${id}/edit`} className="text-sm text-blue-600 hover:underline">
          編集する
        </Link>
      </div>

      {!company && (
        <p className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          会社設定が未登録です。<Link href="/company" className="underline">会社設定</Link>
          を先に入力してください。
        </p>
      )}

      <dl className="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">発行日</dt>
          <dd>{caseRecord.issueDate}</dd>
        </div>
        <div>
          <dt className="text-gray-500">見積有効期限</dt>
          <dd>{caseRecord.validUntilDate ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">支払期限</dt>
          <dd>{caseRecord.dueDate ?? "-"}</dd>
        </div>
      </dl>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
            <th className="py-2 pr-2">品目</th>
            <th className="py-2 pr-2">数量</th>
            <th className="py-2 pr-2">単位</th>
            <th className="py-2 pr-2">単価</th>
            <th className="py-2 pr-2">税率</th>
            <th className="py-2 pr-2 text-right">金額</th>
          </tr>
        </thead>
        <tbody>
          {caseRecord.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2 pr-2">{item.description}</td>
              <td className="py-2 pr-2">{item.quantity}</td>
              <td className="py-2 pr-2">{item.unit ?? ""}</td>
              <td className="py-2 pr-2">{formatYen(item.unitPrice)}</td>
              <td className="py-2 pr-2">{item.taxRate === 0 ? "対象外" : `${item.taxRate}%`}</td>
              <td className="py-2 pr-2 text-right">{formatYen(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-8 flex justify-end">
        <div className="w-64 text-sm">
          {taxSummary.byRate.map((group) => (
            <div key={group.rate} className="flex justify-between py-1 text-gray-600">
              <span>小計（{group.rate === 0 ? "対象外" : `${group.rate}%対象`}）</span>
              <span>{formatYen(group.taxableAmount)}</span>
            </div>
          ))}
          {taxSummary.byRate
            .filter((g) => g.rate !== 0)
            .map((group) => (
              <div key={`tax-${group.rate}`} className="flex justify-between py-1 text-gray-600">
                <span>消費税（{group.rate}%）</span>
                <span>{formatYen(group.taxAmount)}</span>
              </div>
            ))}
          <div className="flex justify-between border-t border-gray-300 py-1 font-semibold">
            <span>合計</span>
            <span>{formatYen(taxSummary.total)}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-4">
        <form method="POST" action={`/api/cases/${id}/quotation`}>
          <button
            type="submit"
            disabled={!company}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
          >
            見積書を作成{caseRecord.quotationMeta ? `（No. ${caseRecord.quotationMeta.documentNumber}）` : ""}
          </button>
        </form>
        <form method="POST" action={`/api/cases/${id}/invoice`}>
          <button
            type="submit"
            disabled={!invoiceReady}
            title={invoiceReady ? undefined : "会社設定に登録番号・振込先を入力してください"}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
          >
            請求書を作成{caseRecord.invoiceMeta ? `（No. ${caseRecord.invoiceMeta.documentNumber}）` : ""}
          </button>
        </form>
      </div>

      {caseRecord.notes && (
        <div className="mb-8">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">備考</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-600">{caseRecord.notes}</p>
        </div>
      )}

      <form action={boundDelete}>
        <button type="submit" className="text-sm text-red-600 hover:underline">
          この案件を削除する
        </button>
      </form>
    </div>
  );
}
