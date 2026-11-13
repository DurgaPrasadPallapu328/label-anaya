import { NextResponse, type NextRequest } from "next/server";
import { categories } from "@/lib/categories";

// Cache Components streams page-level notFound responses. Reject unknown
// categories before rendering so their response also carries HTTP status 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!categories.some((category) => category.slug === slug)) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/shop/:category" };
