"use client";

import { RefreshCcw, PackageX, CheckCircle } from "lucide-react";
import DynamicTable from "@/app/components/DynamicTable";

export default function ReturnsPage() {

  const headers = [
    "Return ID",
    "Order ID",
    "Customer",
    "Product",
    "Reason",
    "Status",
    "Date"
  ];

  const returns = [
    {
      id: "RET1023",
      order: "ORD1023",
      customer: "Rahul Sharma",
      product: "Nike Air Max",
      reason: "Size Issue",
      status: "Pending",
      date: "12 Mar 2026"
    },
    {
      id: "RET1024",
      order: "ORD1030",
      customer: "Priya Mehta",
      product: "Sony Headphones",
      reason: "Defective",
      status: "Approved",
      date: "10 Mar 2026"
    },
    {
      id: "RET1025",
      order: "ORD1040",
      customer: "Amit Verma",
      product: "Logitech Mouse",
      reason: "Wrong Item",
      status: "Rejected",
      date: "8 Mar 2026"
    }
  ];

  const totalReturns = returns.length;
  const pendingReturns = returns.filter(r => r.status === "Pending").length;
  const approvedReturns = returns.filter(r => r.status === "Approved").length;

  return (
    <div
      className="p-8 min-h-screen space-y-8"
      style={{ background: "var(--amazon-bg-main)" }}
    >

      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--amazon-text-primary)" }}
        >
          Return Products
        </h1>
        <p style={{ color: "var(--amazon-text-secondary)" }}>
          Manage customer return requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div
          className="p-6 rounded-xl shadow border flex items-center gap-4"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)"
          }}
        >
          <RefreshCcw style={{ color: "var(--amazon-info)" }} size={28} />
          <div>
            <p style={{ color: "var(--amazon-text-secondary)" }}>
              Total Returns
            </p>
            <h2 style={{ color: "var(--amazon-text-primary)" }} className="text-xl font-bold">
              {totalReturns}
            </h2>
          </div>
        </div>

        <div
          className="p-6 rounded-xl shadow border flex items-center gap-4"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)"
          }}
        >
          <PackageX style={{ color: "var(--amazon-dark-orange)" }} size={28} />
          <div>
            <p style={{ color: "var(--amazon-text-secondary)" }}>
              Pending
            </p>
            <h2 style={{ color: "var(--amazon-text-primary)" }} className="text-xl font-bold">
              {pendingReturns}
            </h2>
          </div>
        </div>

        <div
          className="p-6 rounded-xl shadow border flex items-center gap-4"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)"
          }}
        >
          <CheckCircle style={{ color: "var(--amazon-success-strong)" }} size={28} />
          <div>
            <p style={{ color: "var(--amazon-text-secondary)" }}>
              Approved
            </p>
            <h2 style={{ color: "var(--amazon-text-primary)" }} className="text-xl font-bold">
              {approvedReturns}
            </h2>
          </div>
        </div>

      </div>

      {/* Table */}
      <div
        className="rounded-xl shadow border p-4"
        style={{
          background: "var(--amazon-bg-white)",
          borderColor: "var(--amazon-border-light)"
        }}
      >

        <DynamicTable
          headers={headers}
          data={returns.map((r) => ({
            "Return ID": (
              <span
                className="font-semibold"
                style={{ color: "var(--amazon-link-blue)" }}
              >
                {r.id}
              </span>
            ),
            "Order ID": r.order,
            Customer: r.customer,
            Product: r.product,
            Reason: r.reason,
            Status: (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background:
                    r.status === "Approved"
                      ? "var(--amazon-success-soft)"
                      : r.status === "Rejected"
                      ? "var(--amazon-danger-soft)"
                      : "#fff7ed",
                  color:
                    r.status === "Approved"
                      ? "var(--amazon-success-strong)"
                      : r.status === "Rejected"
                      ? "var(--amazon-danger)"
                      : "var(--amazon-dark-orange)"
                }}
              >
                {r.status}
              </span>
            ),
            Date: r.date
          }))}
          title="Return Requests"
        />

      </div>

    </div>
  );
}