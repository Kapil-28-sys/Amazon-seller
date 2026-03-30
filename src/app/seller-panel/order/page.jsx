"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  RefreshCcw,
  Search,
  XCircle,
  CalendarRange,
  ArrowRight,
  Download,
  Filter,
  RotateCcw,
} from "lucide-react";
import DynamicTable from "@/app/components/DynamicTable";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [startDate, setStartDate] = useState(getTodayInputDate());
  const [endDate, setEndDate] = useState(getTodayInputDate());

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");

  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [shippingAddress, setShippingAddress] = useState(null);

  const headers = [
    "Order ID",
    "Sales Channel",
    "Order Type",
    "Amount",
    "Status",
    "Purchase Date",
  ];

  async function fetchOrders(start, end) {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const { startISO, endISO } = buildDateRange(start, end);

      const res = await fetch("/api/order-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startISO,
          endDate: endISO,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          `${data?.message || "Failed to fetch orders"}${
            data?.status ? ` (Status: ${data.status})` : ""
          }`
        );
      }

      const apiOrders = data?.payload?.Orders || [];
      setOrders(apiOrders);
      setMessage(data?.message || "");
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  async function fetchShippingAddress(order) {
    try {
      setShippingLoading(true);
      setShippingError("");
      setShippingAddress(null);

      const rawOrder = order?.rawOrder || order;
      const amazonOrderId = rawOrder?.AmazonOrderId;

      if (!amazonOrderId) {
        throw new Error("AmazonOrderId not found for selected order");
      }

      const res = await fetch("/api/order-shippingdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AmazonOrderId: amazonOrderId,
          MarketplaceId: rawOrder?.MarketplaceId,
          rawOrder,
        }),
      });

      const data = await res.json();
      console.log("Shipping route response:", data);

      if (!res.ok || !data.success) {
        throw new Error(
          data?.lastFailure?.apiResponse?.message ||
            data?.message ||
            "Failed to fetch shipping address"
        );
      }

      const address =
        data?.payload?.ShippingAddress ||
        data?.payload?.shippingAddress ||
        data?.ShippingAddress ||
        data?.shippingAddress ||
        data?.payload?.payload?.ShippingAddress ||
        data?.payload?.payload?.shippingAddress ||
        null;

      if (!address) {
        throw new Error("Shipping address not found in response");
      }

      setShippingAddress(address);
    } catch (err) {
      console.error("Shipping address fetch error:", err);
      setShippingError(err.message || "Failed to fetch shipping address");
      setShippingAddress(null);
    } finally {
      setShippingLoading(false);
    }
  }

  useEffect(() => {
    const today = getTodayInputDate();
    fetchOrders(today, today);
  }, []);

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      setError("Please select both start date and end date.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be greater than end date.");
      return;
    }

    fetchOrders(startDate, endDate);
  };

  const handleTodayFilter = () => {
    const today = getTodayInputDate();
    setStartDate(today);
    setEndDate(today);
    fetchOrders(today, today);
  };

  const handleClearAllFilters = () => {
    setSearchText("");
    setStatusFilter("All");
    setChannelFilter("All");
    setOrderTypeFilter("All");
  };

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter((o) => {
    const status = String(o.OrderStatus || "").toLowerCase();
    return status === "shipped" || status === "delivered";
  }).length;

  const pendingOrders = orders.filter((o) => {
    const status = String(o.OrderStatus || "").toLowerCase();
    return (
      status === "pending" ||
      status === "unshipped" ||
      status === "partiallyshipped"
    );
  }).length;

  const cancelledOrders = orders.filter((o) => {
    const status = String(o.OrderStatus || "").toLowerCase();
    return status === "canceled" || status === "cancelled";
  }).length;

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + Number(order?.OrderTotal?.Amount || 0);
  }, 0);

  const salesChannels = useMemo(() => {
    const channels = orders
      .map((order) => String(order.SalesChannel || "").trim())
      .filter(Boolean);
    return ["All", ...Array.from(new Set(channels))];
  }, [orders]);

  const orderTypes = useMemo(() => {
    const types = orders
      .map((order) => String(order.OrderType || "").trim())
      .filter(Boolean);
    return ["All", ...Array.from(new Set(types))];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderId = String(order.AmazonOrderId || "").toLowerCase();
      const salesChannel = String(order.SalesChannel || "").toLowerCase();
      const orderType = String(order.OrderType || "").toLowerCase();
      const rawStatus = String(order.OrderStatus || "").toLowerCase();
      const purchaseDate = String(order.PurchaseDate || "").toLowerCase();
      const amount = String(order?.OrderTotal?.Amount || "").toLowerCase();

      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        salesChannel.includes(search) ||
        orderType.includes(search) ||
        rawStatus.includes(search) ||
        purchaseDate.includes(search) ||
        amount.includes(search);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Pending"
          ? rawStatus === "pending" ||
            rawStatus === "unshipped" ||
            rawStatus === "partiallyshipped"
          : statusFilter === "Shipped / Delivered"
          ? rawStatus === "shipped" || rawStatus === "delivered"
          : statusFilter === "Canceled"
          ? rawStatus === "canceled" || rawStatus === "cancelled"
          : statusFilter === "Unshipped"
          ? rawStatus === "unshipped"
          : statusFilter === "Partially Shipped"
          ? rawStatus === "partiallyshipped"
          : statusFilter === "Invoice Unconfirmed"
          ? rawStatus === "invoiceunconfirmed"
          : statusFilter === "Unknown"
          ? !rawStatus
          : rawStatus === statusFilter.toLowerCase();

      const matchesChannel =
        channelFilter === "All"
          ? true
          : String(order.SalesChannel || "") === channelFilter;

      const matchesOrderType =
        orderTypeFilter === "All"
          ? true
          : String(order.OrderType || "") === orderTypeFilter;

      return (
        matchesSearch && matchesStatus && matchesChannel && matchesOrderType
      );
    });
  }, [orders, searchText, statusFilter, channelFilter, orderTypeFilter]);

  const filteredRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      return sum + Number(order?.OrderTotal?.Amount || 0);
    }, 0);
  }, [filteredOrders]);

  const tableData = useMemo(() => {
    return filteredOrders.map((order, index) => ({
      id: order.AmazonOrderId || index,
      rawOrder: order,
      orderStatusRaw: String(order.OrderStatus || ""),
      purchaseDateRaw: order.PurchaseDate || "",

      "Order ID": (
        <span style={{ fontWeight: 600, color: "var(--amazon-link-blue)" }}>
          {order.AmazonOrderId || "N/A"}
        </span>
      ),
      "Sales Channel": (
        <span style={{ color: "var(--amazon-text-primary)", fontWeight: 500 }}>
          {order.SalesChannel || "N/A"}
        </span>
      ),
      "Order Type": (
        <span style={{ color: "var(--amazon-text-secondary)" }}>
          {order.OrderType || "N/A"}
        </span>
      ),
      Amount: (
        <span style={{ fontWeight: 700, color: "var(--amazon-text-primary)" }}>
          ₹{Number(order?.OrderTotal?.Amount || 0).toLocaleString("en-IN")}
        </span>
      ),
      Status: (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm"
          style={getStatusStyle(order.OrderStatus)}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: getStatusDotStyle(order.OrderStatus) }}
          />
          {order.OrderStatus || "N/A"}
        </span>
      ),
      "Purchase Date": (
        <span style={{ color: "var(--amazon-text-secondary)", fontSize: "14px" }}>
          {formatDate(order.PurchaseDate)}
        </span>
      ),
    }));
  }, [filteredOrders]);

  const exportCsv = () => {
    if (!filteredOrders.length) {
      setError("No orders available to export.");
      return;
    }

    const rows = filteredOrders.map((order) => ({
      order_id: order.AmazonOrderId || "",
      sales_channel: order.SalesChannel || "",
      order_type: order.OrderType || "",
      amount: Number(order?.OrderTotal?.Amount || 0),
      currency: order?.OrderTotal?.CurrencyCode || "INR",
      status: order.OrderStatus || "",
      purchase_date: order.PurchaseDate || "",
      last_update_date: order.LastUpdateDate || "",
      fulfillment_channel: order.FulfillmentChannel || "",
      ship_service_level: order.ShipServiceLevel || "",
      marketplace_id: order.MarketplaceId || "",
      is_business_order: order.IsBusinessOrder || false,
      number_of_items_shipped: order.NumberOfItemsShipped || 0,
      number_of_items_unshipped: order.NumberOfItemsUnshipped || 0,
    }));

    const csvHeaders = Object.keys(rows[0]);
    const csvContent = [
      csvHeaders.join(","),
      ...rows.map((row) =>
        csvHeaders
          .map((field) =>
            `"${String(row[field] ?? "")
              .replace(/"/g, '""')
              .replace(/\n/g, " ")}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileDate = new Date().toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `orders-export-${fileDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen space-y-6 p-4 md:p-8"
      style={{
        background:
          "linear-gradient(to bottom right, var(--amazon-bg-main), var(--amazon-bg-white), color-mix(in srgb, var(--amazon-link-blue) 6%, white))",
      }}
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border shadow-sm"
        style={{
          borderColor: "var(--amazon-border-light)",
          background: "color-mix(in srgb, var(--amazon-bg-white) 80%, transparent)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--amazon-link-blue) 6%, transparent), transparent, color-mix(in srgb, var(--amazon-orange) 6%, transparent))",
          }}
        />

        <div className="relative flex flex-col justify-between gap-4 px-5 py-6 md:px-7 md:py-7 lg:flex-row lg:items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide"
              style={{
                background: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
                color: "var(--amazon-link-blue)",
                borderColor: "color-mix(in srgb, var(--amazon-link-blue) 18%, white)",
              }}
            >
              <ShoppingBag size={13} />
              Live Order Dashboard
            </div>

            <h1
              className="mt-3 text-2xl font-black tracking-tight md:text-3xl"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              Order Management
            </h1>

            <p
              className="mt-2 flex items-center gap-2 text-sm"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              <ArrowRight size={14} style={{ color: "var(--amazon-link-blue)" }} />
              Showing live order data from your API
            </p>
          </div>

          <div
            className="min-w-[220px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: "var(--amazon-border-light)",
              background: "var(--amazon-bg-main)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              Selected Range
            </p>
            <div
              className="mt-2 flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              <CalendarRange size={15} style={{ color: "var(--amazon-link-blue)" }} />
              <span>
                {formatInputDateDMY(startDate)} to {formatInputDateDMY(endDate)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total Orders"
            value={totalOrders}
            icon={<Package size={18} />}
            color="primary"
          />

          <StatCard
            label="Delivered / Shipped"
            value={deliveredOrders}
            icon={<CheckCircle size={18} />}
            color="success"
          />

          <StatCard
            label="Pending"
            value={pendingOrders}
            icon={<Clock size={18} />}
            color="warning"
          />

          <StatCard
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon={<DollarSign size={18} />}
            color="info"
          />

          <StatCard
            label="Cancelled Orders"
            value={cancelledOrders}
            icon={<XCircle size={18} />}
            color="danger"
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-6 rounded-3xl p-4 md:p-6"
        style={{
          background: "var(--amazon-bg-white)",
          border: "1px solid var(--amazon-border-light)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 rounded-2xl p-2.5"
              style={{
                background: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
                color: "var(--amazon-link-blue)",
              }}
            >
              <Filter size={18} />
            </div>

            <div>
              <h2
                className="text-base font-bold md:text-lg"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Order Filters & Export
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Filter orders by date, search, and status. Export filtered data
                anytime.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <button
              onClick={handleClearAllFilters}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 sm:w-auto"
              style={{
                background: "var(--amazon-bg-main)",
                color: "var(--amazon-text-primary)",
              }}
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>

            <button
              onClick={exportCsv}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 sm:w-auto"
              style={{
                background: "var(--amazon-success-strong)",
                color: "var(--amazon-text-white)",
              }}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 md:p-5"
          style={{
            border: "1px solid var(--amazon-border-light)",
            background: "color-mix(in srgb, var(--amazon-bg-main) 70%, white)",
          }}
        >
          <div className="mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              Fetch Orders by Date
            </h3>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              Select a date range to load orders from the API.
            </p>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-white)",
                  color: "var(--amazon-text-primary)",
                }}
              />
            </div>

            <div className="lg:col-span-4">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-white)",
                  color: "var(--amazon-text-primary)",
                }}
              />
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4 sm:flex-row">
              <button
                onClick={handleApplyFilter}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300"
                style={{
                  background: "var(--amazon-link-blue)",
                  color: "var(--amazon-text-white)",
                }}
              >
                <Search size={15} />
                Apply Filter
              </button>

              <button
                onClick={handleTodayFilter}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-300"
                style={{
                  background: "var(--amazon-bg-white)",
                  borderColor: "var(--amazon-border-medium)",
                  color: "var(--amazon-text-primary)",
                }}
              >
                <RefreshCcw size={15} />
                Today
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 md:p-5"
          style={{
            border: "1px solid var(--amazon-border-light)",
            background: "var(--amazon-bg-white)",
          }}
        >
          <div className="mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              Filter Visible Records
            </h3>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              Search and refine the currently loaded orders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Search
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by Order ID, channel, status..."
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-main)",
                  color: "var(--amazon-text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-main)",
                  color: "var(--amazon-text-primary)",
                }}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Shipped / Delivered</option>
                <option>Canceled</option>
                <option>Unshipped</option>
                <option>Partially Shipped</option>
                <option>Invoice Unconfirmed</option>
                <option>Unknown</option>
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Sales Channel
              </label>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-main)",
                  color: "var(--amazon-text-primary)",
                }}
              >
                {salesChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                Order Type
              </label>
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-300"
                style={{
                  borderColor: "var(--amazon-border-medium)",
                  background: "var(--amazon-bg-main)",
                  color: "var(--amazon-text-primary)",
                }}
              >
                {orderTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div
            className="rounded-full px-3 py-1.5 font-medium"
            style={{
              background: "var(--amazon-bg-main)",
              color: "var(--amazon-text-primary)",
            }}
          >
            Showing: {filteredOrders.length} orders
          </div>

          <div
            className="rounded-full px-3 py-1.5 font-medium"
            style={{
              background: "var(--amazon-success-soft)",
              color: "var(--amazon-success-strong)",
            }}
          >
            Filtered Revenue: ₹{filteredRevenue.toLocaleString("en-IN")}
          </div>

          <div
            className="rounded-full px-3 py-1.5 font-medium"
            style={{
              background: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
              color: "var(--amazon-link-blue)",
            }}
          >
            Status: {statusFilter}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="overflow-hidden rounded-3xl shadow-sm"
        style={{
          background: "var(--amazon-bg-white)",
          border: "1px solid var(--amazon-border-light)",
        }}
      >
        <div
          className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
          style={{
            borderBottom: "1px solid var(--amazon-border-light)",
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--amazon-bg-main) 70%, white), var(--amazon-bg-white))",
          }}
        >
          <div>
            <h3
              className="text-base font-bold md:text-lg"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              Order Records
            </h3>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              Detailed order listing with real-time status visibility
            </p>
          </div>

          <div
            className="text-sm font-medium"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            {loading
              ? "Loading orders..."
              : `Showing ${filteredOrders.length} of ${orders.length} orders`}
          </div>
        </div>

        {!loading && !error && filteredOrders.length === 0 ? (
          <div className="p-10 text-center md:p-14">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: "var(--amazon-bg-main)",
                color: "var(--amazon-text-secondary)",
              }}
            >
              <ShoppingBag size={24} />
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--amazon-text-primary)" }}
            >
              No Orders Found
            </h3>
            <p
              className="mt-2"
              style={{ color: "var(--amazon-text-secondary)" }}
            >
              No orders matched your current filters.
            </p>
          </div>
        ) : (
          <div className="p-2">
            <DynamicTable
              headers={headers}
              data={tableData}
              title=""
              loading={loading}
              hideTopHeader={true}
              hideCategoryFilter={true}
              hideDateFilter={true}
              filterKey="orderStatusRaw"
              dateKey="purchaseDateRaw"
              onDetailsOpen={fetchShippingAddress}
              showShippingAddress={true}
              shippingAddress={shippingAddress}
              shippingLoading={shippingLoading}
              shippingError={shippingError}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colorMap = {
    primary: {
      softBg: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
      softBorder: "color-mix(in srgb, var(--amazon-link-blue) 18%, white)",
      softText: "var(--amazon-link-blue)",
      accent: "linear-gradient(to right, var(--amazon-link-blue), var(--amazon-blue))",
    },
    success: {
      softBg: "var(--amazon-success-soft)",
      softBorder: "color-mix(in srgb, var(--amazon-success-strong) 18%, white)",
      softText: "var(--amazon-success-strong)",
      accent: "linear-gradient(to right, var(--amazon-success), var(--amazon-success-strong))",
    },
    warning: {
      softBg: "color-mix(in srgb, var(--amazon-btn-yellow) 45%, white)",
      softBorder: "color-mix(in srgb, var(--amazon-orange) 18%, white)",
      softText: "var(--amazon-orange)",
      accent: "linear-gradient(to right, var(--amazon-btn-yellow-hover), var(--amazon-orange))",
    },
    info: {
      softBg: "color-mix(in srgb, var(--amazon-link-blue) 8%, white)",
      softBorder: "color-mix(in srgb, var(--amazon-link-blue) 16%, white)",
      softText: "var(--amazon-link-blue)",
      accent: "linear-gradient(to right, var(--amazon-link-blue), var(--amazon-blue))",
    },
    danger: {
      softBg: "var(--amazon-danger-soft)",
      softBorder: "var(--amazon-danger-border)",
      softText: "var(--amazon-danger)",
      accent: "linear-gradient(to right, var(--amazon-danger), #fb7185)",
    },
  };

  const selected = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-2xl p-4 hover:shadow-md"
      style={{
        border: "1px solid var(--amazon-border-light)",
        background: "var(--amazon-bg-white)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--amazon-border-light), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, var(--amazon-bg-white), var(--amazon-bg-white), color-mix(in srgb, var(--amazon-bg-main) 80%, white))",
          opacity: 0.8,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            {label}
          </p>

          <h2
            className="mt-2 truncate text-lg font-bold leading-none md:text-xl"
            style={{ color: "var(--amazon-text-primary)" }}
          >
            {value}
          </h2>

          <div
            className="mt-3 h-1.5 w-14 overflow-hidden rounded-full"
            style={{ background: "var(--amazon-bg-main)" }}
          >
            <div
              className="h-full w-8 rounded-full"
              style={{ background: selected.accent }}
            />
          </div>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            background: selected.softBg,
            borderColor: selected.softBorder,
            color: selected.softText,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function getTodayInputDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDateRange(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T23:59:59.999Z`);

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  };
}

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status) {
  const value = String(status || "").toLowerCase();

  if (value === "canceled" || value === "cancelled") {
    return {
      background: "var(--amazon-danger-soft)",
      color: "var(--amazon-danger)",
      border: `1px solid var(--amazon-danger-border)`,
    };
  }

  if (value === "shipped" || value === "delivered") {
    return {
      background: "var(--amazon-success-soft)",
      color: "var(--amazon-success-strong)",
      border: `1px solid color-mix(in srgb, var(--amazon-success-strong) 18%, white)`,
    };
  }

  if (
    value === "pending" ||
    value === "unshipped" ||
    value === "partiallyshipped"
  ) {
    return {
      background: "color-mix(in srgb, var(--amazon-btn-yellow) 45%, white)",
      color: "var(--amazon-orange)",
      border: `1px solid color-mix(in srgb, var(--amazon-orange) 18%, white)`,
    };
  }

  return {
    background: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
    color: "var(--amazon-link-blue)",
    border: `1px solid color-mix(in srgb, var(--amazon-link-blue) 18%, white)`,
  };
}

function getStatusDotStyle(status) {
  const value = String(status || "").toLowerCase();

  if (value === "canceled" || value === "cancelled") {
    return "var(--amazon-danger)";
  }

  if (value === "shipped" || value === "delivered") {
    return "var(--amazon-success-strong)";
  }

  if (
    value === "pending" ||
    value === "unshipped" ||
    value === "partiallyshipped"
  ) {
    return "var(--amazon-orange)";
  }

  return "var(--amazon-link-blue)";
}

function formatInputDateDMY(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}