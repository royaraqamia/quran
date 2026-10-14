import type { Surah } from "@/lib/surahs";

export function SurahList({ surahs }: { surahs: Surah[] }) {
  if (surahs.length === 0) {
    return (
      <p className="text-muted-foreground px-4 py-10 text-center text-sm">
        لا توجد نتائج مطابقة
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {surahs.map((surah) => (
        <li key={surah.id}>
          <button
            type="button"
            className="border-border/70 hover:bg-muted/50 flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-start text-sm transition-colors"
          >
            <span>سورة {surah.name}</span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {surah.ayahCount} آيات
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
