"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getStudioOAuthConfig } from "@/lib/auth/config";

export async function signInToStudio() {
  const oauth = getStudioOAuthConfig();
  if (!oauth) redirect("/studio/login?error=not-configured");
  const result = await auth.api.signInSocial({
    headers: await headers(),
    body: { provider: oauth.provider, callbackURL: "/studio", errorCallbackURL: "/studio/login?error=oauth" },
  });
  if (!result.url) redirect("/studio/login?error=oauth");
  redirect(result.url);
}

export async function signOutOfStudio() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/studio/login");
}
