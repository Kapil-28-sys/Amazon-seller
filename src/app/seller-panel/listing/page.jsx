"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Inbox,
  AlertCircle,
  BadgeIndianRupee,
  LayoutGrid,
} from "lucide-react";
import DynamicTable from "@/app/components/DynamicTable";

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

  const uniqueBrands = [
    ...new Set(products.map((item) => item.brand).filter(Boolean)),
  ].length;

  return (
    <div
      className="min-h-screen px-4 pt-8 pb-8 sm:px-6 lg:px-6"
      style={{
        backgroundColor: "var(--amazon-bg-main)",
        color: "var(--amazon-text-primary)",
      }}
    >
      <div className="w-full space-y-6">
        {/* HEADER */}
        <div
          className="rounded-2xl border px-6 py-5 shadow-sm"
          style={{
            backgroundColor: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)",
          }}
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div
                className="mt-2 rounded-2xl p-5 shadow-sm"
                style={{
                  backgroundColor: "var(--amazon-blue)",
                  color: "var(--amazon-text-white)",
                }}
              >
                <Package size={24} />
              </div>

              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--amazon-link-blue)" }}
                >
                  Seller Central
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Product Catalog
                </h1>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--amazon-text-secondary)" }}
                >
                  Manage listings, track product details, and maintain your
                  seller inventory with ease.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                <h3 className="mt-1 text-2xl font-bold">{products.length}</h3>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--amazon-btn-orange) 14%, white)",
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
                <h3 className="mt-1 text-2xl font-bold">{uniqueBrands}</h3>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--amazon-link-blue) 12%, white)",
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
                <h3 className="mt-1 text-2xl font-bold">Updated</h3>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--amazon-btn-yellow) 45%, white)",
                  color: "var(--amazon-dark-orange)",
                }}
              >
                <BadgeIndianRupee size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div
          className="overflow-hidden rounded-2xl border shadow-sm"
          style={{
            backgroundColor: "var(--amazon-bg-white)",
            borderColor: "var(--amazon-border-light)",
          }}
        >
          <div
            className="border-b px-6 py-4"
            style={{
              backgroundColor: "var(--amazon-blue)",
              borderColor: "var(--amazon-border-light)",
            }}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--amazon-danger-soft)",
                }}
              >
                <AlertCircle
                  size={32}
                  style={{ color: "var(--amazon-danger)" }}
                />
              </div>
              <h3 className="text-lg font-semibold">Error loading products</h3>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--amazon-text-secondary)" }}
              >
                {error}
              </p>
            </div>
          ) : !loading && products.length === 0 ? (
            <div className="py-24 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--amazon-bg-main)",
                }}
              >
                <Inbox
                  size={32}
                  style={{ color: "var(--amazon-text-secondary)", opacity: 0.5 }}
                />
              </div>

              <h3 className="text-lg font-semibold">No products found</h3>
              <p
                className="mt-1 text-sm"
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