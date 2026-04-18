import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "envision_admin_auth";

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_PASSWORD || "";
  return Boolean(expected) && authCookie === expected;
}