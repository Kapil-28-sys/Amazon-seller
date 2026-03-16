"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  IndianRupee,
  Truck,
  RefreshCcw,
  Download,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { cn } from "../lib/util";

/* ================= KPI DATA ================= */

const kpiCards = [
  { title: "Total Orders", value: "1,245", trend: "+14.2%", up: true, icon: Package },
  { title: "Total Sales", value: "₹82,430", trend: "+8.1%", up: true, icon: IndianRupee },
  { title: "Fulfilled Orders", value: "980", trend: "-2.4%", up: false, icon: Truck },
  { title: "Customer Returns", value: "23", trend: "Normal", up: true, icon: RefreshCcw },
];

export default function AmazonDashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("Business Overview");

  // Date filter states
  const [dateMode, setDateMode] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FETCH API ================= */

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch("/api/revenue");

        if (!res.ok) {
          throw new Error("Failed to fetch revenue data");
        }

        const data = await res.json();
        console.log("API DATA:", data);

        setRevenueData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  /* ================= DATE FILTER ================= */

  const filteredRevenueData = useMemo(() => {
    if (!Array.isArray(revenueData)) return [];

    if (dateMode === "All") return revenueData;

    const today = new Date();

    return revenueData.filter((item) => {
      if (!item?.date) return true;

      const itemDate = new Date(item.date);

      if (dateMode === "Today") {
        return itemDate.toDateString() === today.toDateString();
      }

      if (dateMode === "Week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return itemDate >= weekAgo && itemDate <= today;
      }

      if (dateMode === "Custom" && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        return itemDate >= from && itemDate <= to;
      }

      return true;
    });
  }, [revenueData, dateMode, fromDate, toDate]);


  const handleExport = () => {
    const dataToExport = filteredRevenueData.length ? filteredRevenueData : revenueData;

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = Object.keys(dataToExport[0]);

    const csvRows = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((field) => {
            const value = row[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "revenue-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 pt-8 pb-8 sm:px-6 lg:px-10 font-sans text-slate-900">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Seller Central
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Real-time performance metrics and store health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* DATE FILTER MODE */}
          <select
            value={dateMode}
            onChange={(e) => {
              setDateMode(e.target.value);
              setFromDate("");
              setToDate("");
            }}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Week">Last 7 Days</option>
            <option value="Custom">Custom Range</option>
          </select>

          {/* CUSTOM DATE RANGE */}
          {dateMode === "Custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
              />

              <span className="text-slate-400 text-sm">to</span>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
              />
            </div>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {kpiCards.map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 overflow-x-auto mb-6 p-1 bg-slate-200/50 rounded-xl w-full sm:w-fit">
        {[
          "Business Overview",
          "Orders Analytics",
          "Fulfillment Performance",
          "Returns",
          "Inventory",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 sm:px-6 py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition whitespace-nowrap",
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">
          {/* REVENUE CHART */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Revenue Growth</h3>
                <p className="text-sm text-slate-500">
                  Monthly profit vs loss comparison
                </p>
              </div>
            </div>

            <div className="h-[260px] sm:h-[320px] lg:h-[350px] w-full">
              {loading && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Loading chart...
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full text-red-500">
                  {error}
                </div>
              )}

              {!loading && !error && filteredRevenueData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                    />

                    <Area
                      type="monotone"
                      dataKey="loss"
                      stroke="#f43f5e"
                      fill="#f43f5e"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {!loading && !error && filteredRevenueData.length === 0 && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available for selected date range
                </div>
              )}
            </div>
          </section>

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusCard
              title="Fulfillment Health"
              stats={[
                { label: "Total Shipments", value: "128" },
                { label: "Delayed", value: "2" },
                { label: "In Transit", value: "45" },
              ]}
            />

            <StatusCard
              title="Customer Satisfaction"
              stats={[
                { label: "Positive Feedback", value: "98%" },
                { label: "Claims Open", value: "1" },
                { label: "Response Time", value: "4h" },
              ]}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6">Regional Distribution</h3>

            <div className="space-y-4">
              {["North Zone", "South Zone", "East Zone", "West Zone"].map((zone, i) => (
                <div key={zone}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{zone}</span>
                    <span>{40 - i * 8}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${40 - i * 8}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-black" />
              </div>

              <h3 className="font-bold">Inventory Alert</h3>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              4 items are reaching critically low levels. Restock now.
            </p>

            <button className="w-full py-2 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2">
              Review Stock
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

/* KPI CARD */
function KPICard({ title, value, trend, up, icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl border shadow-sm">
      <div className="flex justify-between mb-3">
        <Icon className="w-6 h-6 text-slate-600" />

        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded",
            up ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}
        >
          {trend}
        </span>
      </div>

      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">{value}</h2>
    </div>
  );
}

/* STATUS CARD */
function StatusCard({ title, stats }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-bold mb-4">{title}</h3>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[9px] sm:text-[10px] uppercase text-slate-400">
              {s.label}
            </p>
            <p className="font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

