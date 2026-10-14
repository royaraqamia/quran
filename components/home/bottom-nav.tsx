"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "الرئيسية" },
  { id: "achievements", label: "الإنجازات" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function BottomNav() {
  const [active, setActive] = useState<TabId>("home");

  return (
    <nav className="bg-muted fixed inset-x-0 bottom-5 mx-auto flex w-fit items-center gap-1 rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-current={active === tab.id ? "page" : undefined}
          onClick={() => setActive(tab.id)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm transition-colors",
            active === tab.id
              ? "bg-card border-border/70 border font-medium shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
