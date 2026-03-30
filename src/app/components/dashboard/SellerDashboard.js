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
  TrendingUp,
  TrendingDown,
  CalendarRange,
  Activity,
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
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/util";

/* ================= KPI DATA ================= */

const kpiCards = [
  {
    title: "Total Orders",
    value: "1,245",
    trend: "+14.2%",
    up: true,
    icon: Package,
    color: "amber",
  },
  {
    title: "Total Sales",
    value: "₹82,430",
    trend: "+8.1%",
    up: true,
    icon: IndianRupee,
    color: "emerald",
  },
  {
    title: "Fulfilled Orders",
    value: "980",
    trend: "-2.4%",
    up: false,
    icon: Truck,
    color: "blue",
  },
  {
    title: "Customer Returns",
    value: "23",
    trend: "Stable",
    up: true,
    icon: RefreshCcw,
    color: "rose",
  },
];

const tabs = [
  "Business Overview",
  "Orders Analytics",
  "Fulfillment Performance",
  "Returns",
  "Inventory",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingIcon = {
  animate: {
    y: [0, -4, 0],
    rotate: [0, 3, 0, -3, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function AmazonDashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("Business Overview");

  const [dateMode, setDateMode] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
    <div
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background: "var(--amazon-bg-main)",
        color: "var(--amazon-text-primary)",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="mb-6 rounded-3xl border px-5 py-4 shadow-sm sm:px-6"
          style={{
            borderColor: "var(--amazon-border-light)",
            background: "var(--amazon-bg-white)",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: "var(--amazon-success)" }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--amazon-success-strong)" }}
                  />
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Live Dashboard
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Seller Central Dashboard
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Monitor orders, revenue, fulfillment and inventory performance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--amazon-border-light)",
                  background: "var(--amazon-bg-main)",
                  color: "var(--amazon-text-secondary)",
                }}
              >
                <CalendarRange className="h-4 w-4" />
                <select
                  value={dateMode}
                  onChange={(e) => {
                    setDateMode(e.target.value);
                    setFromDate("");
                    setToDate("");
                  }}
                  className="bg-transparent outline-none"
                >
                  <option value="All">All Dates</option>
                  <option value="Today">Today</option>
                  <option value="Week">Last 7 Days</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>

              <AnimatePresence>
                {dateMode === "Custom" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="rounded-2xl border px-3 py-2 text-sm outline-none transition"
                      style={{
                        borderColor: "var(--amazon-border-light)",
                        background: "var(--amazon-bg-white)",
                        color: "var(--amazon-text-primary)",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--amazon-text-secondary)" }}
                    >
                      to
                    </span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="rounded-2xl border px-3 py-2 text-sm outline-none transition"
                      style={{
                        borderColor: "var(--amazon-border-light)",
                        background: "var(--amazon-bg-white)",
                        color: "var(--amazon-text-primary)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="group relative overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm"
                style={{
                  background: "var(--amazon-blue)",
                  color: "var(--amazon-text-white)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center gap-2">
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  Export
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* KPI CARDS */}
        <motion.div
          variants={containerVariants}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {kpiCards.map((card, index) => (
            <AnimatedKPICard key={card.title} {...card} index={index} />
          ))}
        </motion.div>

        {/* TABS */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex w-full gap-2 overflow-x-auto rounded-2xl border p-2 shadow-sm"
          style={{
            borderColor: "var(--amazon-border-light)",
            background: "var(--amazon-bg-white)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  isActive ? "" : ""
                )}
                style={{
                  color: isActive
                    ? "var(--amazon-text-primary)"
                    : "var(--amazon-text-secondary)",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--amazon-bg-main)" }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            {/* CHART CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-6"
              style={{
                borderColor: "var(--amazon-border-light)",
                background: "var(--amazon-bg-white)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to bottom right, color-mix(in srgb, var(--amazon-bg-main) 55%, white), var(--amazon-bg-white), color-mix(in srgb, var(--amazon-btn-orange) 10%, white))",
                }}
              />

              <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div
                    className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "var(--amazon-bg-main)",
                      color: "var(--amazon-text-secondary)",
                    }}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    Revenue Analysis
                  </div>
                  <h3 className="text-lg font-semibold">Revenue Growth</h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--amazon-text-secondary)" }}
                  >
                    Monthly profit and loss overview
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium sm:text-sm">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--amazon-text-secondary)" }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: "var(--amazon-success-strong)" }}
                    />
                    Profit
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--amazon-text-secondary)" }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: "var(--amazon-danger)" }}
                    />
                    Loss
                  </div>
                </div>
              </div>

              <div className="relative z-10 h-[280px] w-full sm:h-[340px]">
                {loading && (
                  <div className="flex h-full items-center justify-center">
                    <div className="w-full animate-pulse space-y-4">
                      <div
                        className="h-4 w-40 rounded"
                        style={{ background: "var(--amazon-border-light)" }}
                      />
                      <div
                        className="h-[240px] rounded-2xl"
                        style={{ background: "var(--amazon-bg-main)" }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    className="flex h-full items-center justify-center rounded-2xl"
                    style={{
                      background: "var(--amazon-danger-soft)",
                      color: "var(--amazon-danger)",
                    }}
                  >
                    {error}
                  </div>
                )}

                {!loading && !error && filteredRevenueData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={filteredRevenueData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="var(--amazon-success-strong)"
                              stopOpacity={0.22}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--amazon-success-strong)"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                          <linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="var(--amazon-danger)"
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--amazon-danger)"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          vertical={false}
                          stroke="var(--amazon-border-light)"
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "var(--amazon-text-secondary)",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "var(--amazon-text-secondary)",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid var(--amazon-border-light)",
                            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                            background: "var(--amazon-bg-white)",
                            color: "var(--amazon-text-primary)",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="profit"
                          stroke="var(--amazon-success-strong)"
                          fill="url(#profitFill)"
                          strokeWidth={2.5}
                        />
                        <Area
                          type="monotone"
                          dataKey="loss"
                          stroke="var(--amazon-danger)"
                          fill="url(#lossFill)"
                          strokeWidth={2.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {!loading && !error && filteredRevenueData.length === 0 && (
                  <div
                    className="flex h-full items-center justify-center"
                    style={{ color: "var(--amazon-text-secondary)" }}
                  >
                    No data available for selected date range
                  </div>
                )}
              </div>
            </motion.div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AnimatedStatusCard
                title="Fulfillment Health"
                stats={[
                  { label: "Total Shipments", value: "128" },
                  { label: "Delayed", value: "2" },
                  { label: "In Transit", value: "45" },
                ]}
              />

              <AnimatedStatusCard
                title="Customer Satisfaction"
                stats={[
                  { label: "Positive Feedback", value: "98%" },
                  { label: "Claims Open", value: "1" },
                  { label: "Response Time", value: "4h" },
                ]}
              />
            </div>
          </div>

          <div className="space-y-6 xl:col-span-4">
            {/* REGIONAL CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: "var(--amazon-border-light)",
                background: "var(--amazon-bg-white)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to bottom right, var(--amazon-bg-white), color-mix(in srgb, var(--amazon-bg-main) 65%, white), color-mix(in srgb, var(--amazon-border-light) 35%, white))",
                }}
              />

              <div className="relative z-10 mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Regional Distribution</h3>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    background: "var(--amazon-success-soft)",
                    color: "var(--amazon-success-strong)",
                  }}
                >
                  Active
                </span>
              </div>

              <div className="relative z-10 space-y-5">
                {[
                  { zone: "North Zone", value: 40 },
                  { zone: "South Zone", value: 32 },
                  { zone: "East Zone", value: 24 },
                  { zone: "West Zone", value: 16 },
                ].map((item, i) => (
                  <motion.div
                    key={item.zone}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span style={{ color: "var(--amazon-text-secondary)" }}>
                        {item.zone}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--amazon-text-primary)" }}
                      >
                        {item.value}%
                      </span>
                    </div>

                    <div
                      className="h-2.5 rounded-full"
                      style={{ background: "var(--amazon-bg-main)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.9, delay: i * 0.1 }}
                        className="relative h-2.5 overflow-hidden rounded-full"
                        style={{ background: "var(--amazon-blue)" }}
                      >
                        <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ALERT CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-sm transition-all duration-300 hover:shadow-xl"
              style={{
                background: "var(--amazon-blue)",
                color: "var(--amazon-text-white)",
              }}
            >
              <motion.div
                animate={{
                  x: [-20, 20, -20],
                  y: [0, -10, 0],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: "var(--amazon-btn-yellow)" }}
              />

              <motion.div
                animate={{
                  x: [0, 15, 0],
                  opacity: [0.08, 0.18, 0.08],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-3xl"
                style={{ background: "var(--amazon-orange)" }}
              />

              <div className="relative z-10 mb-4 flex items-center gap-3">
                <motion.div
                  variants={floatingIcon}
                  animate="animate"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--amazon-btn-yellow)",
                    color: "var(--amazon-text-primary)",
                  }}
                >
                  <AlertCircle className="h-5 w-5" />
                </motion.div>

                <div>
                  <h3 className="text-lg font-semibold">Inventory Alert</h3>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Immediate attention needed
                  </p>
                </div>
              </div>

              <p
                className="relative z-10 mb-5 text-sm leading-6"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                4 products are close to stock-out. Restock them soon to avoid
                order interruptions.
              </p>

              <div
                className="relative z-10 mb-5 rounded-2xl border p-4 backdrop-blur-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span style={{ color: "rgba(255,255,255,0.65)" }}>
                    Risk Level
                  </span>
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-semibold"
                    style={{ color: "var(--amazon-btn-yellow)" }}
                  >
                    82%
                  </motion.span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1 }}
                    className="relative h-2.5 rounded-full"
                    style={{ background: "var(--amazon-btn-yellow)" }}
                  >
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </motion.div>
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold transition"
                style={{
                  background: "var(--amazon-bg-white)",
                  color: "var(--amazon-text-primary)",
                }}
              >
                Review Stock
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}

function AnimatedKPICard({
  title,
  value,
  trend,
  up,
  icon: Icon,
  index,
  color = "amber",
}) {
  const glowMap = {
    amber:
      "linear-gradient(to bottom right, color-mix(in srgb, var(--amazon-btn-yellow) 26%, white), color-mix(in srgb, var(--amazon-btn-orange) 10%, white), var(--amazon-bg-white))",
    emerald:
      "linear-gradient(to bottom right, color-mix(in srgb, var(--amazon-success) 22%, white), color-mix(in srgb, var(--amazon-success-soft) 60%, white), var(--amazon-bg-white))",
    blue:
      "linear-gradient(to bottom right, color-mix(in srgb, var(--amazon-link-blue) 22%, white), color-mix(in srgb, var(--amazon-blue) 8%, white), var(--amazon-bg-white))",
    rose:
      "linear-gradient(to bottom right, color-mix(in srgb, var(--amazon-danger) 16%, white), color-mix(in srgb, var(--amazon-danger-soft) 70%, white), var(--amazon-bg-white))",
  };

  const iconMap = {
    amber: {
      background: "color-mix(in srgb, var(--amazon-btn-yellow) 18%, white)",
      color: "var(--amazon-orange)",
    },
    emerald: {
      background: "var(--amazon-success-soft)",
      color: "var(--amazon-success-strong)",
    },
    blue: {
      background: "color-mix(in srgb, var(--amazon-link-blue) 14%, white)",
      color: "var(--amazon-link-blue)",
    },
    rose: {
      background: "var(--amazon-danger-soft)",
      color: "var(--amazon-danger)",
    },
  };

  const badgeMap = {
    up: {
      background: "var(--amazon-success-soft)",
      color: "var(--amazon-success-strong)",
    },
    down: {
      background: "var(--amazon-danger-soft)",
      color: "var(--amazon-danger)",
    },
  };

  const lineMap = {
    amber: up ? "var(--amazon-orange)" : "var(--amazon-danger)",
    emerald: up ? "var(--amazon-success-strong)" : "var(--amazon-danger)",
    blue: up ? "var(--amazon-link-blue)" : "var(--amazon-danger)",
    rose: up ? "var(--amazon-danger)" : "var(--amazon-danger)",
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
      style={{
        borderColor: "var(--amazon-border-light)",
        background: "var(--amazon-bg-white)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glowMap[color] }}
      />

      <motion.div
        animate={{
          x: [0, 8, 0],
          y: [0, -6, 0],
          opacity: [0.16, 0.3, 0.16],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
        style={{ background: "var(--amazon-border-light)" }}
      />

      <div className="relative z-10 mb-4 flex items-start justify-between">
        <motion.div
          variants={floatingIcon}
          animate="animate"
          className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
          style={iconMap[color]}
        >
          <Icon className="h-5 w-5" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 + index * 0.06 }}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={up ? badgeMap.up : badgeMap.down}
        >
          {up ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {trend}
        </motion.div>
      </div>

      <div className="relative z-10">
        <p
          className="text-sm"
          style={{ color: "var(--amazon-text-secondary)" }}
        >
          {title}
        </p>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.06 }}
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--amazon-text-primary)" }}
        >
          {value}
        </motion.h3>

        <div
          className="mt-4 flex items-center justify-between text-xs"
          style={{ color: "var(--amazon-text-secondary)" }}
        >
          <span>Performance</span>
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Updated now
          </motion.span>
        </div>

        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full"
          style={{ background: "var(--amazon-bg-main)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${68 + index * 7}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
            className="relative h-full rounded-full"
            style={{ background: lineMap[color] }}
          >
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedStatusCard({ title, stats }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: "var(--amazon-border-light)",
        background: "var(--amazon-bg-white)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to bottom right, var(--amazon-bg-white), color-mix(in srgb, var(--amazon-bg-main) 70%, white), color-mix(in srgb, var(--amazon-btn-orange) 8%, white))",
        }}
      />

      <div className="relative z-10 mb-5 flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--amazon-text-primary)" }}
        >
          {title}
        </h3>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--amazon-text-secondary)" }}
        >
          Updated just now
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="rounded-2xl border p-3 transition-all duration-300 hover:shadow-md"
            style={{
              borderColor: "color-mix(in srgb, var(--amazon-border-light) 60%, white)",
              background: "var(--amazon-bg-main)",
            }}
          >
            <div className="mb-2 flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--amazon-success-strong)" }}
              />
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                {item.label}
              </p>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}