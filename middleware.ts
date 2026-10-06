import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
 
// Define protected routes
const protectedRoutes = ["/dashboard", "/payment"]; // add your protected paths
const publicRoutes = ["/login", "/signup", "/email-verify"];
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
 
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isPublicRoutes = publicRoutes.includes(request.nextUrl.pathname);
 
  // Check if accessing dashboard without token
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
 
  // Check if accessing dashboard without ADMIN role
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    token &&
    userRole !== "admin"
  ) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }
 
  // Check if accessing other protected routes without token
  if (
    isProtected &&
    !token &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
 
  if (isPublicRoutes && token) {
    // If user is ADMIN, redirect to dashboard
    if (userRole === "admin") {
      const dashUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashUrl);
    }
    // If user is not ADMIN, allow access to public routes
  }
 
  return NextResponse.next();
}