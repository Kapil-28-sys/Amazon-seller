import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://amazon-node-api-a4i2.onrender.com/api/inventory/A1U887FZM7557Z",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch inventory data from external API",
        },
        { status: res.status }
      );
    }

    const data = await res.json();

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
        message: "Server error while fetching inventory data",
      },
      { status: 500 }
    );
  }
}