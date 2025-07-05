// Client-side cookie utilities using cookies-next
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export function setTokenCookieClient(token: string) {
  setCookie('token', token, {
    httpOnly: false, // Client-side accessible
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function removeTokenCookieClient() {
  deleteCookie('token', { path: '/' });
}

export function getTokenCookieClient() {
  return getCookie('token') as string | undefined;
}