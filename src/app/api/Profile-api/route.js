export async function GET() {
  try {
    const response = await fetch(
      "https://amazon-node-api-a4i2.onrender.com/amazonTest",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `Failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error.message || "Server fetch failed" },
      { status: 500 }
    );
  }
}