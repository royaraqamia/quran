import { HomeScreen } from "@/components/home/home-screen";
import type { Goal } from "@/components/home/goal-card";

// TODO: replace with the user's final wording — currently the screenshot text.
const goal: Goal = {
  title: "الهدف",
  value: "12 آيات / بالشهر",
  change: "+12.5%",
  summary: "50+ آية خلال آخر أسبوع",
  detail: "أنت بقيت مستمر لـ 7 أيام",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeScreen goal={goal} />
    </main>
  );
}
