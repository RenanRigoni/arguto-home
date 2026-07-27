import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/legacy/search";

export async function GET(request: NextRequest) {
  const term = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const suggestions = await searchProducts(term);
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
