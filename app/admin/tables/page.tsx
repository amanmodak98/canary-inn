import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TablesManager from "@/components/admin/TablesManager";

export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const tables = await prisma.table.findMany({
    orderBy: [{ active: "desc" }, { label: "asc" }],
    include: { qrTokens: { where: { active: true }, take: 1, orderBy: { createdAt: "desc" } } },
  });

  const initial = tables.map((t) => ({
    id: t.id,
    label: t.label,
    slug: t.slug,
    zone: t.zone,
    active: t.active,
    token: t.qrTokens[0]?.token ?? null,
  }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow text-ash">Operations</div>
          <h1 className="mt-2 font-serif text-3xl text-coal">Tables & QR codes</h1>
          <p className="mt-2 text-coal/70 max-w-2xl text-sm">
            Each table gets a unique, non-guessable QR token. Disable a table without deleting it; regenerate a token if you suspect it's leaked. Download and print each QR for the table.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <TablesManager initial={initial} />
      </div>
    </div>
  );
}