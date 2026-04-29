import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyCookie } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/admin/login" || path === "/api/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) {
    return new NextResponse("admin not configured (set ADMIN_COOKIE_SECRET)", {
      status: 503,
    });
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyCookie(secret, cookie);
  if (ok) return NextResponse.next();

  if (path.startsWith("/api/")) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  const login = new URL("/admin/login", req.url);
  if (path !== "/admin") login.searchParams.set("next", path);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
