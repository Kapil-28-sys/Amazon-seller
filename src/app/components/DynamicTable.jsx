"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  X,
  Inbox,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

export default function DynamicTable({
  headers,
  data = [],
  filterKey = "category",
  dateKey = "date",
  title = "Records",
  tableKeys = null,
  loading = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateMode, setDateMode] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (selectedRow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedRow]);

  const visibleKeys = useMemo(() => {
    if (Array.isArray(tableKeys) && tableKeys.length > 0) return tableKeys;
    if (Array.isArray(headers) && headers.length > 0) return headers;
    if (data?.length > 0 && typeof data[0] === "object" && data[0] !== null) {
      return Object.keys(data[0]);
    }
    return [];
  }, [tableKeys, headers, data]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        data
          .map((item) => item?.[filterKey])
          .filter(
            (value) => value !== undefined && value !== null && value !== ""
          )
      )
    );

    return ["All", ...unique];
  }, [data, filterKey]);

  function filterByDate(itemDate) {
    if (!itemDate || dateMode === "All") return true;

    const today = new Date();
    const date = new Date(itemDate);

    if (Number.isNaN(date.getTime())) return true;

    if (dateMode === "Today") {
      return date.toDateString() === today.toDateString();
    }

    if (dateMode === "Week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return date >= weekAgo && date <= today;
    }

    if (dateMode === "Custom") {
      if (!fromDate || !toDate) return true;

      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        return true;
      }

      return date >= from && date <= to;
    }

    return true;
  }

  const filteredData = useMemo(() => {
    const searchText = debouncedSearch.trim().toLowerCase();

    return data
      .filter((item) =>
        selectedCategory === "All"
          ? true
          : item?.[filterKey] === selectedCategory
      )
      .filter((item) => filterByDate(item?.[dateKey]))
      .filter((item) => {
        if (!searchText) return true;

        const searchableText = visibleKeys
          .map((key) => stringifyValue(item?.[key]))
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
  }, [
    data,
    selectedCategory,
    filterKey,
    dateKey,
    dateMode,
    fromDate,
    toDate,
    debouncedSearch,
    visibleKeys,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const skeletonRows = rowsPerPage;
  const skeletonColumns = Math.max(visibleKeys.length, 5);
  const tableHeaders =
    visibleKeys.length > 0
      ? visibleKeys
      : Array.from({ length: skeletonColumns }, (_, i) => `col-${i}`);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    dateMode !== "All" ||
    fromDate ||
    toDate ||
    search;

  return (
   <div className="w-full max-w-[1450px] mx-auto mt-5 space-y-8 sm:space-y-10 lg:space-y-4 px-4 sm:px-6 lg:px-10 xl:px-4 py-8 sm:py-3">
      {/* Top Header */}
      <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-5 p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-[#fff4e5] flex items-center justify-center">
                  <SlidersHorizontal size={18} className="text-[#FF9900]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                  <p className="text-sm text-slate-500">
                    Manage and explore your records with smart filters
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200 min-w-[220px]">
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 w-28 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded bg-slate-300" />
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                    Total Results
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {filteredData.length}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#FF9900] focus-within:ring-4 focus-within:ring-[#FF9900]/10 transition-all min-w-[260px] flex-1 sm:flex-none sm:w-[300px]">
                <Search size={18} className="text-slate-400" />
                <input
                  placeholder="Search records..."
                  value={search}
                  disabled={loading}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={selectedCategory}
                  disabled={loading}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent px-2 text-sm text-slate-700 outline-none disabled:cursor-not-allowed"
                >
                  {categories.map((cat) => (
                    <option key={String(cat)} value={cat}>
                      {String(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={dateMode}
                disabled={loading}
                onChange={(e) => {
                  setDateMode(e.target.value);
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none disabled:cursor-not-allowed"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Week">Last 7 Days</option>
                <option value="Custom">Custom Range</option>
              </select>

              {dateMode === "Custom" && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <input
                    type="date"
                    value={fromDate}
                    disabled={loading}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                  <span className="text-sm text-slate-400">to</span>
                  <input
                    type="date"
                    value={toDate}
                    disabled={loading}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={rowsPerPage}
                disabled={loading}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none disabled:cursor-not-allowed"
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setDateMode("All");
                    setFromDate("");
                    setToDate("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/70">
                {tableHeaders.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-5 text-left text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {visibleKeys.length > 0
                      ? formatHeader(header)
                      : `Column ${i + 1}`}
                  </th>
                ))}
                <th className="px-6 py-5 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500 w-[110px]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="bg-white">
                    {tableHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-5">
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 w-full rounded bg-slate-200" />
                          <div className="h-4 w-2/3 rounded bg-slate-100" />
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-5 text-center">
                      <div className="mx-auto h-11 w-11 rounded-2xl bg-slate-200 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <motion.tr
                    key={row?.id || row?.asin || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group transition-all hover:bg-[#fffaf2]"
                  >
                    {visibleKeys.map((key, j) => (
                      <td key={j} className="px-6 py-5 align-top">
                        <div className="max-w-[240px] min-w-[160px]">
                          {renderCell(row?.[key])}
                        </div>
                      </td>
                    ))}

                    <td className="px-6 py-5 text-center align-top">
                      <motion.button
                        whileHover={{ scale: 1.06, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:bg-[#fff7eb] hover:text-[#FF9900] hover:ring-[#ffd18a]"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length + 1}
                    className="py-24 text-center"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <Inbox size={34} className="text-slate-300" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-700">
                      No records found
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Try changing search or filter options
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            {loading ? (
              <span className="inline-block h-4 w-36 rounded bg-slate-200 animate-pulse" />
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {(page - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-800">
                  {Math.min(page * rowsPerPage, filteredData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {filteredData.length}
                </span>{" "}
                entries
              </>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              disabled={loading || page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-active:-translate-x-1"
              />
            </button>

            <div className="flex items-center gap-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-11 w-11 rounded-2xl bg-slate-200 animate-pulse"
                  />
                ))
              ) : (
                Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(Math.max(0, page - 2), Math.max(5, page + 2))
                  .map((pageNum) => {
                    const isActive = page === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`flex h-11 min-w-[44px] items-center justify-center rounded-2xl px-3 text-sm font-bold transition-all ${
                          isActive
                            ? "bg-[#111827] text-white shadow-lg"
                            : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })
              )}
            </div>

            <button
              disabled={loading || page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight
                size={16}
                className="transition-transform group-active:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRow && !loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <motion.div
              className="absolute inset-0 bg-black/55 backdrop-blur-[4px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9900] via-[#ffb84d] to-[#232F3E]" />

              <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#FF9900]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#232F3E]/10 blur-3xl" />

              <div className="relative flex items-center justify-between px-6 sm:px-8 py-5 bg-gradient-to-b from-white to-[#fafafa]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF9900]">
                    Amazon Panel
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-[#111827]">
                    Product Details
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete overview of the selected record
                  </p>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelectedRow(null)}
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:bg-slate-50"
                >
                  <X
                    size={18}
                    className="text-slate-500 group-hover:text-slate-900"
                  />
                </motion.button>
              </div>

              <div className="max-h-[68vh] overflow-y-auto bg-[#f8f9fb] px-6 sm:px-8 py-6 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(selectedRow).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: index * 0.04,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -4 }}
                      className="group rounded-2xl bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {formatHeader(key)}
                      </p>

                      <div className="mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-[#FF9900] to-[#ffd18a] transition-all duration-300 group-hover:w-16" />

                      <div className="mt-3 text-sm leading-6 text-slate-700 break-words">
                        {renderDetailValue(value)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 sm:px-8 py-4">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRow(null)}
                  className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRow(null)}
                  className="rounded-lg bg-gradient-to-r from-[#FF9900] to-[#f7a928] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,153,0,0.35)] transition-all duration-300 hover:shadow-[0_16px_34px_rgba(255,153,0,0.45)]"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>

            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.45);
                border-radius: 9999px;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(100, 116, 139, 0.75);
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderCell(value) {
  if (React.isValidElement(value)) return value;

  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300 italic">Empty</span>;
  }

  return (
    <span
      className="text-sm text-slate-700 break-words leading-6"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {getCompactValue(value)}
    </span>
  );
}

function renderDetailValue(value) {
  if (React.isValidElement(value)) return value;

  if (value === null || value === undefined || value === "") {
    return <span className="italic text-slate-300">Empty</span>;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <span className="font-medium text-slate-700">{String(value)}</span>;
  }

  return (
    <pre className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-3 text-xs sm:text-sm text-slate-700 font-mono">
      {getPrettyValue(value)}
    </pre>
  );
}

function stringifyValue(value, depth = 0, seen = new WeakSet()) {
  if (value === null || value === undefined) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "function" || typeof value === "symbol") return "";
  if (React.isValidElement(value)) return "";

  if (typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    if (depth > 2) return "[Object]";

    seen.add(value);

    if (Array.isArray(value)) {
      return value
        .map((item) => stringifyValue(item, depth + 1, seen))
        .join(" ");
    }

    return Object.values(value)
      .map((item) => stringifyValue(item, depth + 1, seen))
      .join(" ");
  }

  return "";
}

function getCompactValue(value, depth = 0, seen = new WeakSet()) {
  if (value === null || value === undefined || value === "") return "Empty";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "function") return "[Function]";
  if (typeof value === "symbol") return "[Symbol]";
  if (React.isValidElement(value)) return "[React Element]";

  if (typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    if (depth > 1) return "[Object]";

    seen.add(value);

    if (Array.isArray(value)) {
      return value
        .map((item) => getCompactValue(item, depth + 1, seen))
        .join(", ");
    }

    const entries = Object.entries(value).slice(0, 3);

    if (entries.length === 0) return "{}";

    return entries
      .map(
        ([key, val]) =>
          `${formatHeader(key)}: ${getCompactValue(val, depth + 1, seen)}`
      )
      .join(" | ");
  }

  return String(value);
}

function getPrettyValue(value, depth = 0, seen = new WeakSet()) {
  if (value === null || value === undefined) return "Empty";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "function") return "[Function]";
  if (typeof value === "symbol") return "[Symbol]";
  if (React.isValidElement(value)) return "[React Element]";

  if (typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    if (depth > 4) return "[Object]";

    seen.add(value);

    if (Array.isArray(value)) {
      return value
        .map(
          (item, index) =>
            `${index + 1}. ${getPrettyValue(item, depth + 1, seen)}`
        )
        .join("\n");
    }

    return Object.entries(value)
      .map(
        ([key, val]) =>
          `${formatHeader(key)}: ${getPrettyValue(val, depth + 1, seen)}`
      )
      .join("\n");
  }

  return String(value);
}

function formatHeader(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}