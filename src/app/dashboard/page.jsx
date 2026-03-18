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
import { motion } from "framer-motion";
import { cn } from "../lib/util";

/* ================= KPI DATA ================= */

const kpiCards = [
  {
    title: "Total Orders",
    value: "1,245",
    trend: "+14.2%",
    up: true,
    icon: Package,
  },
  {
    title: "Total Sales",
    value: "₹82,430",
    trend: "+8.1%",
    up: true,
    icon: IndianRupee,
  },
  {
    title: "Fulfilled Orders",
    value: "980",
    trend: "-2.4%",
    up: false,
    icon: Truck,
  },
  {
    title: "Customer Returns",
    value: "23",
    trend: "Normal",
    up: true,
    icon: RefreshCcw,
  },
];

const tabs = [
  "Business Overview",
  "Orders Analytics",
  "Fulfillment Performance",
  "Returns",
  "Inventory",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function AmazonDashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("Business Overview");

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
    const dataToExport = filteredRevenueData.length
      ? filteredRevenueData
      : revenueData;

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
    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8;",
    });
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 pt-8 pb-8 sm:px-6 lg:px-10 font-sans text-slate-900">
      {/* BACKGROUND FX */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-am ber-300/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-oran ge-300/10 bl ur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 35, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yel low-400/10 bl ur-3xl"
        />
      </div>

      <motion.div
        variants={staggerWrap}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        {/* HEADER */}
        <motion.header
          variants={fadeUp}
          className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-4xl"
            >
              Seller Central
            </motion.h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Real-time performance metrics and store health.
            </p>
          </div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3"
          >
            <select
              value={dateMode}
              onChange={(e) => {
                setDateMode(e.target.value);
                setFromDate("");
                setToDate("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Week">Last 7 Days</option>
              <option value="Custom">Custom Range</option>
            </select>

            {dateMode === "Custom" && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-center gap-2"
              >
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />

                <span className="text-sm text-slate-400">to</span>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleExport}
              className="group relative overflow-hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-white/10 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Export
              </span>
            </motion.button>
          </motion.div>
        </motion.header>

        {/* KPI CARDS */}
        <motion.div
          variants={staggerWrap}
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {kpiCards.map((card, index) => (
            <KPICard key={card.title} {...card} index={index} />
          ))}
        </motion.div>

        {/* TABS */}
        <motion.div
          variants={fadeUp}
          className="mb-6 flex w-full items-center gap-1 overflow-x-auto rounded-2xl border border-white/60 bg-white/70 p-1 shadow-sm backdrop-blur-xl sm:w-fit"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-4 sm:px-6 py-2.5 text-xs sm:text-sm rounded-xl font-semibold transition whitespace-nowrap",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-100 via-white to-orange-100 shadow-sm ring-1 ring-amber-200/70"
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT */}
          <div className="space-y-8 lg:col-span-8">
            {/* REVENUE CHART */}
            <motion.section
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-orange-50/40 opacity-60" />
              <div className="absolute -top-24 right-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="relative z-10 mb-6 flex justify-between">
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Revenue Growth</h3>
                  <p className="text-sm text-slate-500">
                    Monthly profit vs loss comparison
                  </p>
                </div>
              </div>

              <div className="relative z-10 h-[260px] w-full sm:h-[320px] lg:h-[350px]">
                {loading && (
                  <div className="flex h-full items-center justify-center">
                    <div className="w-full animate-pulse space-y-3 px-4">
                      <div className="h-4 w-40 rounded bg-slate-200" />
                      <div className="h-52 rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex h-full items-center justify-center text-red-500">
                    {error}
                  </div>
                )}

                {!loading && !error && filteredRevenueData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredRevenueData}>
                        <defs>
                          <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                          </linearGradient>

                          <linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.32} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.04} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="profit"
                          stroke="#10b981"
                          fill="url(#profitFill)"
                          strokeWidth={3}
                        />

                        <Area
                          type="monotone"
                          dataKey="loss"
                          stroke="#f43f5e"
                          fill="url(#lossFill)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {!loading && !error && filteredRevenueData.length === 0 && (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No data available for selected date range
                  </div>
                )}
              </div>
            </motion.section>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <StatusCard
                title="Fulfillment Health"
                stats={[
                  { label: "Total Shipments", value: "128" },
                  { label: "Delayed", value: "2" },
                  { label: "In Transit", value: "45" },
                ]}
                delay={0.1}
              />

              <StatusCard
                title="Customer Satisfaction"
                stats={[
                  { label: "Positive Feedback", value: "98%" },
                  { label: "Claims Open", value: "1" },
                  { label: "Response Time", value: "4h" },
                ]}
                delay={0.2}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6 lg:col-span-4 lg:space-y-8">
            <motion.section
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
            >
              <h3 className="mb-6 text-lg font-bold">Regional Distribution</h3>

              <div className="space-y-5">
                {["North Zone", "South Zone", "East Zone", "West Zone"].map(
                  (zone, i) => {
                    const width = 40 - i * 8;
                    return (
                      <motion.div
                        key={zone}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.5 }}
                      >
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{zone}</span>
                          <span>{width}%</span>
                        </div>

                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{
                              duration: 1,
                              delay: i * 0.15,
                              ease: "easeOut",
                            }}
                            className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_18px_rgba(251,146,60,0.45)]"
                          />
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </motion.section>

            <motion.section
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400 blur-3xl"
              />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 shadow-lg"
                  >
                    <AlertCircle className="h-5 w-5 text-black" />
                  </motion.div>

                  <h3 className="text-lg font-bold">Inventory Alert</h3>
                </div>

                <p className="mb-5 text-sm leading-6 text-slate-300">
                  4 items are reaching critically low levels. Restock now before
                  they impact order flow.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-black shadow-lg"
                >
                  Review Stock
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* KPI CARD */
function KPICard({ title, value, trend, up, icon: Icon, index }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-amber-50/50 opacity-90" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl transition-all duration-500 group-hover:scale-150" />

      <motion.div
        animate={{ rotate: [0, 6, 0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-slate-100/80 blur-xl"
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 shadow-inner transition duration-300 group-hover:scale-110 group-hover:bg-amber-50">
            <Icon className="h-6 w-6 text-slate-700" />
          </div>

          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
              up
                ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                : "bg-red-50 text-red-600 ring-1 ring-red-100"
            )}
          >
            {trend}
          </span>
        </div>

        <p className="text-sm text-slate-500">{title}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {value}
        </h2>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${70 + index * 6}%` }}
            transition={{ duration: 1.2, delay: 0.2 + index * 0.1 }}
            className={cn(
              "h-full rounded-full",
              up
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-rose-400 to-red-500"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* STATUS CARD */
function StatusCard({ title, stats, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl"
    >
      <h3 className="mb-5 text-lg font-bold">{title}</h3>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.1 }}
            className="rounded-2xl bg-slate-50 p-3 transition hover:bg-amber-50/50"
          >
            <p className="text-[9px] uppercase tracking-wider text-slate-400 sm:text-[10px]">
              {s.label}
            </p>
            <p className="mt-1 text-lg font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}