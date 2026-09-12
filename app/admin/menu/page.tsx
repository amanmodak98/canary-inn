import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MenuManager from "@/components/admin/MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.menuItem.findMany({
      orderBy: [{ categoryId: "asc" }, { displayOrder: "asc" }],
    }),
  ]);

  const initial = {
    categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    items: items.map((i) => ({
      id: i.id,
      categoryId: i.categoryId,
      name: i.name,
      description: i.description,
      pricePaise: i.pricePaise,
      isVeg: i.isVeg,
      isAvailable: i.isAvailable,
      active: i.active,
      imageUrl: i.imageUrl,
    })),
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="eyebrow text-ash">Operations</div>
      <h1 className="mt-2 font-serif text-3xl text-coal">Menu</h1>
      <p className="mt-2 text-coal/70 max-w-2xl text-sm">
        Toggle availability, edit prices and descriptions, and add new items. Changes are reflected immediately on the guest menu.
      </p>
      <div className="mt-8">
        <MenuManager initial={initial} />
      </div>
    </div>
  );
}