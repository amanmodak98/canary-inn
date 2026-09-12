import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  return <LoginForm />;
}