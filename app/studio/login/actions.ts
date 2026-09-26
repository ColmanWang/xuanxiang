"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export async function signOutOfStudio() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/studio/login");
}
