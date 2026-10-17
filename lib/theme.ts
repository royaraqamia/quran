export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

/** Notifies subscribers when the resolved theme may have changed. */
const THEME_CHANGE_EVENT = "themechange";

/** Narrows an arbitrary stored value to a supported theme. */
export function parseTheme(value: string | null | undefined): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

/**
 * Runs before first paint so the persisted theme is applied without a flash.
 * Kept as a plain string because it is inlined into the document.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=t==="dark"||t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    return parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Resolves a theme to the concrete scheme that should be displayed. */
export function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;
}

/** Writes the resolved theme to <html> so tokens and native UI follow it. */
export function applyTheme(theme: Theme): void {
  const dark = resolveTheme(theme) === "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

/** Persists an explicit theme and applies it immediately. */
export function setTheme(theme: Theme): void {
  try {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); ignore.
  }

  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Current scheme, derived from the persisted theme and the OS preference. */
export function isDarkTheme(): boolean {
  return resolveTheme(getStoredTheme()) === "dark";
}

/** SSR/hydration snapshot: always light, corrected right after hydration. */
export function isDarkThemeOnServer(): boolean {
  return false;
}

/**
 * Subscribes to every source that can change the theme: this tab, other tabs,
 * and the OS colour-scheme preference.
 */
export function subscribeToTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    applyTheme(getStoredTheme());
    onChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  media.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
    media.removeEventListener("change", handleChange);
  };
}
