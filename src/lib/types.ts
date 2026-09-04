export interface Customer {
  id: string;
  companyName: string;
  contactName?: string;
  honorific?: string;
  postalCode?: string;
  address: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  companyName: string;
  representativeName?: string;
  postalCode?: string;
  address: string;
  phone?: string;
  email?: string;
  invoiceRegistrationNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankAccountType?: "普通" | "当座";
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  updatedAt: string;
}

export type TaxRateOption = 10 | 8 | 0;

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  taxRate: TaxRateOption;
  amount: number;
}

export interface DocumentMeta {
  documentNumber: string;
  issuedAt: string;
  filePath: string;
  fileName: string;
}

export interface CaseRecord {
  id: string;
  customerId: string;
  title: string;
  issueDate: string;
  validUntilDate?: string;
  dueDate?: string;
  lineItems: LineItem[];
  notes?: string;
  quotationMeta?: DocumentMeta;
  invoiceMeta?: DocumentMeta;
  createdAt: string;
  updatedAt: string;
}

export type DocType = "quotation" | "invoice";

export type Counters = Record<string, number>;

export interface TaxRateSummary {
  rate: TaxRateOption;
  taxableAmount: number;
  taxAmount: number;
}

export interface TaxSummary {
  byRate: TaxRateSummary[];
  subtotal: number;
  taxTotal: number;
  total: number;
}
