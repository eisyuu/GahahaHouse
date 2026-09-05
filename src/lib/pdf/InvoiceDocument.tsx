import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { CaseRecord, CompanyProfile, Customer, TaxSummary } from "@/lib/types";
import { styles } from "./styles";
import { formatJapaneseDate, formatYen } from "./format";
import { ensureFontsRegistered } from "./fonts";

ensureFontsRegistered();

interface Props {
  caseRecord: CaseRecord;
  customer: Customer;
  company: CompanyProfile;
  taxSummary: TaxSummary;
  documentNumber: string;
}

export function InvoiceDocument({ caseRecord, customer, company, taxSummary, documentNumber }: Props) {
  const hasBankInfo = company.bankName && company.bankAccountNumber;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>請求書</Text>

        <View style={styles.headerRow}>
          <View style={styles.addresseeBlock}>
            <Text style={styles.addresseeName}>
              {customer.companyName} {customer.honorific ?? "御中"}
            </Text>
            {customer.contactName ? <Text style={styles.metaLine}>{customer.contactName} 様</Text> : null}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLine}>請求書番号: {documentNumber}</Text>
            <Text style={styles.metaLine}>発行日: {formatJapaneseDate(caseRecord.issueDate)}</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={{ width: "55%" }}>
            <Text style={styles.titleLine}>件名: {caseRecord.title}</Text>
            {caseRecord.dueDate ? (
              <Text style={styles.subLine}>お支払期限: {formatJapaneseDate(caseRecord.dueDate)}</Text>
            ) : null}
          </View>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{company.companyName}</Text>
            {company.representativeName ? (
              <Text style={styles.companyLine}>{company.representativeName}</Text>
            ) : null}
            {company.postalCode ? <Text style={styles.companyLine}>〒{company.postalCode}</Text> : null}
            <Text style={styles.companyLine}>{company.address}</Text>
            {company.phone ? <Text style={styles.companyLine}>TEL: {company.phone}</Text> : null}
            {company.email ? <Text style={styles.companyLine}>{company.email}</Text> : null}
            {company.invoiceRegistrationNumber ? (
              <Text style={styles.companyLine}>登録番号: {company.invoiceRegistrationNumber}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>ご請求金額</Text>
          <Text style={styles.amountValue}>{formatYen(taxSummary.total)}（税込）</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, styles.colDescription]}>品目</Text>
            <Text style={[styles.tableCellHeader, styles.colQuantity]}>数量</Text>
            <Text style={[styles.tableCellHeader, styles.colUnit]}>単位</Text>
            <Text style={[styles.tableCellHeader, styles.colUnitPrice]}>単価</Text>
            <Text style={[styles.tableCellHeader, styles.colTaxRate]}>税率</Text>
            <Text style={[styles.tableCellHeader, styles.colAmount]}>金額</Text>
          </View>
          {caseRecord.lineItems.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.colQuantity]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colUnit]}>{item.unit ?? ""}</Text>
              <Text style={[styles.tableCell, styles.colUnitPrice]}>{formatYen(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.colTaxRate]}>
                {item.taxRate === 0 ? "対象外" : `${item.taxRate}%`}
              </Text>
              <Text style={[styles.tableCell, styles.colAmount]}>{formatYen(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryTable}>
            {taxSummary.byRate.map((group) => (
              <View style={styles.summaryRow} key={group.rate}>
                <Text style={styles.summaryLabel}>
                  小計（{group.rate === 0 ? "対象外" : `${group.rate}%対象`}）
                </Text>
                <Text style={styles.summaryValue}>{formatYen(group.taxableAmount)}</Text>
              </View>
            ))}
            {taxSummary.byRate
              .filter((g) => g.rate !== 0)
              .map((group) => (
                <View style={styles.summaryRow} key={`tax-${group.rate}`}>
                  <Text style={styles.summaryLabel}>消費税（{group.rate}%）</Text>
                  <Text style={styles.summaryValue}>{formatYen(group.taxAmount)}</Text>
                </View>
              ))}
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>合計金額</Text>
              <Text style={styles.summaryTotalValue}>{formatYen(taxSummary.total)}</Text>
            </View>
          </View>
        </View>

        {hasBankInfo ? (
          <View style={styles.section}>
            <Text style={styles.sectionBody}>
              請求明細をご確認の上、お振込期日までに下記口座へお振込みをお願い致します。
              {"\n"}
              尚、お振込手数料は御社ご負担にてお願い致します。
            </Text>
            <Text style={styles.sectionTitle}>お振込先</Text>
            <Text style={styles.sectionBody}>
              {company.bankName} {company.bankBranch ? `${company.bankBranch}支店` : ""}
              {"\n"}
              {company.bankAccountType ?? "普通"} {company.bankAccountNumber}
              {"\n"}
              {company.bankAccountHolder ?? ""}
            </Text>
          </View>
        ) : null}

        {caseRecord.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>備考</Text>
            <Text style={styles.sectionBody}>{caseRecord.notes}</Text>
          </View>
        ) : null}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
