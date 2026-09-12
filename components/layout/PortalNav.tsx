"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flag,
  Inbox,
  LayoutDashboard,
  Package,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared navigation for the authenticated-style portals (vendor, admin).
 *
 * Icons are addressed by name rather than passed as components because a Server
 * Component cannot hand a component reference to a Client Component — it is not
 * serialisable. A string key keeps the nav definition as plain data on the server while
 * the icon map stays here.
 */
const ICONS = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  package: Package,
  star: Star,
  shield: ShieldCheck,
  search: Search,
  users: Users,
  flag: Flag,
} as const;

export interface PortalNavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  count?: number;
}

export function PortalNav({ items, ariaLabel }: { items: PortalNavItem[]; ariaLabel: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel}>
      <ul className="space-y-0.5">
        {items.map((item) => {
          // The portal root would otherwise match every nested route as "active".
          const isRoot = item.href.split("/").filter(Boolean).length === 1;
          const active = isRoot ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = ICONS[item.icon];

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-control px-2.5 py-2 text-13 font-medium transition-colors",
                  active
                    ? "bg-primary-subtle text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={cn(
                      "shrink-0 rounded-pill px-1.5 text-2xs font-semibold tnum",
                      active ? "bg-primary/15" : "bg-muted",
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
