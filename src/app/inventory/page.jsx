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
              className="h-20 w-20 object-cover rounded-lg border"
            />
          ) : (
            "No Image"
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
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="animate-pulse space-y-6">

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center gap-6 border-b pb-4"
              >
                {/* Image skeleton */}
                <div className="h-20 w-20 bg-slate-200 rounded-lg"></div>

                {/* Item name */}
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>

                {/* Date */}
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>

                {/* SKU */}
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
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
      <div className="p-6">
        <div className="bg-red-50 text-red-600 rounded-2xl border border-red-200 p-6">
          {error}
        </div>
      </div>
    );
  }

  /* ================= TABLE ================= */

  return (
    <DynamicTable
      title="Inventory"
      headers={headers}
      data={products}
      filterKey="SKU No"
      dateKey="date"
    />
  );
}