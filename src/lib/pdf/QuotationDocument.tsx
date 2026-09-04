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

export function QuotationDocument({ caseRecord, customer, company, taxSummary, documentNumber }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>見積書</Text>

        <View style={styles.headerRow}>
          <View style={styles.addresseeBlock}>
            <Text style={styles.addresseeName}>
              {customer.companyName} {customer.honorific ?? "御中"}
            </Text>
            {customer.contactName ? <Text style={styles.metaLine}>{customer.contactName} 様</Text> : null}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLine}>見積書番号: {documentNumber}</Text>
            <Text style={styles.metaLine}>発行日: {formatJapaneseDate(caseRecord.issueDate)}</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={{ width: "55%" }}>
            <Text style={styles.titleLine}>件名: {caseRecord.title}</Text>
            {caseRecord.validUntilDate ? (
              <Text style={styles.subLine}>有効期限: {formatJapaneseDate(caseRecord.validUntilDate)}</Text>
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
          <Text style={styles.amountLabel}>御見積金額</Text>
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
