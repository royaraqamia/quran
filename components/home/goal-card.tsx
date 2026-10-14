export type Goal = {
  /** Small label above the target, e.g. الهدف */
  title: string;
  /** Big value, e.g. 10 آيات/باليوم */
  value: string;
  /** Signed change shown in the pill, e.g. +12.5% */
  change: string;
  /** Primary sentence under the value */
  summary: string;
  /** Secondary, muted sentence under the value */
  detail: string;
};

export function GoalCard({ goal }: { goal: Goal }) {
  return (
    <section className="bg-card border-border/70 rounded-2xl border p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs">{goal.title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight">
            {goal.value}
          </p>
        </div>
        <span className="bg-success text-success-foreground shrink-0 rounded-md px-2 py-1 text-xs font-medium">
          {goal.change}
        </span>
      </header>
      <div className="mt-4 space-y-1 text-sm">
        <p className="font-medium">{goal.summary}</p>
        <p className="text-muted-foreground">{goal.detail}</p>
      </div>
    </section>
  );
}
