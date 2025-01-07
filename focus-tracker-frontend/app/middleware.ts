// app/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);

  // Add a custom header to identify mobile devices
  const response = NextResponse.next();
  response.headers.set("X-Is-Mobile", isMobile ? "true" : "false");

  return response;
}

export const config = {
  matcher: "/",
};
