import {
  BarChart3,
  Calculator,
  Code,
  Database,
  Factory,
  FileText,
  Headphones,
  Layers,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Palette,
  Server,
  ShieldCheck,
  ShoppingCart,
  SquareKanban,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Category icons are stored as strings in the dataset (they are data, not code), so
 * they resolve through this explicit map. An unknown name degrades to a neutral icon
 * rather than throwing — a missing icon must never take a page down.
 */
const ICONS: Record<string, LucideIcon> = {
  Users,
  SquareKanban,
  Megaphone,
  Headphones,
  UserCog,
  Calculator,
  BarChart3,
  ShoppingCart,
  Server,
  ShieldCheck,
  MessageSquare,
  Palette,
  Database,
  Factory,
  Code,
  FileText,
  Layers,
  Wrench,
  LayoutGrid,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutGrid;
  return <Icon className={cn("size-4", className)} aria-hidden="true" strokeWidth={1.75} />;
}
