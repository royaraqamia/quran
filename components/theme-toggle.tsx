"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  isDarkTheme,
  isDarkThemeOnServer,
  setTheme,
  subscribeToTheme,
} from "@/lib/theme";

/**
 * Light/dark switch. "system" stays the default until the switch is first
 * flipped, after which the choice is explicit and persisted.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    isDarkTheme,
    isDarkThemeOnServer,
  );

  return (
    <div className="flex h-11 shrink-0 items-center gap-2">
      <Sun className="text-muted-foreground size-4" aria-hidden="true" />
      <Switch
        checked={dark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="الوضع الداكن"
      />
      <Moon className="text-muted-foreground size-4" aria-hidden="true" />
    </div>
  );
}
