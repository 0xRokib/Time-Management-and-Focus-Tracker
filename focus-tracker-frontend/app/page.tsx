import { PomodoroTimer } from "@/components/PomodoroTimer";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <PomodoroTimer />
      </div>
      {/* <div className="grid gap-6 md:grid-cols-2">
        <FocusDashboard />
        <GamificationDisplay />
      </div> */}
    </div>
  );
}
