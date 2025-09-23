// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [/^\/trips(\/|$)/, /^\/dashboard(\/|$)/, /^\/admin(\/|$)/];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const needsAuth = PROTECTED.some((re) => re.test(pathname));
  if (!needsAuth) return NextResponse.next();

  // If either access or refresh is present, let the page load.
  // Your client can refresh the token if only refresh exists.
  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  if (!access && !refresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // Optional: role-gate admin
  const role = req.cookies.get("role")?.value?.toLowerCase();
  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/trips/list";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only run on the sections we care about
  matcher: ["/trips/:path*", "/dashboard/:path*", "/admin/:path*"],
};
