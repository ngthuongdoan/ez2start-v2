import { cookies } from "next/headers";

// Server-only cookie functions
export function setTokenCookie(token: string) {
  cookies().set("token", token, {
    httpOnly: true, // Secure server-side only
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function removeTokenCookie() {
  cookies().set("token", "", { maxAge: -1, path: "/" });
}

export function getTokenCookie() {
  return cookies().get("token")?.value;
}
