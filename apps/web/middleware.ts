import { NextResponse, type NextRequest } from "next/server";
// If you can decode the token to read role, import a tiny decoder here.

const PROTECTED = [/^\/trips(\/|$)/, /^\/dashboard(\/|$)/, /^\/admin(\/|$)/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some((r) => r.test(pathname));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // OPTIONAL: if you can read role (either via a "role" cookie or decoding token)
  const roleCookie = req.cookies.get("role")?.value; // set this on login if possible
  const role = roleCookie?.toLowerCase();

  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/trips/list"; // redirect non-admins to customer home
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trips/:path*", "/dashboard/:path*", "/admin/:path*"],
};
