// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isProfileComplete = token?.profileComplete;
    
    const path = req.nextUrl.pathname;
    const isAdminPath = path.startsWith("/admin");
    const requiresCompleteProfile = 
      !path.startsWith("/complete-profile") && 
      !path.startsWith("/api") &&
      path !== "/signin" &&
      path !== "/signup";

    // Redirect non-admin users trying to access admin paths
    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Redirect users with incomplete profiles
    if (requiresCompleteProfile && !isProfileComplete) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    // Add other protected routes here
  ]
};