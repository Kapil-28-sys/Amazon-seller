import { NextResponse } from "next/server";
import { apiFetch } from "../Baseurl/apiFetch";

export async function GET() {
  try {
    const data = await apiFetch("/api/inventory/A1U887FZM7557Z");

    const products =
      data?.items?.map((item, index) => {
        const summary = item?.summaries?.[0] || {};

        return {
          id: index + 1,
          itemName: summary?.itemName || "N/A",
          createdDate: summary?.createdDate || "N/A",
          skuNo: item?.sku || "N/A",
          mainImg: summary?.mainImage?.link || "",
        };
      }) || [];

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inventory API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error while fetching inventory data",
      },
      { status: 500 }
    );
  }
}