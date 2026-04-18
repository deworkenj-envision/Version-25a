import { NextResponse } from "next/server";

const ADMIN_COOKIE = "envision_admin_auth";

export function proxy(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
    if (
      pathname === "/admin/login" ||
      pathname === "/api/admin/login"
    ) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || cookie !== expected) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};