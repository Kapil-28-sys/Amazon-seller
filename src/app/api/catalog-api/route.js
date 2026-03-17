import { NextResponse } from "next/server";

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function GET() {
  try {
    const res = await fetch(
      "https://amazon-node-api-a4i2.onrender.com/catalog/B08N5WRWNW",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch external API",
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    const products =
      data?.items?.flatMap((item) =>
        (item?.summaries || []).map((summary, index) => ({
          id: `${item.asin}-${index}`,
          asin: item.asin || "N/A",
          brand: summary?.brand || "N/A",
          browseClassification:
            summary?.browseClassification?.displayName || "N/A",
          color: summary?.color || "N/A",
          itemClassification: summary?.itemClassification || "N/A",
          itemName: summary?.itemName || "N/A",
          manufacturer: summary?.manufacturer || "N/A",
          modelNumber: summary?.modelNumber || "N/A",
          releaseDate: formatDate(summary?.releaseDate),
          style: summary?.style || "N/A",
        }))
      ) || [];

    return NextResponse.json(
      {
        success: true,
        message: "Catalog data fetched successfully",
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Catalog API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}