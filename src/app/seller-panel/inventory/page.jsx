"use client";

import { useEffect, useState } from "react";
import DynamicTable from "@/app/components/DynamicTable";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = ["Main Image", "Item Name", "Created Date", "SKU No"];

  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/inventory-api", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load inventory.");
        }

        const formattedData = (data.products || []).map((item) => ({
          "Main Image": item.mainImg ? (
            <img
              src={item.mainImg}
              alt={item.itemName}
              className="h-20 w-20 rounded-lg object-cover border"
              style={{ borderColor: "var(--amazon-border-light)" }}
            />
          ) : (
            <span style={{ color: "var(--amazon-text-secondary)" }}>
              No Image
            </span>
          ),
          "Item Name": item.itemName,
          "Created Date":
            item.createdDate !== "N/A"
              ? new Date(item.createdDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
          "SKU No": item.skuNo,
          date: item.createdDate !== "N/A" ? item.createdDate : "",
        }));

        setProducts(formattedData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  /* ================= SKELETON LOADER ================= */
  if (loading) {
    return (
      <div
        className="p-6"
        style={{ background: "var(--amazon-bg-main)" }}
      >
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)",
          }}
        >
          <div className="animate-pulse space-y-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center gap-6 border-b pb-4"
                style={{ borderColor: "var(--amazon-border-light)" }}
              >
                {/* Image skeleton */}
                <div
                  className="h-20 w-20 rounded-lg"
                  style={{ background: "var(--amazon-border-light)" }}
                />

                {/* Item name */}
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ background: "var(--amazon-border-light)" }}
                />

                {/* Date */}
                <div
                  className="h-4 w-1/2 rounded"
                  style={{ background: "var(--amazon-border-light)" }}
                />

                {/* SKU */}
                <div
                  className="h-4 w-1/3 rounded"
                  style={{ background: "var(--amazon-border-light)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div
        className="p-6"
        style={{ background: "var(--amazon-bg-main)" }}
      >
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "var(--amazon-danger-soft)",
            color: "var(--amazon-danger)",
            borderColor: "var(--amazon-danger-border)",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  /* ================= TABLE ================= */
  return (
    <div style={{ background: "var(--amazon-bg-main)" }}>
      <DynamicTable
        title="Inventory"
        headers={headers}
        data={products}
        filterKey="SKU No"
        dateKey="date"
      />
    </div>
  );
}