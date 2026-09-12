// Edge middleware that protects /admin/* by checking the admin cookie.
// Server components still re-check via getAdminSession() so this is defense-in-depth.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "ci_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/** except the login page itself.
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin") return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};