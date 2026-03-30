"use client";

import {
  DollarSign,
  Clock,
  CheckCircle,
  Download,
} from "lucide-react";
import DynamicTable from "@/app/components/DynamicTable";

export default function PaymentsPage() {
  const headers = [
    "Order ID",
    "Customer",
    "Orders",
    "Amount",
    "Payment Status",
    "Date",
  ];

  const data = [
    {
      orderId: "ORD1023",
      customer: "Rahul Sharma",
      orders: 3,
      amount: "$320",
      status: "Paid",
      date: "12 Mar 2026",
    },
    {
      orderId: "ORD1024",
      customer: "Priya Mehta",
      orders: 1,
      amount: "$120",
      status: "Pending",
      date: "11 Mar 2026",
    },
    {
      orderId: "ORD1025",
      customer: "Amit Verma",
      orders: 5,
      amount: "$850",
      status: "Paid",
      date: "10 Mar 2026",
    },
    {
      orderId: "ORD1026",
      customer: "Neha Kapoor",
      orders: 2,
      amount: "$210",
      status: "Pending",
      date: "9 Mar 2026",
    },
  ];

  const totalRevenue = "$1,290";
  const pendingPayments = "$330";
  const completedPayments = "$960";

  return (
    <div
      className="min-h-screen space-y-8 p-8"
      style={{
        background: "var(--amazon-bg-main)",
        color: "var(--amazon-text-primary)",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--amazon-text-primary)" }}
          >
            Payments
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            Monitor your transactions and payout history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all"
            style={{
              background: "var(--amazon-bg-white)",
              borderColor: "var(--amazon-border-light)",
              color: "var(--amazon-text-primary)",
            }}
          >
            <Download size={16} />
            Export
          </button>

          <button
            className="rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-all"
            style={{
              background: "var(--amazon-link-blue)",
              color: "var(--amazon-text-white)",
              boxShadow: "0 4px 12px color-mix(in srgb, var(--amazon-link-blue) 20%, transparent)",
            }}
          >
            View Reports
          </button>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Revenue */}
        <div
          className="group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "color-mix(in srgb, var(--amazon-border-light) 55%, white)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Total Revenue
              </p>
              <h2
                className="mt-2 text-3xl font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                {totalRevenue}
              </h2>
            </div>

            <div
              className="rounded-xl p-3 transition-transform group-hover:scale-110"
              style={{
                background: "var(--amazon-success-soft)",
                color: "var(--amazon-success-strong)",
              }}
            >
              <DollarSign size={24} />
            </div>
          </div>

          <div
            className="mt-4 flex items-center text-xs font-medium"
            style={{ color: "var(--amazon-success-strong)" }}
          >
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div
          className="group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "color-mix(in srgb, var(--amazon-border-light) 55%, white)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Pending
              </p>
              <h2
                className="mt-2 text-3xl font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                {pendingPayments}
              </h2>
            </div>

            <div
              className="rounded-xl p-3 transition-transform group-hover:scale-110"
              style={{
                background: "color-mix(in srgb, var(--amazon-btn-yellow) 40%, white)",
                color: "var(--amazon-orange)",
              }}
            >
              <Clock size={24} />
            </div>
          </div>

          <div
            className="mt-4 flex items-center text-xs font-medium"
            style={{ color: "var(--amazon-text-secondary)" }}
          >
            <span>Awaiting bank verification</span>
          </div>
        </div>

        {/* Completed Payments */}
        <div
          className="group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "color-mix(in srgb, var(--amazon-border-light) 55%, white)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                Completed
              </p>
              <h2
                className="mt-2 text-3xl font-bold"
                style={{ color: "var(--amazon-text-primary)" }}
              >
                {completedPayments}
              </h2>
            </div>

            <div
              className="rounded-xl p-3 transition-transform group-hover:scale-110"
              style={{
                background: "color-mix(in srgb, var(--amazon-link-blue) 10%, white)",
                color: "var(--amazon-link-blue)",
              }}
            >
              <CheckCircle size={24} />
            </div>
          </div>

          <div
            className="mt-4 flex items-center text-xs font-medium"
            style={{ color: "var(--amazon-link-blue)" }}
          >
            <span>Successfully settled</span>
          </div>
        </div>
      </div>

      {/* Table Section Wrap */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{
          background: "var(--amazon-bg-white)",
          borderColor: "color-mix(in srgb, var(--amazon-border-light) 55%, white)",
        }}
      >
        <div
          className="flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-center"
          style={{
            borderColor: "color-mix(in srgb, var(--amazon-border-light) 35%, white)",
          }}
        >
          <h3
            className="text-lg font-bold"
            style={{ color: "var(--amazon-text-primary)" }}
          >
            Recent Transactions
          </h3>
        </div>

        <div className="p-2">
          <DynamicTable
            headers={headers}
            data={data.map((item) => ({
              "Order ID": (
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--amazon-link-blue)",
                  }}
                >
                  {item.orderId}
                </span>
              ),
              Customer: (
                <span style={{ color: "var(--amazon-text-primary)" }}>
                  {item.customer}
                </span>
              ),
              Orders: item.orders,
              Amount: (
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--amazon-text-primary)",
                  }}
                >
                  {item.amount}
                </span>
              ),
              "Payment Status": (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                  style={
                    item.status === "Paid"
                      ? {
                          background: "var(--amazon-success-soft)",
                          color: "var(--amazon-success-strong)",
                        }
                      : {
                          background: "var(--amazon-danger-soft)",
                          color: "var(--amazon-danger)",
                        }
                  }
                >
                  <span
                    className="mr-1.5 h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        item.status === "Paid"
                          ? "var(--amazon-success-strong)"
                          : "var(--amazon-danger)",
                    }}
                  />
                  {item.status}
                </span>
              ),
              Date: (
                <span style={{ color: "var(--amazon-text-secondary)" }}>
                  {item.date}
                </span>
              ),
            }))}
            title=""
          />
        </div>
      </div>
    </div>
  );
}