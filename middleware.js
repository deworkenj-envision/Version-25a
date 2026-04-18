import { NextResponse } from "next/server";

const ADMIN_COOKIE = "envision_admin_auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect admin pages + admin APIs
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
    // Allow login route
    if (
      pathname === "/admin/login" ||
      pathname === "/api/admin/login"
    ) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || cookie !== expected) {
      // API requests
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      // Page requests
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};