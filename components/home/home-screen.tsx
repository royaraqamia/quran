"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchSurahs } from "@/lib/surahs";
import { BottomNav } from "@/components/home/bottom-nav";
import { GoalCard, type Goal } from "@/components/home/goal-card";
import { SurahList } from "@/components/home/surah-list";
import { ThemeToggle } from "@/components/theme-toggle";

export function HomeScreen({ goal }: { goal: Goal }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSurahs(query), [query]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-28">
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن سورة أو آية..."
            className="border-border/70 placeholder:text-muted-foreground focus-visible:border-ring h-11 w-full rounded-xl border bg-transparent ps-10 pe-4 text-sm outline-none"
          />
        </div>

        <ThemeToggle />
      </div>

      <div className="px-4 pt-3 pb-2">
        <GoalCard goal={goal} />
      </div>

      <SurahList surahs={results} />

      <BottomNav />
    </div>
  );
}
