"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Inbox,
  AlertCircle,
  BadgeIndianRupee,
  LayoutGrid,
} from "lucide-react";
import DynamicTable from "@/app/components/DynamicTable";
import Link from "next/link";

export default function ListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = [
    "brand",
    "itemName",
    "color",
    "manufacturer",
    "releaseDate",
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/catalog-api", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to load product data.");
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Unable to load product data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div
      className="min-h-screen px-4 pt-8 pb-8 sm:px-6 lg:px-6"
      style={{ backgroundColor: "var(--amazon-bg-main)", color: "var(--amazon-text-primary)" }}
    >
      <div className="w-full space-y-6">
        {/* HEADER */}
        <div
          className="rounded-2xl border shadow-sm px-6 py-5"
          style={{
            backgroundColor: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="p-5 mt-2 rounded-2xl shadow-sm"
                style={{
                  backgroundColor: "var(--amazon-blue)",
                  color: "var(--amazon-text-white)",
                }}
              >
                <Package size={24} />
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-1"
                  style={{ color: "var(--amazon-link-blue)" }}
                >
                  Seller Central
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Product Catalog
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Manage listings, track product details, and maintain your
                  seller inventory with ease.
                </p>
              </div>
            </div>

            <Link
              href="/listing/add"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--amazon-orange)",
                color: "var(--amazon-text-white)",
              }}
            >
              <Plus size={18} />
              Add New Product
            </Link>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              backgroundColor: "var(--amazon-bg-white)",
              borderColor: "var(--amazon-border-light)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Total Products
                </p>
                <h3 className="text-2xl font-bold mt-1">{products.length}</h3>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "#fff3e6",
                  color: "var(--amazon-orange)",
                }}
              >
                <LayoutGrid size={22} />
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              backgroundColor: "var(--amazon-bg-white)",
              borderColor: "var(--amazon-border-light)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Active Brands
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {[...new Set(products.map((item) => item.brand).filter(Boolean))]
                    .length}
                </h3>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "#eaf3ff",
                  color: "var(--amazon-link-blue)",
                }}
              >
                <Package size={22} />
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              backgroundColor: "var(--amazon-bg-white)",
              borderColor: "var(--amazon-border-light)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Catalog Status
                </p>
                <h3 className="text-2xl font-bold mt-1">Updated</h3>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "#fff7cc",
                  color: "#b7791f",
                }}
              >
                <BadgeIndianRupee size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div
          className="rounded-2xl border shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: "var(--amazon-blue)",
              borderColor: "var(--amazon-border-light)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--amazon-text-white)" }}
                >
                  Product Listings
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  View and manage all listed catalog products
                </p>
              </div>
            </div>
          </div>

          {!loading && error ? (
            <div className="py-24 text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">Error loading products</h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                {error}
              </p>
            </div>
          ) : !loading && products.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox size={32} className="text-slate-300" />
              </div>

              <h3 className="text-lg font-semibold">No products found</h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                No product data available
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              <DynamicTable
                headers={headers}
                tableKeys={headers}
                data={products}
                loading={loading}
                filterKey="brand"
                dateKey="releaseDate"
                title="Products"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}