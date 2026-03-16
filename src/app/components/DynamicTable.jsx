"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Filter,
  X,
  Inbox,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
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

  const visibleKeys = useMemo(() => {
    if (Array.isArray(tableKeys) && tableKeys.length > 0) {
      return tableKeys;
    }

    if (Array.isArray(headers) && headers.length > 0) {
      return headers;
    }

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
        selectedCategory === "All" ? true : item?.[filterKey] === selectedCategory
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

  return (
    <div className="w-full mx-auto space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="h-4 w-16 rounded-md bg-slate-200" />
                <div className="h-4 w-10 rounded-md bg-slate-100" />
                <div className="h-4 w-12 rounded-md bg-slate-200" />
              </div>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {paginatedData.length}
                </span>{" "}
                of {filteredData.length}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-slate-200 rounded-xl px-3 bg-white shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search..."
              value={search}
              disabled={loading}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-2 py-2 text-sm outline-none bg-transparent disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl px-3 bg-white shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select
              value={selectedCategory}
              disabled={loading}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-2 py-2 text-sm outline-none bg-transparent disabled:cursor-not-allowed"
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
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm disabled:cursor-not-allowed"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="Week">Last 7 Days</option>
            <option value="Custom">Custom Range</option>
          </select>

          {dateMode === "Custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                disabled={loading}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm disabled:cursor-not-allowed"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input
                type="date"
                value={toDate}
                disabled={loading}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm disabled:cursor-not-allowed"
              />
            </div>
          )}

          <select
            value={rowsPerPage}
            disabled={loading}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm disabled:cursor-not-allowed"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>

          {(selectedCategory !== "All" ||
            dateMode !== "All" ||
            fromDate ||
            toDate ||
            search) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setDateMode("All");
                setFromDate("");
                setToDate("");
                setSearch("");
                setPage(1);
              }}
              className="p-2 text-slate-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed">
            <thead className="bg-slate-50">
              <tr>
                {tableHeaders.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-left"
                  >
                    {visibleKeys.length > 0 ? formatHeader(header) : `Column ${i + 1}`}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center w-[90px]">
                  View
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 w-full rounded-md bg-slate-200" />
                          <div className="h-4 w-3/4 rounded-md bg-slate-100" />
                        </div>
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center">
                      <div className="mx-auto h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <tr
                    key={row?.id || row?.asin || i}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {visibleKeys.map((key, j) => (
                      <td key={j} className="px-6 py-4 text-sm align-top">
                        <div className="max-w-[220px] min-w-[160px]">
                          {renderCell(row?.[key])}
                        </div>
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center align-top">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length + 1}
                    className="py-20 text-center"
                  >
                    <Inbox size={40} className="mx-auto text-slate-200" />
                    <p className="text-slate-500 mt-3">No records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-white">
          <p className="hidden sm:block text-sm font-medium text-slate-500">
            {loading ? (
              <span className="inline-block h-4 w-32 rounded bg-slate-200 animate-pulse" />
            ) : (
              <>
                Showing page <span className="text-slate-900">{page}</span> of{" "}
                <span className="text-slate-900">{totalPages}</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={loading || page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-active:-translate-x-1 transition-transform"
              />
            </button>

            <div className="flex items-center justify-center gap-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse border border-slate-300"
                  />
                ))
              ) : (
                Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(Math.max(0, page - 3), Math.max(5, page + 2))
                  .map((pageNum) => {
                    const isActive = page === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center ${
                          isActive
                            ? "bg-slate-900 text-white shadow-lg scale-105"
                            : "text-slate-500 hover:bg-slate-100 border border-transparent"
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
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors group"
            >
              <ArrowRight
                size={16}
                className="group-active:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {selectedRow && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={() => setSelectedRow(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
          />

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Entry Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full overview of the selected record
                </p>
              </div>

              <button
                onClick={() => setSelectedRow(null)}
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedRow).map(([key, value]) => (
                  <div
                    key={key}
                    className="border border-slate-100 p-3.5 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {formatHeader(key)}
                    </p>
                    <div className="text-[14px] font-medium text-slate-700 mt-1 break-words">
                      {renderDetailValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
      className="text-slate-600 break-words leading-5"
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
    return <span className="text-slate-300 italic">Empty</span>;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <span>{String(value)}</span>;
  }

  return (
    <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm text-slate-700 font-mono">
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
          (item, index) => `${index + 1}. ${getPrettyValue(item, depth + 1, seen)}`
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