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
  MapPin,
  Loader2,
} from "lucide-react";

export default function DynamicTable({
  headers,
  data = [],
  filterKey = "category",
  dateKey = "date",
  title = "Records",
  tableKeys = null,
  loading = false,
  hideTopHeader = false,
  hideCategoryFilter = false,
  hideDateFilter = false,
  onDetailsOpen,
  showShippingAddress = false,
  shippingAddress = null,
  shippingLoading = false,
  shippingError = "",
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

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedRow(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const visibleKeys = useMemo(() => {
    if (Array.isArray(tableKeys) && tableKeys.length > 0) return tableKeys;
    if (Array.isArray(headers) && headers.length > 0) return headers;
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
      return Object.keys(data[0]).filter(
        (key) =>
          key !== "id" &&
          !key.endsWith("Raw") &&
          !key.startsWith("_") &&
          key !== filterKey &&
          key !== dateKey &&
          key !== "rawOrder"
      );
    }
    return [];
  }, [tableKeys, headers, data, filterKey, dateKey]);

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
    if (hideDateFilter) return true;
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
      weekAgo.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      return date >= weekAgo && date <= todayEnd;
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
      .filter((item) => {
        if (hideCategoryFilter) return true;
        if (selectedCategory === "All") return true;

        return String(item?.[filterKey] || "").toLowerCase() ===
          String(selectedCategory || "").toLowerCase();
      })
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
    hideCategoryFilter,
    hideDateFilter,
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
    (!hideCategoryFilter && selectedCategory !== "All") ||
    (!hideDateFilter && dateMode !== "All") ||
    (!hideDateFilter && fromDate) ||
    (!hideDateFilter && toDate) ||
    search;

  const showClear =
    hasActiveFilters &&
    (!hideTopHeader || search || !hideCategoryFilter || !hideDateFilter);

  const handleDetailsClick = (row) => {
    setSelectedRow(row);
    onDetailsOpen?.(row);
  };

  return (
    <div className="w-full max-w-[1450px] mx-auto mt-0 space-y-4 px-0 py-0">
      {!hideTopHeader && (
        <div
          className="rounded-3xl border"
          style={{
            borderColor: "var(--amazon-border-light)",
            background: "color-mix(in srgb, var(--amazon-bg-white) 95%, transparent)",
            boxShadow: "0 8px 30px rgba(15,23,42,0.05)",
          }}
        >
          <div className="flex flex-col gap-5 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-2xl"
                    style={{
                      background: "color-mix(in srgb, var(--amazon-btn-orange) 15%, white)",
                    }}
                  >
                    <SlidersHorizontal
                      size={18}
                      className="text-[var(--amazon-orange)]"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--amazon-text-primary)]">
                      {title}
                    </h1>
                    <p className="text-sm text-[var(--amazon-text-secondary)]">
                      Manage and explore your records with smart filters
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="min-w-[220px] rounded-2xl border px-4 py-3"
                style={{
                  borderColor: "var(--amazon-border-light)",
                  background: "var(--amazon-bg-main)",
                }}
              >
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div
                      className="h-3 w-28 rounded"
                      style={{ background: "var(--amazon-border-light)" }}
                    />
                    <div
                      className="h-5 w-16 rounded"
                      style={{ background: "var(--amazon-border-medium)" }}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--amazon-text-secondary)]">
                      Total Results
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[var(--amazon-text-primary)]">
                      {filteredData.length}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div
                  className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border px-4 py-3 shadow-sm transition-all sm:w-[300px] sm:flex-none"
                  style={{
                    borderColor: "var(--amazon-border-light)",
                    background: "var(--amazon-bg-white)",
                  }}
                >
                  <Search
                    size={18}
                    className="text-[var(--amazon-text-secondary)]"
                  />
                  <input
                    placeholder="Search records..."
                    value={search}
                    disabled={loading}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--amazon-text-secondary)] disabled:cursor-not-allowed text-[var(--amazon-text-primary)]"
                  />
                </div>

                {!hideCategoryFilter && (
                  <div
                    className="flex items-center rounded-2xl border px-3 py-3 shadow-sm"
                    style={{
                      borderColor: "var(--amazon-border-light)",
                      background: "var(--amazon-bg-white)",
                    }}
                  >
                    <Filter
                      size={16}
                      className="text-[var(--amazon-text-secondary)]"
                    />
                    <select
                      value={selectedCategory}
                      disabled={loading}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setPage(1);
                      }}
                      className="bg-transparent px-2 text-sm outline-none disabled:cursor-not-allowed text-[var(--amazon-text-primary)]"
                    >
                      {categories.map((cat) => (
                        <option key={String(cat)} value={cat}>
                          {String(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!hideDateFilter && (
                  <>
                    <select
                      value={dateMode}
                      disabled={loading}
                      onChange={(e) => {
                        setDateMode(e.target.value);
                        setFromDate("");
                        setToDate("");
                        setPage(1);
                      }}
                      className="rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none disabled:cursor-not-allowed text-[var(--amazon-text-primary)]"
                      style={{
                        borderColor: "var(--amazon-border-light)",
                        background: "var(--amazon-bg-white)",
                      }}
                    >
                      <option value="All">All Dates</option>
                      <option value="Today">Today</option>
                      <option value="Week">Last 7 Days</option>
                      <option value="Custom">Custom Range</option>
                    </select>

                    {dateMode === "Custom" && (
                      <div
                        className="flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2.5 shadow-sm"
                        style={{
                          borderColor: "var(--amazon-border-light)",
                          background: "var(--amazon-bg-white)",
                        }}
                      >
                        <input
                          type="date"
                          value={fromDate}
                          disabled={loading}
                          onChange={(e) => {
                            setFromDate(e.target.value);
                            setPage(1);
                          }}
                          className="rounded-xl border px-3 py-2 text-sm outline-none text-[var(--amazon-text-primary)]"
                          style={{
                            borderColor: "var(--amazon-border-light)",
                          }}
                        />
                        <span className="text-sm text-[var(--amazon-text-secondary)]">
                          to
                        </span>
                        <input
                          type="date"
                          value={toDate}
                          disabled={loading}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setPage(1);
                          }}
                          className="rounded-xl border px-3 py-2 text-sm outline-none text-[var(--amazon-text-primary)]"
                          style={{
                            borderColor: "var(--amazon-border-light)",
                          }}
                        />
                      </div>
                    )}
                  </>
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
                  className="rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none disabled:cursor-not-allowed text-[var(--amazon-text-primary)]"
                  style={{
                    borderColor: "var(--amazon-border-light)",
                    background: "var(--amazon-bg-white)",
                  }}
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                </select>

                {showClear && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setDateMode("All");
                      setFromDate("");
                      setToDate("");
                      setSearch("");
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition"
                    style={{
                      borderColor: "#fecaca",
                      background: "#fef2f2",
                      color: "#ef4444",
                    }}
                  >
                    <X size={16} />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="overflow-hidden rounded-3xl border"
        style={{
          borderColor: "var(--amazon-border-light)",
          background: "var(--amazon-bg-white)",
          boxShadow: "0 10px 35px rgba(15,23,42,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(to right, color-mix(in srgb, var(--amazon-bg-main) 75%, white), color-mix(in srgb, var(--amazon-bg-main) 45%, white))",
                }}
              >
                {tableHeaders.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-5 text-left text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--amazon-text-secondary)]"
                  >
                    {visibleKeys.length > 0
                      ? formatHeader(header)
                      : `Column ${i + 1}`}
                  </th>
                ))}
                <th className="w-[110px] px-6 py-5 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--amazon-text-secondary)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody
              style={{
                divideColor: "var(--amazon-border-light)",
              }}
              className="divide-y"
            >
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr key={rowIndex} style={{ background: "var(--amazon-bg-white)" }}>
                    {tableHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-5">
                        <div className="animate-pulse space-y-2">
                          <div
                            className="h-4 w-full rounded"
                            style={{ background: "var(--amazon-border-light)" }}
                          />
                          <div
                            className="h-4 w-2/3 rounded"
                            style={{
                              background: "color-mix(in srgb, var(--amazon-border-light) 60%, white)",
                            }}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-5 text-center">
                      <div
                        className="mx-auto h-11 w-11 animate-pulse rounded-2xl"
                        style={{ background: "var(--amazon-border-light)" }}
                      />
                    </td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <motion.tr
                    key={row?.id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group transition-all"
                    style={{
                      background: "var(--amazon-bg-white)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "color-mix(in srgb, var(--amazon-btn-orange) 8%, white)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--amazon-bg-white)";
                    }}
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
                        onClick={() => handleDetailsClick(row)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ring-1 transition-all duration-300"
                        style={{
                          background: "var(--amazon-bg-white)",
                          color: "var(--amazon-text-secondary)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          ringColor: "var(--amazon-border-light)",
                        }}
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
                    <div
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ background: "var(--amazon-bg-main)" }}
                    >
                      <Inbox
                        size={34}
                        className="text-[var(--amazon-text-secondary)] opacity-50"
                      />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[var(--amazon-text-primary)]">
                      No records found
                    </h3>
                    <p className="mt-1 text-sm text-[var(--amazon-text-secondary)]">
                      Try changing search or filter options
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-col gap-4 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--amazon-border-light)",
            background: "var(--amazon-bg-white)",
          }}
        >
          <div className="text-sm text-[var(--amazon-text-secondary)]">
            {loading ? (
              <span
                className="inline-block h-4 w-36 animate-pulse rounded"
                style={{ background: "var(--amazon-border-light)" }}
              />
            ) : filteredData.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-[var(--amazon-text-primary)]">
                  {(page - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-[var(--amazon-text-primary)]">
                  {Math.min(page * rowsPerPage, filteredData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[var(--amazon-text-primary)]">
                  {filteredData.length}
                </span>{" "}
                entries
              </>
            ) : (
              <>Showing 0 entries</>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              disabled={loading || page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                borderColor: "var(--amazon-border-light)",
                background: "var(--amazon-bg-white)",
                color: "var(--amazon-text-secondary)",
              }}
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
                    className="h-11 w-11 animate-pulse rounded-2xl"
                    style={{ background: "var(--amazon-border-light)" }}
                  />
                ))
              ) : (
                getVisiblePages(totalPages, page).map((pageNum) => {
                  const isActive = page === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className="flex h-11 min-w-[44px] items-center justify-center rounded-2xl px-3 text-sm font-bold transition-all"
                      style={
                        isActive
                          ? {
                              background: "var(--amazon-blue)",
                              color: "var(--amazon-text-white)",
                              boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                            }
                          : {
                              border: `1px solid var(--amazon-border-light)`,
                              background: "var(--amazon-bg-white)",
                              color: "var(--amazon-text-secondary)",
                            }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })
              )}
            </div>

            <button
              disabled={loading || page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                borderColor: "var(--amazon-border-light)",
                background: "var(--amazon-bg-white)",
                color: "var(--amazon-text-secondary)",
              }}
            >
              <ArrowRight
                size={16}
                className="transition-transform group-active:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedRow && !loading && (
          <motion.div
            key="details-modal"
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedRow(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.50)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[24px] border"
              style={{
                borderColor: "var(--amazon-border-light)",
                background: "var(--amazon-bg-white)",
                boxShadow: "0 20px 60px rgba(15,23,42,0.22)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(to right, var(--amazon-orange), var(--amazon-btn-orange), var(--amazon-blue))",
                }}
              />

              <div
                className="relative border-b px-5 py-4 sm:px-6 sm:py-4"
                style={{
                  borderColor: "var(--amazon-border-light)",
                  background: "var(--amazon-bg-white)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--amazon-orange)]">
                      Amazon Panel
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-[var(--amazon-text-primary)] sm:text-2xl">
                      Record Details
                    </h3>
                    <p className="mt-1 text-sm text-[var(--amazon-text-secondary)]">
                      Complete overview of the selected record
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedRow(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border transition"
                    style={{
                      borderColor: "var(--amazon-border-light)",
                      background: "var(--amazon-bg-white)",
                      color: "var(--amazon-text-secondary)",
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              <div
                className="custom-scrollbar max-h-[60vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
                style={{ background: "var(--amazon-bg-main)" }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(selectedRow)
                    .filter(
                      ([key]) =>
                        key !== "id" &&
                        key !== "rawOrder" &&
                        !key.endsWith("Raw") &&
                        !key.startsWith("_")
                    )
                    .map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: index * 0.03 }}
                        className="group relative overflow-hidden rounded-[20px] border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        style={{
                          borderColor: "var(--amazon-border-light)",
                          background: "var(--amazon-bg-white)",
                        }}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--amazon-text-secondary)]">
                          {formatHeader(key)}
                        </p>

                        <div
                          className="mt-2 h-[3px] w-10 rounded-full"
                          style={{
                            background:
                              "linear-gradient(to right, var(--amazon-orange), color-mix(in srgb, var(--amazon-btn-orange) 45%, white))",
                          }}
                        />

                        <div className="mt-3 text-sm leading-6 break-words text-[var(--amazon-text-primary)]">
                          {renderDetailValue(value)}
                        </div>
                      </motion.div>
                    ))}
                </div>

                {showShippingAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: 0.1 }}
                    className="mt-5 overflow-hidden rounded-[22px] border shadow-sm"
                    style={{
                      borderColor: "var(--amazon-border-light)",
                      background: "var(--amazon-bg-white)",
                    }}
                  >
                    <div
                      className="border-b px-4 py-4 sm:px-5"
                      style={{
                        borderColor: "var(--amazon-border-light)",
                        background:
                          "linear-gradient(to right, color-mix(in srgb, var(--amazon-btn-orange) 10%, white), var(--amazon-bg-white))",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-2xl"
                          style={{
                            background:
                              "color-mix(in srgb, var(--amazon-btn-orange) 18%, white)",
                          }}
                        >
                          <MapPin
                            size={18}
                            className="text-[var(--amazon-orange)]"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--amazon-text-primary)]">
                            Shipping Address
                          </h4>
                          <p className="text-sm text-[var(--amazon-text-secondary)]">
                            Delivery information linked with this order
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-4 sm:px-5 sm:py-5">
                      {shippingLoading ? (
                        <div
                          className="flex items-center gap-3 rounded-2xl border px-4 py-4 text-[var(--amazon-text-secondary)]"
                          style={{
                            borderColor: "var(--amazon-border-light)",
                            background: "var(--amazon-bg-main)",
                          }}
                        >
                          <Loader2 size={18} className="animate-spin" />
                          Loading shipping address...
                        </div>
                      ) : shippingError ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
                          {shippingError}
                        </div>
                      ) : shippingAddress ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <DetailBox
                            label="Name"
                            value={
                              shippingAddress?.Name ||
                              shippingAddress?.RecipientName ||
                              "Not Available"
                            }
                          />
                          <DetailBox
                            label="City"
                            value={shippingAddress?.City || "N/A"}
                          />
                          <DetailBox
                            label="State"
                            value={shippingAddress?.StateOrRegion || "N/A"}
                          />
                          <DetailBox
                            label="Postal Code"
                            value={shippingAddress?.PostalCode || "N/A"}
                          />
                          <DetailBox
                            label="Country"
                            value={shippingAddress?.CountryCode || "N/A"}
                          />
                          <DetailBox
                            label="Full Address"
                            value={
                              [
                                shippingAddress?.City,
                                shippingAddress?.StateOrRegion,
                                shippingAddress?.PostalCode,
                                shippingAddress?.CountryCode,
                              ]
                                .filter(Boolean)
                                .join(", ") || "N/A"
                            }
                          />
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl border px-4 py-4 text-sm"
                          style={{
                            borderColor: "var(--amazon-border-light)",
                            background: "var(--amazon-bg-main)",
                            color: "var(--amazon-text-secondary)",
                          }}
                        >
                          No shipping address found.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div
                className="flex items-center justify-end gap-3 border-t px-5 py-4 sm:px-6"
                style={{
                  borderColor: "var(--amazon-border-light)",
                  background: "var(--amazon-bg-white)",
                }}
              >
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRow(null)}
                  className="rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                  style={{
                    borderColor: "var(--amazon-border-light)",
                    background: "var(--amazon-bg-white)",
                    color: "var(--amazon-text-primary)",
                  }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRow(null)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
                  style={{
                    background:
                      "linear-gradient(to right, var(--amazon-orange), var(--amazon-btn-orange))",
                    color: "var(--amazon-text-white)",
                    boxShadow: "0 10px 24px rgba(255,153,0,0.32)",
                  }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div
      className="rounded-[18px] border px-4 py-3"
      style={{
        borderColor: "var(--amazon-border-light)",
        background: "var(--amazon-bg-main)",
      }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--amazon-text-secondary)]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium leading-6 text-[var(--amazon-text-primary)]">
        {value || "N/A"}
      </p>
    </div>
  );
}

function getVisiblePages(totalPages, currentPage) {
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - 2);
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function renderCell(value) {
  if (React.isValidElement(value)) return value;

  if (value === null || value === undefined || value === "") {
    return <span className="italic text-[var(--amazon-text-secondary)] opacity-50">Empty</span>;
  }

  return (
    <span
      className="break-words text-sm leading-6 text-[var(--amazon-text-primary)]"
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
    return <span className="italic text-[var(--amazon-text-secondary)] opacity-50">Empty</span>;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      <span className="font-medium text-[var(--amazon-text-primary)]">
        {String(value)}
      </span>
    );
  }

  return (
    <pre
      className="whitespace-pre-wrap break-words rounded-xl p-3 font-mono text-xs sm:text-sm"
      style={{
        background: "var(--amazon-bg-main)",
        color: "var(--amazon-text-primary)",
      }}
    >
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