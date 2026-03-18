"use client";

import { useMemo } from "react";
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  PackageCheck,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BadgePercent,
  CreditCard,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import DynamicTable from "@/app/components/DynamicTable";

const COLORS = ["#FF9900", "#232F3E", "#4F46E5", "#14B8A6"];

const salesDataConfig = {
  summary: {
    totalSales: "₹8,42,760",
    totalOrders: "3,962",
    avgOrderValue: "₹2,127",
    successfulPayouts: "₹6,95,340",
    totalSalesChange: "+24.9%",
    totalOrdersChange: "+17.6%",
    avgOrderValueChange: "+4.2%",
    successfulPayoutsChange: "+8.7%",
    todayRevenue: "₹41,860",
    todayGrowth: "+14.8% from yesterday",
    todayOrders: "103",
    todayRefunds: "4",
    todayAov: "₹2,180",
    todayConversion: "7.1%",
  },
  salesData: [
    { name: "W1", sales: 122000, orders: 580 },
    { name: "W2", sales: 148000, orders: 710 },
    { name: "W3", sales: 165000, orders: 806 },
    { name: "W4", sales: 188000, orders: 920 },
    { name: "W5", sales: 219760, orders: 946 },
  ],
  channelData: [
    { name: "Amazon", value: 72 },
    { name: "Direct", value: 15 },
    { name: "Ads", value: 13 },
  ],
  paymentData: [
    { name: "COD", value: 29 },
    { name: "UPI", value: 33 },
    { name: "Cards", value: 24 },
    { name: "NetBanking", value: 14 },
  ],
};

