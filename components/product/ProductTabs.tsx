"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/**
 * Sticky product tab bar with scroll spy.
 *
 * Tabs are anchors rather than routes: the whole profile is one crawlable document, and
 * a buyer can deep-link to a section without a full navigation. The scroll spy uses
 * IntersectionObserver against a header-height root margin so the active tab matches
 * what is actually under the sticky header, not what is technically intersecting.
 */
export function ProductTabs({ tabs, className }: { tabs: TabItem[]; className?: string }) {
  const [active, setActive] = React.useState(tabs[0]?.id ?? "");

  React.useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // Offset for the sticky header + tab bar so the active tab is the section
        // the reader is actually looking at.
        rootMargin: "-140px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [tabs]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active);
    if (index < 0) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const target = tabs[nextIndex];
    if (!target) return;
    setActive(target.id);
    document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById(`tab-${target.id}`)?.focus();
  };

  return (
    <div
      className={cn(
        "sticky top-14 z-30 -mx-4 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Product sections"
        onKeyDown={onKeyDown}
        className="scroll-rail flex gap-1 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <a
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              href={`#${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-13 font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-2xs tnum",
                    isActive ? "text-muted-foreground" : "text-faint",
                  )}
                >
                  {tab.count.toLocaleString("en-US")}
                </span>
              )}
              {/* 2px accent underline, per the design system — not a filled pill. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors",
                  isActive ? "bg-primary" : "bg-transparent",
                )}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
