import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoomsManager from "@/components/admin/RoomsManager";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  const rooms = await prisma.room.findMany({ orderBy: { displayOrder: "asc" } });
  return (
    <div className="p-6 lg:p-10">
      <div className="eyebrow text-ash">Operations</div>
      <h1 className="mt-2 font-serif text-3xl text-coal">Rooms</h1>
      <div className="mt-8">
        <RoomsManager initial={rooms.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          description: r.description,
          maxGuests: r.maxGuests,
          sizeSqft: r.sizeSqft,
          bedType: r.bedType,
          basePricePaise: r.basePricePaise,
          heroImage: r.heroImage,
          active: r.active,
        }))} />
      </div>
    </div>
  );
}