const recentSales = [
  {
    id: "#AMZ10231",
    customer: "Rohit Sharma",
    product: "Wireless Headphones",
    amount: "₹2,499",
    status: "Completed",
    date: "2026-03-18",
    category: "Electronics",
    paymentMethod: "UPI",
    city: "Mumbai",
    sku: "WH-990-21",
    channel: "Amazon",
  },
  {
    id: "#AMZ10232",
    customer: "Priya Mehta",
    product: "Bluetooth Speaker",
    amount: "₹1,899",
    status: "Completed",
    date: "2026-03-18",
    category: "Electronics",
    paymentMethod: "Card",
    city: "Pune",
    sku: "BS-221-18",
    channel: "Amazon",
  },
  {
    id: "#AMZ10233",
    customer: "Ankit Verma",
    product: "Smart Watch",
    amount: "₹3,299",
    status: "Pending",
    date: "2026-03-17",
    category: "Wearables",
    paymentMethod: "COD",
    city: "Jaipur",
    sku: "SW-778-01",
    channel: "Ads",
  },
  {
    id: "#AMZ10234",
    customer: "Sneha Patel",
    product: "Laptop Stand",
    amount: "₹999",
    status: "Completed",
    date: "2026-03-17",
    category: "Accessories",
    paymentMethod: "UPI",
    city: "Ahmedabad",
    sku: "LS-430-09",
    channel: "Direct",
  },
  {
    id: "#AMZ10235",
    customer: "Karan Joshi",
    product: "USB Hub",
    amount: "₹799",
    status: "Refunded",
    date: "2026-03-16",
    category: "Accessories",
    paymentMethod: "NetBanking",
    city: "Delhi",
    sku: "UH-104-77",
    channel: "Amazon",
  },
  {
    id: "#AMZ10236",
    customer: "Neha Saini",
    product: "Gaming Mouse",
    amount: "₹1,499",
    status: "Completed",
    date: "2026-03-15",
    category: "Accessories",
    paymentMethod: "UPI",
    city: "Indore",
    sku: "GM-902-11",
    channel: "Amazon",
  },
  {
    id: "#AMZ10237",
    customer: "Vikram Singh",
    product: "Phone Holder",
    amount: "₹599",
    status: "Pending",
    date: "2026-03-14",
    category: "Accessories",
    paymentMethod: "COD",
    city: "Lucknow",
    sku: "PH-380-02",
    channel: "Direct",
  },
  {
    id: "#AMZ10238",
    customer: "Pooja Jain",
    product: "Fitness Band",
    amount: "₹2,099",
    status: "Completed",
    date: "2026-03-13",
    category: "Wearables",
    paymentMethod: "Card",
    city: "Surat",
    sku: "FB-118-88",
    channel: "Ads",
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
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
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function getStatusBadge(status) {
  if (status === "Completed") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Completed
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
      Refunded
    </span>
  );
}

function formatCurrencyValue(value) {
  if (typeof value === "number") {
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return value;
}

function downloadCSV(rows, filename = "sales-report.csv") {
  const safeRows = rows.map((row) => {
    const next = {};
    Object.entries(row).forEach(([key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        next[key] = value;
      } else {
        next[key] = "";
      }
    });
    return next;
  });

  const headers = Object.keys(safeRows[0] || {});
  const csv = [
    headers.join(","),
    ...safeRows.map((row) =>
      headers
        .map((header) => {
          const cell = row[header] ?? "";
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function StatCard({ title, value, change, up, icon: Icon, subtitle }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                up
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </span>
            <span className="text-xs text-slate-500">{subtitle}</span>
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9900] to-[#ffb84d] text-slate-900 shadow-md">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
        {action && (
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SalesPage() {
  const summary = salesDataConfig.summary;
  const salesData = salesDataConfig.salesData;
  const channelData = salesDataConfig.channelData;
  const paymentData = salesDataConfig.paymentData;

  const strongestPaymentMethod = useMemo(() => {
    return [...paymentData].sort((a, b) => b.value - a.value)[0]?.name || "UPI";
  }, [paymentData]);

  const tableData = useMemo(() => {
    return recentSales.map((item) => ({
      ...item,
      amount: (
        <span className="whitespace-nowrap font-bold text-slate-900">
          {item.amount}
        </span>
      ),
      status: getStatusBadge(item.status),
      date: formatDate(item.date),
    }));
  }, []);

  const exportRawData = useMemo(() => recentSales, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="space-y-6 p-4 md:p-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#232F3E] via-[#1f2937] to-[#111827] p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-300">
                Amazon Seller Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Sales Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                Track your revenue, orders, payouts, payment performance, and
                sales growth across your seller software in one place.
              </p>
            </div>

            <button
              onClick={() => downloadCSV(exportRawData, "sales-report.csv")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Sales"
            value={summary.totalSales}
            change={summary.totalSalesChange}
            up={summary.totalSalesChange.startsWith("+")}
            subtitle="vs previous period"
            icon={IndianRupee}
          />
          <StatCard
            title="Total Orders"
            value={summary.totalOrders}
            change={summary.totalOrdersChange}
            up={summary.totalOrdersChange.startsWith("+")}
            subtitle="order growth"
            icon={ShoppingCart}
          />
          <StatCard
            title="Avg. Order Value"
            value={summary.avgOrderValue}
            change={summary.avgOrderValueChange}
            up={summary.avgOrderValueChange.startsWith("+")}
            subtitle="higher conversion"
            icon={TrendingUp}
          />
          <StatCard
            title="Successful Payouts"
            value={summary.successfulPayouts}
            change={summary.successfulPayoutsChange}
            up={summary.successfulPayoutsChange.startsWith("+")}
            subtitle="settlement performance"
            icon={Wallet}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionCard title="Sales Performance" action="Live Overview">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9900" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#FF9900" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis
                      stroke="#64748b"
                      tickFormatter={(value) => formatCurrencyValue(value)}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales" ? formatCurrencyValue(value) : value,
                        name === "sales" ? "Sales" : "Orders",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#FF9900"
                      strokeWidth={3}
                      fill="url(#salesFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div>
            <SectionCard title="Sales Channel Split">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 space-y-3">
                {channelData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SectionCard title="Payment Method Performance">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#232F3E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Quick Insights">
            <div className="space-y-4">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#FF9900] p-2 text-slate-900">
                    <BadgePercent size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Best Performing Channel
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {channelData[0].name} is driving the highest revenue share
                      in the current report.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <PackageCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Fulfillment Momentum
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Stable order handling and better dispatch flow are helping
                      maintain smoother delivery performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-600 p-2 text-white">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Strongest Payment Mode
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {strongestPaymentMethod} is currently the most used payment
                      method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Today Summary">
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-[#232F3E] to-[#111827] p-4 text-white">
                <p className="text-sm text-slate-300">Today Revenue</p>
                <h3 className="mt-1 text-3xl font-bold">{summary.todayRevenue}</h3>
                <p className="mt-2 text-sm text-emerald-300">
                  {summary.todayGrowth}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Orders</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">
                    {summary.todayOrders}
                  </h4>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Refunds</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">
                    {summary.todayRefunds}
                  </h4>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">AOV</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">
                    {summary.todayAov}
                  </h4>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Conversion</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">
                    {summary.todayConversion}
                  </h4>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <DynamicTable
          title="Recent Sales Transactions"
          headers={[
            "id",
            "customer",
            "product",
            "amount",
            "status",
            "paymentMethod",
            "channel",
            "date",
          ]}
          data={tableData}
          filterKey="category"
          dateKey="date"
          loading={false}
        />
      </div>
    </div>
  );
}