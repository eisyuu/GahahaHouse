import { StyleSheet } from "@react-pdf/renderer";
import { FONT_FAMILY } from "./fonts";

export const styles = StyleSheet.create({
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaBlock: {
    alignItems: "flex-end",
  },
  metaLine: {
    fontSize: 9,
    marginBottom: 2,
  },
  addresseeBlock: {
    width: "55%",
  },
  addresseeName: {
    fontSize: 13,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 4,
    marginBottom: 6,
  },
  companyBlock: {
    width: "40%",
    fontSize: 9,
  },
  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  companyLine: {
    marginBottom: 2,
  },
  titleLine: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subLine: {
    fontSize: 9,
    marginBottom: 12,
  },
  amountBox: {
    borderWidth: 1,
    borderColor: "#1a1a1a",
    padding: 10,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  table: {
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#e8e8e8",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#999999",
    paddingVertical: 4,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 9,
  },
  colDescription: { width: "34%", paddingHorizontal: 4 },
  colQuantity: { width: "10%", paddingHorizontal: 4, textAlign: "right" },
  colUnit: { width: "10%", paddingHorizontal: 4 },
  colUnitPrice: { width: "16%", paddingHorizontal: 4, textAlign: "right" },
  colTaxRate: { width: "10%", paddingHorizontal: 4, textAlign: "right" },
  colAmount: { width: "20%", paddingHorizontal: 4, textAlign: "right" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  summaryTable: {
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderColor: "#cccccc",
  },
  summaryLabel: {
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
    textAlign: "right",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#1a1a1a",
    marginTop: 2,
  },
  summaryTotalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  summaryTotalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
  },
});
