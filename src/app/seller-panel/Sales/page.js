"use client";

import { useMemo, useState } from "react";
import DynamicTable from "@/app/components/DynamicTable";
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Download,
  FileSpreadsheet,
  CalendarRange,
  BadgeIndianRupee,
} from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const salesRegisterRows = [
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-1",
    invoiceNumber: "GN/AZ/01",
    invoiceDate: "2025-09-03",
    transactionType: "Shipment",
    orderId: "408-0259535-1740321",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola Edge 60 Pro Pantone Shadow 12GB RAM 256GB Storage Grey",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Dibai",
    shipToState: "UP",
    shipToPostalCode: "203393",
    ratePerItem: 31739.0,
    principalAmountBasis: 26592.37,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 4786.63,
    invoiceAmount: 31739.0,
    paymentMethod: "UPI",
    channel: "Amazon",
    status: "Completed",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-2",
    invoiceNumber: "GN/AZ/02",
    invoiceDate: "2025-09-03",
    transactionType: "Shipment",
    orderId: "171-178936-7409152",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola Edge 60 Pro 5G Pantone Sparkling Grape 8GB RAM 256GB Storage",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Ghaziabad",
    shipToState: "UTTAR",
    shipToPostalCode: "201001",
    ratePerItem: 28899.0,
    principalAmountBasis: 24490.68,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 4408.32,
    invoiceAmount: 28899.0,
    paymentMethod: "Card",
    channel: "Amazon",
    status: "Completed",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-3",
    invoiceNumber: "GN/AZ/03",
    invoiceDate: "2025-09-04",
    transactionType: "Shipment",
    orderId: "405-941801-9514701",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola Edge 60 Pro 5G Pantone Sparkling Grape 8GB RAM 256GB Storage",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Coimbatore",
    shipToState: "TAMIL",
    shipToPostalCode: "641003",
    ratePerItem: 28899.0,
    principalAmountBasis: 24490.68,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 4408.32,
    invoiceAmount: 28899.0,
    paymentMethod: "COD",
    channel: "Amazon",
    status: "Pending",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-4",
    invoiceNumber: "GN/AZ/04",
    invoiceDate: "2025-09-04",
    transactionType: "Shipment",
    orderId: "408-524899-5535500",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola Edge 60 Pro 5G Pantone Sparkling Grape 8GB RAM 256GB Storage",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Pimpri Chinchwad",
    shipToState: "MAH",
    shipToPostalCode: "411033",
    ratePerItem: 28899.0,
    principalAmountBasis: 24490.68,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 4408.32,
    invoiceAmount: 28899.0,
    paymentMethod: "UPI",
    channel: "Amazon",
    status: "Completed",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-5",
    invoiceNumber: "GN/AZ/05",
    invoiceDate: "2025-09-05",
    transactionType: "Shipment",
    orderId: "402-345852-6012360",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola G86 Power 5G 6.7 1.5K pOLED Display, 7 15K pOLED Display",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Panipat",
    shipToState: "HARY",
    shipToPostalCode: "132103",
    ratePerItem: 16599.0,
    principalAmountBasis: 14066.95,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 2532.05,
    invoiceAmount: 16599.0,
    paymentMethod: "NetBanking",
    channel: "Amazon",
    status: "Completed",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-6",
    invoiceNumber: "GN/AZ/06",
    invoiceDate: "2025-09-05",
    transactionType: "Cancel",
    orderId: "401-986445-7781002",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 0,
    itemDescription:
      "Motorola G86 Power 5G 6.7 1.5K pOLED Display, Dimensity 7400",
    itemSerialNo: "-",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Lucknow",
    shipToState: "UTTAR",
    shipToPostalCode: "226001",
    ratePerItem: 0,
    principalAmountBasis: 0,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 0,
    invoiceAmount: 0,
    paymentMethod: "UPI",
    channel: "Amazon",
    status: "Cancelled",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-7",
    invoiceNumber: "GN/AZ/07",
    invoiceDate: "2025-09-06",
    transactionType: "Shipment",
    orderId: "406-502820-3045100",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola G86 Power 5G 8GB RAM 128GB Storage Forest Blue",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "Jaipur",
    shipToState: "RAJ",
    shipToPostalCode: "302001",
    ratePerItem: 16519.0,
    principalAmountBasis: 13999.15,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 2519.85,
    invoiceAmount: 16519.0,
    paymentMethod: "COD",
    channel: "Amazon",
    status: "Pending",
  },
  {
    sellerGstin: "08AKGP5461M1B2C",
    typeOfSale: "B2C",
    refNo: "JPX2-8",
    invoiceNumber: "GN/AZ/08",
    invoiceDate: "2025-09-07",
    transactionType: "Shipment",
    orderId: "403-501229-0150190",
    buyer: "Amazon Sales",
    buyerGstin: "URD",
    quantity: 1,
    itemDescription:
      "Motorola G86 Power 5G 8GB RAM 128GB Storage Cosmic Sky",
    itemSerialNo: "IMEI-3",
    shipFromCity: "BAGRU",
    shipFromState: "RAJAS",
    shipFromPostalCode: "303007",
    shipToCity: "New Delhi",
    shipToState: "DELHI",
    shipToPostalCode: "110001",
    ratePerItem: 16519.0,
    principalAmountBasis: 13999.15,
    cgstTax: 0,
    sgstTax: 0,
    igstTax: 2519.85,
    invoiceAmount: 16519.0,
    paymentMethod: "Card",
    channel: "Amazon",
    status: "Completed",
  },
];

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

function formatExcelDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCompactCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getStatusBadge(status) {
  const map = {
    Completed: {
      bg: "var(--amazon-success-soft)",
      text: "var(--amazon-success-strong)",
    },
    Pending: {
      bg: "#fff7ed",
      text: "var(--amazon-dark-orange)",
    },
    Cancelled: {
      bg: "var(--amazon-danger-soft)",
      text: "var(--amazon-danger)",
    },
  };

  const style = map[status] || {
    bg: "var(--amazon-bg-main)",
    text: "var(--amazon-text-secondary)",
  };

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold border"
      style={{
        background: style.bg,
        color: style.text,
        borderColor: "var(--amazon-border-light)",
      }}
    >
      {status}
    </span>
  );
}

async function downloadSalesRegisterExcel(
  rows,
  filename = "sales-register.xlsx"
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Register", {
    views: [{ showGridLines: true }],
  });

  const columns = [
    { header: "Seller Gstin", key: "sellerGstin", width: 18 },
    { header: "Type of Sale", key: "typeOfSale", width: 12 },
    { header: "Ref. No.", key: "refNo", width: 12 },
    { header: "Invoice Number", key: "invoiceNumber", width: 16 },
    { header: "Invoice Date", key: "invoiceDate", width: 14 },
    { header: "Transaction Type", key: "transactionType", width: 16 },
    { header: "Order Id", key: "orderId", width: 22 },
    { header: "Buyer", key: "buyer", width: 18 },
    { header: "Customer GSTIN No.", key: "buyerGstin", width: 16 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "Item Description", key: "itemDescription", width: 58 },
    { header: "Item Serial No.", key: "itemSerialNo", width: 14 },
    { header: "Ship From City", key: "shipFromCity", width: 14 },
    { header: "Ship From State", key: "shipFromState", width: 14 },
    { header: "Ship From Postal Code", key: "shipFromPostalCode", width: 16 },
    { header: "Ship To City", key: "shipToCity", width: 14 },
    { header: "Ship To State", key: "shipToState", width: 14 },
    { header: "Ship To Postal Code", key: "shipToPostalCode", width: 16 },
    {
      header: "Rate per Item / Including Tax Amount",
      key: "ratePerItem",
      width: 18,
    },
    {
      header: "Principal Amount Basis",
      key: "principalAmountBasis",
      width: 18,
    },
    { header: "Cgst Tax", key: "cgstTax", width: 12 },
    { header: "Sgst Tax", key: "sgstTax", width: 12 },
    { header: "Igst Tax", key: "igstTax", width: 12 },
    { header: "Invoice Amount", key: "invoiceAmount", width: 16 },
  ];

  worksheet.columns = columns;

  worksheet.mergeCells("A1:X1");
  worksheet.getCell("A1").value = "Ganpati Mobile Collection";

  worksheet.mergeCells("A2:X2");
  worksheet.getCell("A2").value = "Sales Register";

  worksheet.mergeCells("A3:X3");
  worksheet.getCell("A3").value = "1-Sep-25 to 30-Sep-25";

  ["A1", "A2", "A3"].forEach((cellRef, index) => {
    const cell = worksheet.getCell(cellRef);
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.font = {
      bold: true,
      size: index === 0 ? 14 : 12,
    };
  });

  worksheet.getRow(1).height = 24;
  worksheet.getRow(2).height = 20;
  worksheet.getRow(3).height = 20;

  worksheet.addRow([]);

  const numberRow = worksheet.addRow([
    "1",
    "2",
    "2",
    "3",
    "3",
    "4",
    "5",
    "8/4",
    "9",
    "10",
    "11",
    "15",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "37",
    "38",
    "39",
    "40",
    "41 & 42",
    "",
  ]);

  const headerRow = worksheet.addRow(columns.map((col) => col.header));

  numberRow.height = 18;
  headerRow.height = 34;

  [numberRow, headerRow].forEach((row) => {
    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.font = { bold: true, size: 10 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" },
      };
      cell.border = getBorder();
    });
  });

  rows.forEach((row) => {
    const excelRow = worksheet.addRow([
      row.sellerGstin,
      row.typeOfSale,
      row.refNo,
      row.invoiceNumber,
      formatExcelDate(row.invoiceDate),
      row.transactionType,
      row.orderId,
      row.buyer,
      row.buyerGstin,
      Number(row.quantity || 0),
      row.itemDescription,
      row.itemSerialNo,
      row.shipFromCity,
      row.shipFromState,
      row.shipFromPostalCode,
      row.shipToCity,
      row.shipToState,
      row.shipToPostalCode,
      Number(row.ratePerItem || 0),
      Number(row.principalAmountBasis || 0),
      Number(row.cgstTax || 0),
      Number(row.sgstTax || 0),
      Number(row.igstTax || 0),
      Number(row.invoiceAmount || 0),
    ]);

    excelRow.eachCell((cell, colNumber) => {
      cell.border = getBorder();
      cell.font = { size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: [10, 19, 20, 21, 22, 23, 24].includes(colNumber)
          ? "right"
          : "left",
        wrapText: true,
      };
    });

    [19, 20, 21, 22, 23, 24].forEach((col) => {
      excelRow.getCell(col).numFmt = "#,##0.00";
    });
  });

  const totalQty = rows.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const totalRate = rows.reduce(
    (sum, row) => sum + Number(row.ratePerItem || 0),
    0
  );
  const totalPrincipal = rows.reduce(
    (sum, row) => sum + Number(row.principalAmountBasis || 0),
    0
  );
  const totalCgst = rows.reduce((sum, row) => sum + Number(row.cgstTax || 0), 0);
  const totalSgst = rows.reduce((sum, row) => sum + Number(row.sgstTax || 0), 0);
  const totalIgst = rows.reduce((sum, row) => sum + Number(row.igstTax || 0), 0);
  const totalInvoice = rows.reduce(
    (sum, row) => sum + Number(row.invoiceAmount || 0),
    0
  );

  const totalRow = worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "Grand Total",
    "",
    "",
    "",
    totalQty,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    totalRate,
    totalPrincipal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalInvoice,
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.border = getBorder();
    cell.font = { bold: true, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: [10, 19, 20, 21, 22, 23, 24].includes(colNumber)
        ? "right"
        : "left",
      wrapText: true,
    };
  });

  [19, 20, 21, 22, 23, 24].forEach((col) => {
    totalRow.getCell(col).numFmt = "#,##0.00";
  });

  worksheet.eachRow((row) => {
    row.height = Math.max(row.height || 20, 20);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
}

function getBorder() {
  return {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
}

function SummaryCard({ title, value, icon: Icon, subtitle }) {
  return (
    <div
      className="rounded-2xl border p-4 shadow-sm"
      style={{
        background: "var(--amazon-bg-white)",
        borderColor: "var(--amazon-border-light)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            {title}
          </p>
          <h3
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--amazon-text-primary)" }}
          >
            {value}
          </h3>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            {subtitle}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            background: "rgba(255, 153, 0, 0.12)",
            color: "var(--amazon-orange)",
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, rightAction }) {
  return (
    <div
      className="rounded-2xl border shadow-sm"
      style={{
        background: "var(--amazon-bg-white)",
        borderColor: "var(--amazon-border-light)",
      }}
    >
      <div
        className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: "var(--amazon-border-light)" }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--amazon-text-primary)" }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className="text-sm"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {rightAction}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

export default function SalesPage() {
  const [loading] = useState(false);

  const totalSales = useMemo(() => {
    return salesRegisterRows.reduce(
      (sum, row) => sum + Number(row.invoiceAmount || 0),
      0
    );
  }, []);

  const totalOrders = salesRegisterRows.length;

  const completedOrders = useMemo(() => {
    return salesRegisterRows.filter((row) => row.status === "Completed").length;
  }, []);

  const pendingOrders = useMemo(() => {
    return salesRegisterRows.filter((row) => row.status === "Pending").length;
  }, []);

  const cancelledOrders = useMemo(() => {
    return salesRegisterRows.filter((row) => row.status === "Cancelled").length;
  }, []);

  const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

  const headers = [
    "invoiceNumber",
    "invoiceDateView",
    "orderId",
    "itemDescription",
    "invoiceAmountView",
    "statusView",
  ];

  const tableData = useMemo(() => {
    return salesRegisterRows.map((row, index) => ({
      id: index + 1,

      invoiceNumber: row.invoiceNumber,
      invoiceDateView: formatDate(row.invoiceDate),
      orderId: row.orderId,
      itemDescription: row.itemDescription,
      invoiceAmountView: formatCurrency(row.invoiceAmount),
      statusView: getStatusBadge(row.status),

      orderStatusRaw: row.status,
      purchaseDateRaw: row.invoiceDate,

      sellerGstin: row.sellerGstin,
      typeOfSale: row.typeOfSale,
      refNo: row.refNo,
      invoiceDate: formatDate(row.invoiceDate),
      transactionType: row.transactionType,
      buyer: row.buyer,
      buyerGstin: row.buyerGstin,
      quantity: row.quantity,
      itemSerialNo: row.itemSerialNo,
      shipFromCity: row.shipFromCity,
      shipFromState: row.shipFromState,
      shipFromPostalCode: row.shipFromPostalCode,
      shipToCity: row.shipToCity,
      shipToState: row.shipToState,
      shipToPostalCode: row.shipToPostalCode,
      ratePerItem: formatCurrency(row.ratePerItem),
      principalAmountBasis: formatCurrency(row.principalAmountBasis),
      cgstTax: formatCurrency(row.cgstTax),
      sgstTax: formatCurrency(row.sgstTax),
      igstTax: formatCurrency(row.igstTax),
      invoiceAmount: formatCurrency(row.invoiceAmount),
      paymentMethod: row.paymentMethod,
      channel: row.channel,
      status: row.status,
    }));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--amazon-bg-main)" }}
    >
      <div className="space-y-6 p-4 md:p-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#232F3E] via-[#1f2937] to-[#111827] text-white shadow-xl">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                Amazon Seller Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Sales Register Dashboard
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">
                Register style sales view with invoice-wise records, GST breakup,
                destination details, and Excel export in spreadsheet format.
              </p>
            </div>

            <button
              onClick={() =>
                downloadSalesRegisterExcel(
                  salesRegisterRows,
                  "sales-register-sep-2025.xlsx"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <Download size={18} />
              Export Sales Register Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Total Sales"
            value={formatCompactCurrency(totalSales)}
            subtitle="invoice amount total"
            icon={IndianRupee}
          />
          <SummaryCard
            title="Total Entries"
            value={String(totalOrders)}
            subtitle="register rows"
            icon={ShoppingCart}
          />
          <SummaryCard
            title="Avg. Order Value"
            value={formatCompactCurrency(avgOrderValue)}
            subtitle="per invoice"
            icon={TrendingUp}
          />
          <SummaryCard
            title="Completed"
            value={String(completedOrders)}
            subtitle="successful shipments"
            icon={Wallet}
          />
          <SummaryCard
            title="Pending / Cancelled"
            value={`${pendingOrders} / ${cancelledOrders}`}
            subtitle="attention needed"
            icon={BadgeIndianRupee}
          />
        </div>

        <SectionCard
          title="Sales Register Preview"
          subtitle="Important columns in table, full details in eye icon modal"
          rightAction={
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
              style={{
                background: "var(--amazon-bg-main)",
                color: "var(--amazon-text-secondary)",
                border: "1px solid var(--amazon-border-light)",
              }}
            >
              <CalendarRange size={16} />
              01-Sep-2025 to 30-Sep-2025
            </div>
          }
        >
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div
              className="rounded-xl border p-3"
              style={{
                background: "var(--amazon-bg-main)",
                borderColor: "var(--amazon-border-light)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Register Type
              </p>
              <p
                className="mt-1 text-sm font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Sales Register
              </p>
            </div>

            <div
              className="rounded-xl border p-3"
              style={{
                background: "var(--amazon-bg-main)",
                borderColor: "var(--amazon-border-light)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Seller GSTIN
              </p>
              <p
                className="mt-1 text-sm font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                08AKGP5461M1B2C
              </p>
            </div>

            <div
              className="rounded-xl border p-3"
              style={{
                background: "var(--amazon-bg-main)",
                borderColor: "var(--amazon-border-light)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Primary Channel
              </p>
              <p
                className="mt-1 text-sm font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Amazon
              </p>
            </div>

            <div
              className="rounded-xl border p-3"
              style={{
                background: "var(--amazon-bg-main)",
                borderColor: "var(--amazon-border-light)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Export Format
              </p>
              <p
                className="mt-1 flex items-center gap-2 text-sm font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                <FileSpreadsheet size={15} />
                Excel Register
              </p>
            </div>
          </div>

          <DynamicTable
            headers={headers}
            data={tableData}
            title=""
            loading={loading}
            hideTopHeader={true}
            hideCategoryFilter={false}
            hideDateFilter={false}
            filterKey="orderStatusRaw"
            dateKey="purchaseDateRaw"
            tableKeys={headers}
            onDetailsOpen={() => {}}
            showShippingAddress={false}
            shippingAddress={null}
            shippingLoading={false}
            shippingError=""
          />
        </SectionCard>
      </div>
    </div>
  );
}