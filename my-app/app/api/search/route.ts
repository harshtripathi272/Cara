import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "../../lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [], count: 0 });
  }

  try {
    const results = await searchProducts(query, limit);
    return NextResponse.json({ results, count: results.length });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
