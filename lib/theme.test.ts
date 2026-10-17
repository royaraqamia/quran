import { describe, expect, it } from "vitest";
import { parseTheme, THEME_STORAGE_KEY, themeInitScript } from "@/lib/theme";

describe("parseTheme", () => {
  it("keeps explicit themes", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });

  it("falls back to system for anything else", () => {
    expect(parseTheme("system")).toBe("system");
    expect(parseTheme(null)).toBe("system");
    expect(parseTheme(undefined)).toBe("system");
    expect(parseTheme("")).toBe("system");
    expect(parseTheme("DARK")).toBe("system");
  });
});

describe("themeInitScript", () => {
  it("reads the persisted theme from localStorage", () => {
    expect(themeInitScript).toContain(JSON.stringify(THEME_STORAGE_KEY));
  });
});
