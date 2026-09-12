import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  UtensilsCrossed,
  QrCode,
  BedDouble,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: ClipboardList },
  { href: "/admin/kitchen", label: "Kitchen", Icon: ChefHat },
  { href: "/admin/menu", label: "Menu", Icon: UtensilsCrossed },
  { href: "/admin/tables", label: "Tables & QR", Icon: QrCode },
  { href: "/admin/rooms", label: "Rooms", Icon: BedDouble },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  // Allow /admin (login) to render without a session.
  if (!session) {
    return <div className="min-h-screen bg-coal text-ivory">{children}</div>;
  }
  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-coal/10 bg-coal text-ivory">
        <div className="px-6 py-6 border-b border-ivory/10">
          <Link href="/admin/dashboard" className="block">
            <div className="font-serif text-xl tracking-tightest">Canary Inn</div>
            <div className="text-eyebrow uppercase tracking-widest text-ivory/60">Staff Console</div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-ivory/85 hover:bg-ivory/10 hover:text-ivory"
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-ivory/10">
          <div className="px-3 py-2 text-xs">
            <div className="text-ivory/85 font-medium truncate">{session.name}</div>
            <div className="text-ivory/55 truncate">{session.email}</div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              formAction="/api/admin/logout"
              className="w-full flex items-center gap-2 px-3 py-2 text-ivory/70 hover:text-ivory text-sm"
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-coal text-ivory px-4 py-3 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-serif text-lg">Canary Inn · Staff</Link>
          <div className="text-eyebrow uppercase tracking-widest text-ivory/60">{session.email}</div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}