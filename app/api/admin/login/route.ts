import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_TTL_MS, signCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!password || !secret) {
    return new Response("admin not configured", { status: 503 });
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== password) {
    await new Promise((r) => setTimeout(r, 250));
    return new Response("unauthorized", { status: 401 });
  }

  const expiresAt = Date.now() + ADMIN_COOKIE_TTL_MS;
  const value = await signCookie(secret, expiresAt);
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });

  return Response.json({ ok: true });
}
