// Server-side admin logout route — clears the cookie and redirects.

import { redirect } from "next/navigation";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function GET() {
  await clearAdminCookie();
  redirect("/admin");
}