"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Inbox, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] px-4 pt-8 pb-8 sm:px-6 lg:px-10 font-sans text-slate-900">
      <div className="w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-xl text-indigo-600">
              <Package size={24} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Product Catalog
              </h1>
              <p className="text-sm text-slate-500">
                Manage and monitor your inventory
              </p>
            </div>
          </div>

          <Link
            href="/listing/add"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {!loading && error ? (
            <div className="py-24 text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">Error loading products</h3>
              <p className="text-slate-500 text-sm mt-1">{error}</p>
            </div>
          ) : !loading && products.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox size={32} className="text-slate-300" />
              </div>

              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-slate-500 text-sm mt-1">
                No product data available
              </p>
            </div>
          ) : (
            <DynamicTable
              headers={headers}
              tableKeys={headers}
              data={products}
              loading={loading}
              filterKey="brand"
              title="Products"
            />
          )}
        </div>
      </div>
    </div>
  );
}